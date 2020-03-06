import {baseApiPath, host, port, protocol} from "../constants/Server";
import {CarData} from "../../../back/src/Car";
import {LatLngLiteral} from "leaflet";

export class Backend {

	private static baseUrl = `${protocol}://${host}:${port}/${baseApiPath}`;

	public static async getPOI(borderBox: { southWest: LatLngLiteral, northEast: LatLngLiteral }, carName: string) {
		const raw = await fetch(`${Backend.baseUrl}poi?${this.encodeQueryData({
			coordonates: borderBox,
			car: carName
		})}`)
		const text = await raw.text();
		return JSON.parse(text)
	}

	public static async getCar(carId: string): Promise<CarData> {
		const raw = await fetch(`${this.baseUrl}car?${this.encodeQueryData({name: carId})}`)
		const text = await raw.text();
		console.log(text);
		return JSON.parse(text)
	}

	private static encodeQueryData(data: { [key: string]: any }) {
		const ret = [];
		for (let d in data) {
			const obj = typeof data[d] == "object" ? JSON.stringify(data[d]) : data[d];
			ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(obj));
		}
		return ret.join('&');
	}
}

