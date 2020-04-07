import { CarData, CarId } from "../interfaces/Car";

const zoe: CarData = {
	model: "Renault Zoe R75",
	battery: 41,
	range: 290,
	maxPower: 22,
	connectors: [25, 1036],
	id: "zoe"
};
const teslaModel3: CarData = {
	model: "Tesla Model 3",
	battery: 57,
	range: 485,
	maxPower: 170,
	connectors: [27],
	id: "teslaModel3"
};
export const cars: { [key in CarId]: CarData } = {
	zoe,
	teslaModel3
};
