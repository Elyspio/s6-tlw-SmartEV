import { Poi } from "../interfaces/Poi";
import { LatLngLiteral, LatLngTuple } from "leaflet";

export function distance(A: LatLngTuple, B: LatLngTuple): number {
	return (A[0] - B[0]) ** 2 + (A[1] - B[1]) ** 2;
}
