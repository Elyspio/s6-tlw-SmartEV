import { Express } from "express";
import fs from "fs";
import path from "path";
import { CarQuery, Coordonate, GeocodingQuery, ItineraireQuery, PoiQuery } from "../interfaces/Query";
import { cars } from "../data/Car";
import { CarData } from "../interfaces/Car";
import { Poi } from "../interfaces/Poi";
import { JourneyService } from "../service/Journey";
import { GeocodingService } from "../service/Geocoding";

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
	try {
		const journey = await service.travel(car, ...waypoints);
		return res.json(journey);
	} catch (e) {
		return res.status(422).json({ type: "travel error", message: "could not find a travel" });
	}
});

back.get("/geocoding", async (req: GeocodingQuery, res) => {
	const service = new GeocodingService();

	if ((req.query.place as string).startsWith("[")) {
		req.query.place = JSON.parse(req.query.place.toString());
	}

	res.send(JSON.stringify({ result: await service.convert(req.query.place) }));
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
