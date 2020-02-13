import * as fs from "fs";
import * as path from "path";
import { ItineraireQuery, CarQuery, PoiQuery } from "./interfaces";
import { Express } from 'express'
import fetch from 'node-fetch'
const express = require("express")
const app: Express = express();

const cacheFile = path.join(__dirname, "toto.json");
const apiUrl = "https://api.openchargemap.io/v3/poi/";

// fs.writeFileSync(cache   File, {data: 123});
// const data = fs.readFileSync(cacheFile);


app.get("/", async (req, res) => {
    res.json({ status: "ok" })
})

app.listen(4000, () => {
    console.log("Server is listening on port 4000");
})

app.get("/itineraire", (req: ItineraireQuery, res) => {          // latitude longitude A et B + type voiture => {polyline, [points de charge]}

});

app.get("/car", (req: CarQuery, res) => {             // id voiture => {voiture}

});

app.get("/poi", async (req: PoiQuery, res) => {    // latitude longitude + radius (zoom) => [points de charge]

    await (await fetch(apiUrl + `?maxresults=1000&connectiontypeid=${req.query.car.connectionTypeIds}` +
        `&verbose=false&boundingbox=(${req.query.coordonates.topLeft.latitude},${req.query.coordonates.topLeft.longitude})` +
        `,(${req.query.coordonates.bottomRight.latitude};${req.query.coordonates.bottomRight.longitude})`)).json()
});
