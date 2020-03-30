import { Poi } from "../interfaces/Poi";

export function distance(A: Poi, B: Poi): number {
	return (A.addressInfo.latitude - B.addressInfo.latitude) ** 2 + (A.addressInfo.longitude - B.addressInfo.longitude) ** 2;
}
