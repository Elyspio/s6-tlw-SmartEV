import {createReducer} from "@reduxjs/toolkit";

import {init as initMap} from "../../constants/map"

import {
	addCustomMarker, changeMarkerPos,
	changePosition,
	changeZoomLevel,
	removeCustomMarker,
	setBoundingBox,
	setDestMarker,
	setPois,
	setStartMarker
} from "../action/Map";
import {MarkerType, State} from "../interface/Map";


const initialState: State = {
	zoom: initMap.zoom,
	position: {
		lng: 45.7640, lat: 4.8357
	},
	pois: [],
	boundingBox: null,
	customMarker: []
};

export const reducer = createReducer<State>(initialState, builder => {

	builder.addCase(changeZoomLevel, (state, action) => {
		state.zoom = action.payload
	});

	builder.addCase(changePosition, (state, action) => {
		state.position = action.payload
	})

	builder.addCase(setPois, (state, action) => {

		// if (state.pois.length < action.payload.length) {
		//     state.pois = action.payload
		// } else {
		//     action.payload.forEach((poi) => {
		//         if (state.pois.findIndex(p => p.id === poi.id) === -1) {
		//             state.pois.push(poi);
		//         }
		//     })
		// }

		state.pois = action.payload;

	})

	builder.addCase(setStartMarker, (state, action) => {
		const index = state.customMarker.findIndex(m => m.type === MarkerType.startPoint)
		state.customMarker = [...state.customMarker.slice(0, index), {
			type: MarkerType.startPoint,
			pos: action.payload
		}, ...state.customMarker.slice(index + 1)]

	})

	builder.addCase(setDestMarker, (state, action) => {
		const index = state.customMarker.findIndex(m => m.type === MarkerType.destPoint)
		state.customMarker = [...state.customMarker.slice(0, index), {
			type: MarkerType.destPoint,
			pos: action.payload
		}, ...state.customMarker.slice(index + 1)]
	})

	builder.addCase(setBoundingBox, (state, action) => {
		state.boundingBox = action.payload
	})

	builder.addCase(addCustomMarker, (state, action) => {
		state.customMarker = [...action.payload, ...state.customMarker]

	})

	builder.addCase(removeCustomMarker, (state, action) => {
		const markerIndex = state.customMarker.findIndex(m => m === action.payload)
		state.customMarker = state.customMarker.slice(markerIndex, 1);
	})

	builder.addCase(changeMarkerPos, (state, action) => {
		const index = state.customMarker.findIndex(m => m.pos.lng === action.payload.oldPos.lng && m.pos.lat === action.payload.oldPos.lat);
		console.log(state, state.customMarker[0], state.customMarker[0], action.payload.oldPos);
		state.customMarker[index].pos = action.payload.newPos;
		state.customMarker = JSON.parse(JSON.stringify(state.customMarker));
	})

});





