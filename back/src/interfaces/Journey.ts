import { GeoJSON, LatLngTuple } from "leaflet";

type Geometry = GeoJSON.LineString;

export type Journey = {
	routes: Route[];
	waypoints: Waypoint[];
	code: "Ok" | string;
	uuid: string;
};

export interface Route {
	legs: Leg[];
	weight_name: string;
	geometry: Geometry;
	distance: number;
	duration: number;
	weight: number;
}

export interface Leg {
	steps: Step[];
	summary: string;
	/* A number indicating the distance traveled between waypoints in meters. */
	distance: number;
	/* A number indicating the estimated travel time between waypoints in seconds. */
	duration: number;
	weight: number;
}

/* [longitude, latitude] */

export interface Lane {
	valid: boolean;
	indictations: ("none" | "straight" | "sharp-left" | "sharp-right" | "left" | "right" | "uturn" | "slight right" | "slight left")[];
}

export interface Intersection {
	/* List exits of the intersection */
	bearings: Angle[];
	/* Tells if you can turn on a exit */
	entry: boolean[];
	geometry_index: 0;
	/* The index in the bearings and entry arrays of the chosen exit */
	out: number;
	location: LatLngTuple;
	classes: IntersectionClass[];
	lanes?: Lane[];
}

export interface Step {
	intersections: Intersection[];
	name: string;
	distance: number;
	maneuver: {
		/* An angle from true north to the direction of travel immediately after the maneuver.*/
		bearing_after: Angle;
		/* An angle from true north to the direction of travel immediately before the maneuver.*/
		bearing_before: Angle;
		type: ManeuverType;
		location: LatLngTuple;
		instruction: string;
		modifier?: string;
	};
	weight: number;
	geometry: Geometry;
	duration: number;
	mode: "driving";
	driving_side: "left" | "right";
}

export interface Waypoint {
	name: string;
	location: LatLngTuple;
	distance?: number;
}

export type PolyLine = string;
/* Angle from the real north */
export type Angle = number;

export type IntersectionClass = "toll" | "ferry" | "restricted" | "motorway" | "tunnel";
export type ManeuverType =
	| "turn"
	| "new name"
	| "depart"
	| "arrive"
	| "merge"
	| "on ramp"
	| "off ramp"
	| "fork"
	| "end of road"
	| "continue"
	| "roundabout"
	| "rotary"
	| "roundabout turn"
	| "notification"
	| "exit roundabout"
	| "exit rotary";
