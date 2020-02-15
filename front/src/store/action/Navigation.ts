import {createAction as _createAction, PrepareAction} from '@reduxjs/toolkit'
import {baseApiPath, host, port, protocol} from '../../constants/Server';

const createAction = <P>(name: string) => _createAction<P>(`navigation/${name}`);

export const setLocation = createAction<string>("setLocation");
export const setCurrentLocation = createAction<string>("setCurrentLocation")
export const forward = createAction("forward");
export const backward = createAction("backward");
const baseUrl = `${protocol}://${host}:${port}/${baseApiPath}`;


//
// export function getApi(url: string) {
//     return (dispatch: Dispatch) => {
//         fetch(url).then(raw => raw.json()).then(json => {
//             console.log(url, json);
//             dispatch(setCurrentLocation(json));
//         })
//     }
// }
