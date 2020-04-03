import {createAction as _createAction, Dispatch} from '@reduxjs/toolkit'
import {CarData} from "../../../../back/src/interfaces/Car";
import {Backend} from "../../services/backend";


const createAction = <P>(name: string) => _createAction<P>(`car/${name}`);

export const addCar = createAction<CarData>("addCar");
export const setCar = createAction<string | undefined>("setsCar");

export function getCar(name: string) {
	return (dispatch: Dispatch) => {
		return Backend.getCar(name).then(data => dispatch(addCar(data)))
	}
}

