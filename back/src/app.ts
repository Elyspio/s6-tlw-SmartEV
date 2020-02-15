import * as path from "path";
import {CarQuery, ItineraireQuery, PoiQuery} from "./interfaces";
import {Express} from 'express'
import fetch from 'node-fetch'
import {CarData, cars} from "./Car";
import cors from "cors";

const express = require("express");
const app: Express = express();

const cacheFile = path.join(__dirname, "toto.json");
const apiUrl = "https://api.openchargemap.io/v3/poi/";

// fs.writeFileSync(cache   File, {data: 123});
// const data = fs.readFileSync(cacheFile);

app.use(cors())


app.get("/", async (req, res) => {
    res.json({status: "ok"})
});

app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});

app.get("/itineraire", (req: ItineraireQuery, res) => {          // latitude longitude A et B + type voiture => {polyline, [points de charge]}

});

app.get("/car", (req: CarQuery, res) => {             // id voiture => {voiture}
    return res.json({...cars[req.query.name], id: req.query.name});
});

app.get("/poi", async (req: PoiQuery, res) => {    // latitude longitude + bounding box (zoom) => [points de charge]

    if(req.query.car && req.query.coordonates) {
        const car: CarData = cars[req.query.car];
        const poi = await Promise.all(car.connectors.map(connector =>
            fetch(apiUrl + `?maxresults=1000&connectiontypeid=${connector}` +
                `&verbose=false&boundingbox=(${req.query.coordonates.northEast.latitude},${req.query.coordonates.northEast.longitude})` +
                `,(${req.query.coordonates.southWest.latitude};${req.query.coordonates.northEast.longitude})`)
        ));

        res.json(poi);
    }
    else {
        res.json({
            error: "BAD ARGUMENTS",
        })
    }


});
