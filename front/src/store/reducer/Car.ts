import {createReducer} from "@reduxjs/toolkit";

import {addCar, setCar} from "../action/Car";
import {init as initCar} from "../../constants/car";
import {CarData} from "../../../../back/src/Car";


export interface State {
    current: string,
    cars: {
        [key:string]: CarData
    }
}


const initialState: State = {
    current: initCar,
    cars: {}
};

export const reducer = createReducer<State>(initialState, builder => {

    builder.addCase(addCar, (state, action) => {
        state.cars[action.payload.id as string] = action.payload
    });

    builder.addCase(setCar, (state, action) => {
        state.current = action.payload
    })

});





