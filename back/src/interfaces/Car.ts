export type CarData = {
	model: string;
	battery: number;
	range: number;
	maxPower: number;
	connectors: number[];
	id: CarId; // id is autoflied
};

export type CarId = "zoe" | "teslaModel3";
