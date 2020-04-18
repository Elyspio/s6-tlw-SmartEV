import { Request } from "express";
import { CarId } from "./Car";

export interface PoiQuery extends Request {
	query: {
		coordonates: {
			southWest: Coordonate;
			northEast: Coordonate;
		};
		car: CarId;
	};
}

export interface ItineraireQuery extends Request {
	query: {
		waitpoints: Coordonate[];
		car: CarId;
	};
}

export interface CarQuery extends Request {
	query: {
		name: CarId;
	};
}

export interface Coordonate {
	lng: number;
	lat: number;
}

export interface GeocodingQuery extends Request {
	query: {
		place: [number, number] | string;
	};
}
