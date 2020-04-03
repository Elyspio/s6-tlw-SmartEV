import {createAction as _createAction} from '@reduxjs/toolkit'
import {LatLngExpression} from "leaflet";
import {Poi} from "../../../../back/src/interfaces/Poi";
import {BoundingBox, Marker} from "../interface/Map";


const createAction = <P>(name: string) => _createAction<P>(`map/${name}`);

export const changeZoomLevel = createAction<number>("changeZoomLevel");

export const changePosition = createAction<LatLngExpression>("changePosition");

export const setPois = createAction<Poi[]>("setPois")
export const setBoundingBox = createAction<BoundingBox>("setBoundingBox")
//

export const addCustomMarker = createAction<Marker[]>("addCustomMarker")
export const removeCustomMarker = createAction<Marker>("removeCustomMarker")
export const setStartMarker = createAction<LatLngExpression>("setStartMarker");
export const setDestMarker = createAction<LatLngExpression>("setDestMarker");
