import * as path from "path";
import { Express } from "express";
const express = require("express");

const staticFolder = path.resolve(__dirname, "../../../front/build");

export const front: Express = express();
front.use(express.static(staticFolder));
front.all("/", (req, res) => {
	res.sendFile(path.join(staticFolder, "index.html"));
});
