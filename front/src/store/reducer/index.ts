import {reducer as routerReducer, State as RouterState} from "./Navigation";
import {reducer as carReducer, State as CarState} from "./Car";

export interface StoreState {
    router: RouterState,
    car: CarState
}

export default {
    router: routerReducer,
    car: carReducer
}
