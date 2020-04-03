import {baseUrl} from "../constants/Server";
import {CarData} from "../../../back/src/interfaces/Car";
import {LatLngLiteral} from "leaflet";
import {TravelPoint} from "../store/reducer/Travel";
import {Journey} from "../../../back/src/interfaces/Journey";

export class Backend {


	public static async getPOI(borderBox: { southWest: LatLngLiteral, northEast: LatLngLiteral }, carName: string) {
		const raw = await fetch(`${baseUrl}poi?${this.encodeQueryData({
			coordonates: borderBox,
			car: carName
		})}`)
		const text = await raw.text();
		try {
			return JSON.parse(text)
		} catch (e) {
			console.error(text, e);
			throw  e;
		}
	}

	public static async getCar(carId: string): Promise<CarData> {
		const raw = await fetch(`${baseUrl}car?${this.encodeQueryData({name: carId})}`)
		const text = await raw.text();
		console.log(text);

		try {
			return JSON.parse(text)
		} catch (e) {
			console.error(text, e);
			throw  e;
		}
	}

	public static async getJourney(start: TravelPoint, dest: TravelPoint, car: CarData): Promise<Journey> {
		const raw = await fetch(`${baseUrl}travel?${this.encodeQueryData({
			waitpoints: [start.pos, dest.pos],
			car: car.id
		})}`)
		const text = await raw.text();
		try {
			return JSON.parse(text)
		} catch (e) {
			console.error(text, e);
			throw  e;
		}
	}

	static async ping(): Promise<boolean> {
		try {
			await fetch(baseUrl)
			return true;
		} catch (e) {
			return false;
		}
	}

	private static encodeQueryData(data: { [key: string]: any }) {
		const ret = [];
		for (let d in data) {
			const obj = typeof data[d] == "object" ? JSON.stringify(data[d]) : data[d];
			ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(obj));
		}
		return ret.join('&');
	}
}

