import { Coordonate } from "../interfaces/Query";
import { Journey, Step } from "../interfaces/Journey";
import { Poi } from "../interfaces/Poi";
import { default as axios } from "axios";
import { CarData } from "../interfaces/Car";
import { CoordConverter, distanceFromPoint } from "../util/Helper";

export class JourneyService {
	public static readonly token = "pk.eyJ1Ijoic21hcnRldiIsImEiOiJjazZ1d2ViaTIwZDVpM2ltczNpcTJrZG1mIn0.LEob5CaIG6lgwGGXS4kN-w";
	private static readonly offset = 0.95;
	private pois: Poi[];

	constructor(pois: Poi[]) {
		this.pois = pois;
	}

	public async travel(car: CarData, ...coordonates: Coordonate[]): Promise<Journey> {
		const journey = await this.fetchMapbox(coordonates);
		// console.log("trying with point ", coordonates);
		const route = journey.routes[0];
		const lastLeg = route.legs[route.legs.length - 1];
		const lastLegSteps = lastLeg.steps;
		const distance = lastLeg.distance / 1000; // m -> Km

		const maxRange = car.range * JourneyService.offset;
		if (distance > maxRange) {
			// console.log(`Distance ${distance} km > ${maxRange} km`);
			// console.log("trying to get a charging station");

			const arr = [...lastLegSteps];
			let lastStep;
			for (let i = arr.length - 1; i > 0; i--) {
				if (this.getLenghtFromSteps(i, arr) < maxRange) {
					lastStep = arr[i];
					break;
				}
			}

			// const lastStep = lastLegSteps.reduceRight((current, next, currentIndex) => {
			// 	return this.getLenghtFromSteps(currentIndex, lastLegSteps) > maxRange ? next : current;
			// });
			const cost = this.getLenghtFromSteps(lastStep, lastLegSteps);
			const remainingAutonomy = car.range - cost;
			console.log("Remaning autonomy: ", car.range, cost, remainingAutonomy);
			const poi = this.pois.find((p) => {
				const number = distanceFromPoint(
					CoordConverter.mapboxToLeaflet(lastStep.maneuver.location),
					CoordConverter.openStreetMapToLeaflet(p.addressInfo)
				);
				// console.log("distance from point (in km)", number, remainingAutonomy);
				return number < remainingAutonomy * JourneyService.offset;
			});

			const last = coordonates.pop();
			coordonates.push(CoordConverter.openStreetMapToLeaflet(poi.addressInfo));
			coordonates.push(last);

			return this.travel(car, ...coordonates);
		}

		return journey;
	}

	private getLenghtFromSteps(index: number | Step, steps: Step[]): number {
		let i;
		if ((index as Step).distance !== undefined) {
			i = steps.indexOf(index as Step);
		} else {
			i = index;
		}

		const slice = steps.slice(0, i);

		const map = slice.map((s) => s.distance);
		const reduce = map.reduce((a, b) => a + b) / 1000;

		return reduce;
	}

	private fetchMapbox(waitpoints: Coordonate[]): Promise<Journey> {
		const waitPointStr = waitpoints.map(this.coordonateToString).join(";");

		const options = {
			alternatives: false,
			geometries: "geojson",
			steps: true,
			overview: "full",
			access_token: JourneyService.token,
			language: "fr"
		};

		const optionsStr = Object.keys(options)
			.map((key) => `${key}=${options[key]}`)
			.join("&");

		const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waitPointStr}?${optionsStr}`;
		console.log("fetchMapbox", url);
		return axios.get(url).then((raw) => raw.data);
	}

	private coordonateToString = (coord: Coordonate) => `${coord.lng},${coord.lat}`;
}
