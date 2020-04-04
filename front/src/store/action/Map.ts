import {
	createAction as _createAction,
	PayloadAction,
	PrepareAction
} from '@reduxjs/toolkit'
import {LatLngExpression, LatLngLiteral} from "leaflet";
import {Poi} from "../../../../back/src/interfaces/Poi";
import {BoundingBox, Marker} from "../interface/Map";


const createAction = <P>(name: string) => _createAction<P>(`map/${name}`);

export const changeZoomLevel = createAction<number>("changeZoomLevel");

export const changePosition = createAction<LatLngLiteral>("changePosition");

export const setPois = createAction<Poi[]>("setPois")
export const setBoundingBox = createAction<BoundingBox>("setBoundingBox")
//

export const addCustomMarker = createAction<Marker[]>("addCustomMarker")
export const removeCustomMarker = createAction<Marker>("removeCustomMarker")
export const setStartMarker = createAction<LatLngLiteral>("setStartMarker");
export const setDestMarker = createAction<LatLngLiteral>("setDestMarker");
export const changeMarkerPos = createAction<ChangeMarkerPosFn>("changeMarkerPos");


export type ChangeMarkerPosFn = { newPos: LatLngLiteral, oldPos: LatLngLiteral };


