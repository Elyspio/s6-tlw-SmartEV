export type CarData = {
	model: string;
	battery: number;
	range: number;
	maxPower: number;
	connectors: number[];
	id?: string; // id is autoflied
};

export type CarId = "zoe" | "teslaModel3";
