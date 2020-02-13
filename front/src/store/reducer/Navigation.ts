import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import {
    backward,
    forward,
    setCurrentLocation,
    setLocation
} from "../action/Navigation";


export interface State {
    current: string[],
    history: {
        prev: string[][],
        post: string[][]
    }
    lastAPIsUpdate: number | null
}


const initialState: State = {
    current: ["/"],
    history: {
        prev: [],
        post: [],
    },
    lastAPIsUpdate: null
};


function updateLocation(newLocation: string) {
    window.history.replaceState(newLocation,  newLocation, newLocation);
}

export const reducer = createReducer<State>(initialState, builder => {
    builder.addCase(setLocation, (state: State, action: PayloadAction<string>) => {
        state.current = action.payload.split("/");
        state.lastAPIsUpdate = Date.now();
        updateLocation(state.current.join("/"));
    });

    builder.addCase(setCurrentLocation, (state, action) => {
        state.current[state.current.length - 1] = action.payload
        state.lastAPIsUpdate = Date.now();
        updateLocation(state.current.join("/"));
    })

    builder.addCase(forward, (state) => {
        const next = state.history.post.pop()
        if (next) {
            state.history.prev.push(state.current);
            state.current = next
            updateLocation(state.current.join("/"));
        }
    })
    builder.addCase(backward, (state) => {
        const prev = state.history.prev.pop()
        if (prev) {
            state.history.post.push(state.current);
            state.current = prev
            state.lastAPIsUpdate = Date.now();
            updateLocation(state.current.join("/"));
        }
    })

});





