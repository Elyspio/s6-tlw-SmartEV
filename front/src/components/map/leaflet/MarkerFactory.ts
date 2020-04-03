import {GroupedMarker, Marker, MarkerType} from "../../../store/interface/Map";
import * as L from "leaflet";
import {LatLngExpression} from "leaflet";
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
}
