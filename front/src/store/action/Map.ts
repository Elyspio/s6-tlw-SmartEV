import {createAction as _createAction, Dispatch} from '@reduxjs/toolkit'
import {baseApiPath, host, port, protocol} from '../../constants/Server';
import {CarData} from "../../../../back/src/Car";
import {cars} from "../../constants/car";


const createAction = <P>(name: string) => _createAction<P>(`map/${name}`);

export const changeZoomLevel = createAction<number>("changeZoomLevel");
const baseUrl = `${protocol}://${host}:${port}/${baseApiPath}`;


//


