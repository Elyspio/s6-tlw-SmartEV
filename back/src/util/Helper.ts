import { LatLngLiteral, LatLngTuple, layerGroup } from "leaflet";
import { Coordonate } from "../interfaces/Query";

export namespace CoordConverter {
	export const mapboxToLeaflet = (coord: [number, number]): LatLngLiteral => {
		return {
			lng: coord[0],
			lat: coord[1]
		};
	};

	export const openStreetMapToLeaflet = (coord: { latitude: number; longitude: number }) => {
		return {
			lng: coord.longitude,
			lat: coord.latitude
		};
	};
}

export function distanceFromPointSquared(A: LatLngTuple, B: LatLngTuple): number {
	return (A[0] - B[0]) ** 2 + (A[1] - B[1]) ** 2;
}

export function distanceFromPoint(A: LatLngLiteral, B: LatLngLiteral): number {
	const { lng: lon1, lat: lat1 } = A;
	const { lng: lon2, lat: lat2 } = B;

	const p = Math.PI / 180; // Math.PI / 180
	const c = Math.cos;
	const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

	return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

export const coordonateToString = (coord: Coordonate) => `${coord.lng},${coord.lat}`;
