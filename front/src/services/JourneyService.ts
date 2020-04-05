import {LatLngLiteral} from "leaflet";
import {CarId} from "../../../back/src/interfaces/Car";
import {Journey} from "../../../back/src/interfaces/Journey";
import {baseUrl} from "../constants/Server";
import {Backend} from "./backend";

export class JourneyService {
	public static async getJourney(start: LatLngLiteral, dest: LatLngLiteral, carId: CarId): Promise<Journey> {
		const json = await fetch(`${baseUrl}travel?${Backend.encodeQueryData({
			waitpoints: [start, dest],
			car: carId
		})}`).then(raw => raw.json())

		if(MapboxError.has(json.code)) throw MapboxError.get(json.code)

		return json;

	}

}



export const MapboxError = new Map<string, Error>([
	["NoRoute", new Error("No route had been found for this travel")],
	["InvalidInput", new Error("Search in server log for more informations")],
]);
