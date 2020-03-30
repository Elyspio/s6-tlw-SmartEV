export type Poi = {
	id: number;
	operational: true;
	usageCost: "Free" | string;
	addressInfo: {
		title: string;
		addressLine1: string;
		addressLine2: string;
		town: string;
		stateOrProvince: string;
		postcode: string;
		countryIsoCode: string;
		countryTitle: string;
		latitude: number;
		longitude: number;
		accessComments: string;
	};
	generalComments: string;
	connections: Connection[];
};

type Connection = {
	connectionTypeId: number;
	isOperational: boolean;
	powerKW: number | null;
	quantity: number;
	comments: string;
};
