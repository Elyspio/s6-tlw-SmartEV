import {createReducer} from "@reduxjs/toolkit";

import {changeZoomLevel} from "../action/Map";
import {init as initMap} from "../../constants/map";


export interface State {
    zoom: number,
}


const initialState: State = {
    zoom: initMap.zoom
};

export const reducer = createReducer<State>(initialState, builder => {

    builder.addCase(changeZoomLevel, (state, action) => {
        state.zoom = action.payload
    });


});





