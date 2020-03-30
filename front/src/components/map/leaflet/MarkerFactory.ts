import {GroupedMarker, Marker, MarkerType} from "../../../store/interface/Map";
import * as L from "leaflet";
import {LatLngLiteral} from "leaflet";

export class MarkerFactory {
    static groupByTypes(markers: Marker[]): GroupedMarker {
        return {
            dest: markers.filter(m => m.type === MarkerType.destPoint)[0],
            poi: markers.filter(m => m.type === MarkerType.chargePoint),
            start: markers.filter(m => m.type === MarkerType.startPoint)[0]
        }
    }

    static createMarker(latLng: LatLngLiteral, markerType: MarkerType) {
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
