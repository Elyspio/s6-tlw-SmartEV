import {createReducer} from "@reduxjs/toolkit";
import {addCar, setCar} from "../action/Car";
import {init as initCar, localStorageKeys} from "../../constants/Car";
import {CarData, CarId} from "../../../../back/src/interfaces/Car";


export interface State {
	current?: CarId,
	cars: Cars
}


const initialState: State = {
	current: initCar,
	cars: new window.Map<CarId, CarData>()
};

export type Cars = Map<CarId, CarData>;

export const reducer = createReducer<State>(initialState, builder => {

	builder.addCase(addCar, (state, action) => {
		state.cars.set(action.payload.id, action.payload)
	});

	builder.addCase(setCar, (state, action) => {
		state.current = action.payload
		if (action.payload) {
			localStorage.setItem(localStorageKeys.car, action.payload)
		}
	})
});





