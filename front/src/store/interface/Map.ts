import {LatLngLiteral} from "leaflet";
import {Poi} from "../../../../back/src/interfaces/Poi";

export interface Marker {
	pos: LatLngLiteral,
	type: MarkerType
	data?: Poi
}

export enum MarkerType {
	startPoint,
	destPoint,
	chargePoint
}

export  type BoundingBox = {
	_southWest: LatLngLiteral, _northEast: LatLngLiteral
};

export interface State {
	zoom: number,
	pois: Poi[]
	customMarker: Marker[]
}

export type GroupedMarker = {
	pois: Marker[],
	dest: Marker,
	start: Marker
}

