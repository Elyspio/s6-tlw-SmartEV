import {createReducer} from "@reduxjs/toolkit";

import {
    addCustomMarker,
    changePosition,
    changeZoomLevel,
    removeCustomMarker,
    setBoundingBox,
    setPois
} from "../action/Map";
import {init as initMap} from "../../constants/Map";
import {State} from "../interface/Map";


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

        if (state.pois.length < action.payload.length) {
            state.pois = action.payload
        } else {
            action.payload.forEach((poi) => {
                if (state.pois.findIndex(p => p.id === poi.id) === -1) {
                    state.pois.push(poi);
                }
            })
        }

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

});





