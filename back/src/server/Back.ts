import { Express } from "express";
import fs from "fs";
import path from "path";
import { CarQuery, Coordonate, ItineraireQuery, PoiQuery } from "../interfaces/Query";
import { default as axios } from "axios";
import { cars } from "../data/Car";
import { CarData } from "../interfaces/Car";
import { Poi } from "../interfaces/Poi";
import { coordonateToString, distanceFromPointSquared } from "../util/Helper";
import { Journey } from "../interfaces/Journey";
import { JourneyService } from "../service/Journey";

const cors = require("cors");
const express = require("express");
export const back: Express = express();

const apiUrl = "https://api.openchargemap.io/v3/poi/";

const apiCache: Poi[] = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/poi.fr.json")).toString());
const token = "pk.eyJ1Ijoic21hcnRldiIsImEiOiJjazZ1d2ViaTIwZDVpM2ltczNpcTJrZG1mIn0.LEob5CaIG6lgwGGXS4kN-w";

back.use(cors());

back.get("/", async (req, res) => {
	res.json({ status: "ok" });
});

// https://nominatim.org/release-docs/develop/api/Reverse/

back.get("/travel", async (req: ItineraireQuery, res) => {
	req.query.waitpoints = JSON.parse(req.query.waitpoints.toString());
	const waypoints: Coordonate[] = req.query.waitpoints;

	console.log(`Request a travel for car ${req.query.car}`, waypoints);
	console.time("a");
	const car = cars[req.query.car];

	const compatiblePois = apiCache.filter((poi: Poi) => poi.connections.some((poiCo) => car.connectors.some((carCo) => carCo === poiCo.connectionTypeId)));

	const service = new JourneyService(compatiblePois);
	const journey = await service.travel(car, ...waypoints);
	// let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints
	// 	.map(coordonateToString)
	// 	.join(";")}?alternatives=false&geometries=geojson&steps=true&overview=full&access_token=${token}`;
	// try {
	// 	let response = await axios.get(url);
	// 	if (response.data.code !== "Ok") {
	// 		throw new Error(response.data);
	// 	}
	// 	travel = response.data;
	// } catch (e) {
	// 	console.error("Error in mapbox call", e);
	// 	return res.status(500).json({
	// 		service: "Mapbox",
	// 		message: JSON.stringify(e)
	// 	});
	// }
	//
	// console.timeEnd("a");
	//
	// const car = cars[req.query.car];
	// const carRange = car.range * 1000; // get car range in meters instead of kilometers
	//
	// while (travel.routes[0].legs[travel.routes[0].legs.length - 1].distance > carRange) {
	// 	let currentDistance = 0;
	// 	let currentStep = 0;
	//
	// 	while (currentDistance < (carRange * 90) / 100 && currentStep < travel.routes[0].legs[travel.routes[0].legs.length - 1].steps.length) {
	// 		currentDistance += travel.routes[0].legs[travel.routes[0].legs.length - 1].steps[currentStep].distance;
	// 		currentStep++;
	// 	} // get first point to be after 90% of the car's range
	//
	// 	currentStep--;
	//
	// 	const lastStep = travel.routes[0].legs[travel.routes[0].legs.length - 1].steps[currentStep];
	//
	// 	const compatiblePois = apiCache.filter((poi: Poi) => poi.connections.some((poiCo) => car.connectors.some((carCo) => carCo === poiCo.connectionTypeId)));
	//
	// 	const chargePointToUse = compatiblePois.reduce((previousPoi, currentPoi, currentIndex) => {
	// 		const { latitude: latP, longitude: longP } = previousPoi.addressInfo;
	// 		const { latitude: latC, longitude: longC } = currentPoi.addressInfo;
	// 		if (distanceFromPointSquared([latP, longP], lastStep.maneuver.location) < distanceFromPointSquared([latC, longC], lastStep.maneuver.location))
	// 			return previousPoi;
	// 		return currentPoi;
	// 	});
	//
	// 	const last = waypoints.pop();
	// 	waypoints.push({
	// 		lng: chargePointToUse.addressInfo.longitude,
	// 		lat: chargePointToUse.addressInfo.latitude
	// 	});
	// 	waypoints.push(last);
	//
	// 	try {
	// 		url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints
	// 			.map(coordonateToString)
	// 			.join(";")}?alternatives=false&geometries=geojson&steps=true&overview=full&access_token=${token}`;
	// 		console.log("url", url);
	// 		let response = await axios.get(url);
	// 		if (response.data.code !== "Ok") {
	// 			throw new Error(response.data);
	// 		}
	// 		travel = response.data;
	// 		console.log("Routes", travel);
	// 	} catch (e) {
	// 		console.error("Error in mapbox call", e);
	// 		return res.status(500).json({
	// 			service: "Mapbox",
	// 			message: JSON.stringify(e)
	// 		});
	// 	}
	// }

	return res.json(journey);
});

back.get("/car", (req: CarQuery, res) => {
	// id voiture => {voiture}
	return res.json({ ...cars[req.query.name], id: req.query.name });
});

back.get("/poi", async (req: PoiQuery, res) => {
	// latitude longitude + bounding box (zoom) => [points de charge]

	if (req.query.car && req.query.coordonates) {
		const car: CarData = cars[req.query.car];

		const coords = JSON.parse(req.query.coordonates.toString());
		console.log(coords);
		let pois: Poi[];

		if (true) {
			pois = apiCache.filter((poi: Poi) => poi.connections.some((poiCo) => car.connectors.some((carCo) => carCo === poiCo.connectionTypeId)));
			console.log(pois.length);
			pois = pois.filter(
				(poi: Poi) =>
					poi.addressInfo.latitude < coords.northEast.lat &&
					poi.addressInfo.latitude > coords.southWest.lat &&
					poi.addressInfo.longitude < coords.northEast.lng &&
					poi.addressInfo.longitude > coords.southWest.lng
			);
			console.log(pois.length);
		} else {
			// pois = JSON.parse(await fetch(`${apiUrl}?
			// maxresults=3000&
			// connectiontypeid=${cars.connectors.join(",")}&
			// verbose=false&boundingbox=(${coords.northEast.latitude},${coords.northEast.longitude}),(${coords.southWest.latitude},${coords.northEast.longitude})`).then((e => e.text())));
		}

		res.json(pois);
	} else {
		res.status(400).json({
			badArguments: req.query
		});
	}
});
