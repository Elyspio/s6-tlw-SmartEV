import {CarId} from "../../../back/src/interfaces/Car";

export const localStorageKeys = {
	car: "user_car"
}

export const init = (localStorage.getItem(localStorageKeys.car) as CarId) ?? undefined;
export const cars = ["zoe", "teslaModel3"]
