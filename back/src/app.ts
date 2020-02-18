import * as path from "path";
import {CarQuery, ItineraireQuery, PoiQuery} from "./interfaces";
import {Express} from 'express'
import fetch from 'node-fetch'
import {CarData, cars} from "./Car";
import cors from "cors";
import * as fs from 'fs'
import {Poi} from "./Poi";

const express = require("express");
const app: Express = express();

const cacheFile = path.join(__dirname, "toto.json");
const apiUrl = "https://api.openchargemap.io/v3/poi/";

const cache = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/poi.fr.json")).toString())


// fs.writeFileSync(cache   File, {data: 123});
// const data = fs.readFileSync(cacheFile);

app.use(cors())


app.get("/", async (req, res) => {
    res.json({status: "ok"})
});

app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});

app.get("/travel", (req: ItineraireQuery, res) => {          // latitude longitude A et B + type voiture => {polyline, [points de charge]}
    
});

app.get("/car", (req: CarQuery, res) => {             // id voiture => {voiture}
    return res.json({...cars[req.query.name], id: req.query.name});
});

app.get("/poi", async (req: PoiQuery, res) => {    // latitude longitude + bounding box (zoom) => [points de charge]

    if (req.query.car && req.query.coordonates) {
        const car: CarData = cars[req.query.car];
        let pois: Poi[] = [];

        if (true) {
            pois = cache.filter(poi => poi.connections.some(poiCo => car.connectors.some(carCo => carCo === poiCo)));
            const coords = req.query.coordonates;
            pois = pois.filter(poi => poi.addressInfo.latitude < coords.northEast.latitude && poi.addressInfo.latitude > coords.southWest.latitude && 
                                      poi.addressInfo.longitude > coords.northEast.longitude && poi.addressInfo.longitude < coords.southWest.longitude);
        } else {
            pois = JSON.parse(await fetch(`${apiUrl}?
            maxresults=3000&
            connectiontypeid=${car.connectors.join(",")}&
            verbose=false&boundingbox=(${req.query.coordonates.northEast.latitude},${req.query.coordonates.northEast.longitude}),(${req.query.coordonates.southWest.latitude},${req.query.coordonates.northEast.longitude})`).then((e => e.text())));

        }

        res.json(pois);
    } else {
        res.json({
            error: "BAD ARGUMENTS",
        })
    }
});
