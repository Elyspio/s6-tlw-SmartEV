import { default as axios } from "axios";
import { JourneyService } from "./Journey";

export class GeocodingService {
	private baseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places`;

	public async convert(pos: [number, number] | string): Promise<[number, number] | string> {
		if (pos instanceof Array) {
			const result = await this.get(`${this.baseUrl}/${pos[0]},${pos[1]}.json?types=address&country=fr`);
			console.log(JSON.stringify(result.data));
			return result.data.features[0]?.place_name;
		}
		if (typeof pos === "string") {
			const result = await this.get(`${this.baseUrl}/${pos}.json?types=address&country=fr`);
			console.log(JSON.stringify(result.data));
			return result.data.features[0]?.geometry?.coordinates;
		}
	}

	private get = (url) => axios.get(`${url}&access_token=${JourneyService.token}&language=fr`);
}
