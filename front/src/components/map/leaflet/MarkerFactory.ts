import {GroupedMarker, Marker, MarkerType} from "../../../store/interface/Map";
import * as L from "leaflet";
import {LatLngExpression, LatLngLiteral} from "leaflet";
import {Poi} from "../../../../../back/src/interfaces/Poi";

export class MarkerFactory {
	static groupByTypes(markers: Marker[]): GroupedMarker {

		const dest: Marker[] = [], pois: Marker[] = [], start: Marker[] = []
		const mapping = new Map<MarkerType, Array<Marker>>()
		mapping.set(MarkerType.chargePoint, pois);
		mapping.set(MarkerType.destPoint, dest);
		mapping.set(MarkerType.startPoint, start);
		markers.forEach(value => mapping.get(value.type)?.push(value))

		return {
			dest: dest[0],
			pois: pois,
			start: start[0]
		}
	}

	static convert(poi: Poi): Marker {
		return {
			type: MarkerType.chargePoint,
			pos: {
				lat: poi.addressInfo.latitude,
				lng: poi.addressInfo.longitude
			}
		}
	}


	static createMarker(latLng: LatLngExpression, markerType: MarkerType) {
		let icon;
		switch (markerType) {
			case MarkerType.destPoint:
				icon = this.createIcon("red")
				break;
			case MarkerType.startPoint:
				icon = this.createIcon("green");
				break;

			case MarkerType.chargePoint:
				icon = this.createIcon("blue")
				break;
		}
		return L.marker(latLng, {
			icon: icon,
			draggable: markerType === MarkerType.destPoint || markerType === MarkerType.startPoint,
			autoPan: markerType === MarkerType.destPoint || markerType === MarkerType.startPoint,
			keyboard: markerType !== MarkerType.chargePoint
		})
	}

	static createIcon(color: "blue" | "red" | "gold" | "green" | "orange" | "yellow" | "violet" | "grey" | "black") {
		return L.icon({
			iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
			shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		})
	}

	static equal(a: LatLngLiteral, b: LatLngLiteral): boolean;
	static equal(a: Marker, b: Marker): boolean;

	static equal(a: LatLngLiteral | Marker, b: LatLngLiteral | Marker) {
		if ((a as Marker).pos !== undefined && (b as Marker).pos !== undefined) {
			a = a as Marker;
			b = b as Marker;
			return MarkerFactory.equal(a.pos, b.pos) && a.type === b.type
		}

		if ((a as LatLngLiteral).lat !== undefined && (b as LatLngLiteral).lat !== undefined) {
			a = a as LatLngLiteral;
			b = b as LatLngLiteral;
			return a.lat === b.lat && a.lng === b.lat;
		}

	}
}
