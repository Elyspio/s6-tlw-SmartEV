import {reducer as routerReducer, State as RouterState} from "./Navigation";

export interface StoreType {
    router: RouterState,
}

export default {
    router: routerReducer
}
