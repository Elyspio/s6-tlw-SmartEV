import { Express } from "express";
import fs from "fs";
import path from "path";
import { CarQuery, ItineraireQuery, PoiQuery } from "../interfaces/Query";
import { default as axios } from "axios";
import { cars } from "../data/Car";
import { CarData } from "../interfaces/Car";
import { Poi } from "../interfaces/Poi";
import { distance } from "../util/Helper";

const cors = require("cors");
console.log(cors);
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
	const waypoints = req.query.waitpoints.map((coord) => `${coord.lng},${coord.lat}`).join(";");

	console.log(`Request a travel for car ${req.query.car}`, waypoints);
	console.time("a");

	let travel;

	try {
		let response = await axios.get(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?alternatives=false&geometries=geojson&steps=true&overview=full&access_token=${token}`
		);
		if (response.data.code !== "Ok") {
			throw new Error(response.data);
		}
		travel = response.data;
	} catch (e) {
		console.error("Error in mapbox call", e);
		return res.status(500).json({
			service: "Mapbox",
			message: JSON.stringify(e)
		});
	}

	console.timeEnd("a");

	const car = cars[req.query.car];
	const carRange = car.range * 1000; // get car range in meters instead of kilometers

	if (false && travel.routes[0].distance > carRange) {
		let currentDistance = 0;
		let currentStep = 0;

		while (currentDistance < carRange) {
			currentDistance += travel.routes[0].legs[travel.routes[0].legs.length - 1].steps[currentStep].distance;
			currentStep++;
		} // get first point to be after 90% of the car's range

		currentStep--;

		const lastStep = travel.routes[0].legs[travel.routes[0].legs.length - 1].steps[currentStep];

		const compatiblePois = apiCache.filter((poi: Poi) => poi.connections.some((poiCo) => car.connectors.some((carCo) => carCo === poiCo.connectionTypeId)));

		const chargePointToUse = compatiblePois.reduce((previousPoi, currentPoi, currentIndex) => {
			const { latitude: latP, longitude: longP } = previousPoi.addressInfo;
			const { latitude: latC, longitude: longC } = currentPoi.addressInfo;
			if (distance([latP, longP], lastStep.maneuver.location) < distance([latC, longC], lastStep.maneuver.location)) return previousPoi;
			return currentPoi;
		});
		travel.routes[0].legs[travel.routes[0].legs.length - 1].steps[currentStep].maneuver.location;
	}

	return res.json(travel);
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
