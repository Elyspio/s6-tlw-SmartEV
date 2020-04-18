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

		if (MapboxError.has(json.code)) throw MapboxError.get(json.code)

		return json;

	}

	public static splitTime(duration: number): { hours: number, minutes: number, seconds: number } {

		const h = Math.floor(duration / 3600);
		duration %= 3600;
		const mn = duration / 60;
		duration %= 60;
		const s = duration;

		return {
			hours: h,
			minutes: mn,
			seconds: s
		}
	}

	public static splitDistance(distance: number): { km: number, m: number } {

		const km = Math.floor(distance / 1000);
		distance %= 1000;
		const m = distance;

		return {
			km: km,
			m: m
		}
	}


}


export const MapboxError = new Map<string, Error>([
	["NoRoute", new Error("No route had been found for this travel")],
	["InvalidInput", new Error("Search in server log for more informations")],
]);
