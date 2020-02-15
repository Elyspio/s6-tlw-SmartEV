import {Request} from 'express'
import {CarData} from "./Car";


export interface PoiQuery extends Request {
    query: {
        coordonates: {
            southWest: Coordonate,
            northEast: Coordonate,
        },
        car: string
    }
}

export interface ItineraireQuery extends Request {
    query: {
        from: Coordonate,
        to: Coordonate
        car: CarData
    }
}


export interface CarQuery extends Request {
    query: {
        name: string,
    }
}


export interface Coordonate {
    longitude: number,
    latitude: number
}
