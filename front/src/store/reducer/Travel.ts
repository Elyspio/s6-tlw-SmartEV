import {createReducer} from "@reduxjs/toolkit";

import {setDestPoint, setJourney, setStartPoint} from '../action/Travel';
import {LatLngLiteral} from "leaflet";
import {Journey} from "../../../../back/src/interfaces/Journey";

export interface TravelPoint {
	pos: LatLngLiteral
	time?: Date
}

export interface State {
	startPoint?: TravelPoint,
	destPoint?: TravelPoint,
	journey?: Journey
}


const initialState: State = {};

export const reducer = createReducer<State>(initialState, builder => {

	builder.addCase(setStartPoint, (state, action) => {
		state.startPoint = action.payload;
	});

	builder.addCase(setDestPoint, (state, action) => {
		state.destPoint = action.payload;
	})

	builder.addCase(setJourney, (state, action) => {
		state.journey = action.payload;
	})
});





