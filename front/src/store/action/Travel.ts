import {createAction as _createAction, Dispatch} from '@reduxjs/toolkit'
import {Backend} from "../../services/backend";
import {TravelPoint} from "../reducer/Travel";
import {CarData} from "../../../../back/src/interfaces/Car";
import {Journey} from "../../../../back/src/interfaces/Journey";


const createAction = <P>(name: string) => _createAction<P>(`car/${name}`);

export const setStartPoint = createAction<TravelPoint>("setStartPoint");
export const setDestPoint = createAction<TravelPoint>("setDestPoint");
export const setJourney = createAction<Journey>("setJourney")

export function getTravelSteps(start: TravelPoint, dest: TravelPoint, car: CarData) {
    return (dispatch: Dispatch) => {
        return Backend.getJourney(start, dest, car).then((data: Journey) => dispatch(setJourney(data)))
    }
}

