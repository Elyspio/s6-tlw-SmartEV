
import {Request} from 'express'

export interface Car {
    name: string,
    maxCharge: number,
    range: number,
    connectionTypeIds: string
}

export interface PoiQuery extends Request {
    query: {
        coordonates: {
            topLeft: Coordonate,
            bottomRight: Coordonate
        },
        car: Car
    }
}

export interface ItineraireQuery extends Request {
    query: {
        from: Coordonate,
        to: Coordonate
        car: Car
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