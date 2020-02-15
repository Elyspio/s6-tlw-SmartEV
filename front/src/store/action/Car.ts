import {createAction as _createAction, Dispatch} from '@reduxjs/toolkit'
import {baseApiPath, host, port, protocol} from '../../constants/Server';
import {CarData} from "../../../../back/src/Car";
import {cars} from "../../constants/car";


const createAction = <P>(name: string) => _createAction<P>(`car/${name}`);

export const addCar = createAction<CarData>("addCar");
export const setCar = createAction<string>("setsCar");
const baseUrl = `${protocol}://${host}:${port}/${baseApiPath}`;


//
export function getCar(name: string) {
    const url = `${baseUrl}car?name=${name}`
    console.log(url);
    return (dispatch: Dispatch) => {
        fetch(url).then(raw => raw.json()).then(json => {
            console.log(url, json);
            dispatch(addCar(json));
        })
    }
}

