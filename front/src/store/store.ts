import reducers from './reducer'
import logger from "redux-logger";
import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import {enableMapSet} from "immer"

enableMapSet();
export const store = configureStore({
	reducer: reducers,
	devTools: true,
	// @ts-ignore
	middleware: [logger, ...getDefaultMiddleware()]
});



