import {reducer as routerReducer, State as RouterState} from "./Navigation";
import {reducer as carReducer, State as CarState} from "./Car";
import {reducer as mapReducer, State as MapState} from "./Map";

export interface StoreState {
    router: RouterState,
    car: CarState,
    map: MapState
}

export default {
    router: routerReducer,
    car: carReducer,
    map: mapReducer
}
