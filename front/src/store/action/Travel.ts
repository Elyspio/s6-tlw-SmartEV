import {createAction as _createAction, Dispatch} from '@reduxjs/toolkit'
import {Backend} from "../../services/backend";
import {TravelPoint} from "../reducer/Travel";
import {CarData, CarId} from "../../../../back/src/interfaces/Car";
import {Journey} from "../../../../back/src/interfaces/Journey";
import {LatLngLiteral} from "leaflet";


const createAction = <P>(name: string) => _createAction<P>(`car/${name}`);

export const setStartPoint = createAction<TravelPoint>("setStartPoint");
export const setDestPoint = createAction<TravelPoint>("setDestPoint");
export const setJourney = createAction<Journey>("setJourney")

export function getTravelSteps(start: LatLngLiteral, dest: LatLngLiteral, car: CarId) {
	return (dispatch: Dispatch) => {
		return Backend.getJourney(start, dest, car).then((data: Journey) => dispatch(setJourney(data)))
	}
}
