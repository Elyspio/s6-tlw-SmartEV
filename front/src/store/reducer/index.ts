import {reducer as carReducer, State as CarState} from "./Car";
import {reducer as mapReducer,} from "./Map";
import {reducer as travelReducer, State as TravelState} from './Travel'
import {State as MapState} from "../interface/Map";

export interface StoreState {
	travel: TravelState,
	car: CarState,
	map: MapState
}

export default {
	travel: travelReducer,
	car: carReducer,
	map: mapReducer
}
