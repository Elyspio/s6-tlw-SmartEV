import React, {Component} from 'react';
import {Map as LeafletMap, Marker, Popup, TileLayer} from "react-leaflet";
import {LatLngExpression, LeafletEvent} from "leaflet";
import './Map.css'
import {Paper} from "@material-ui/core";
import {Localisation} from "../../services/localisation";
import {Backend} from "../../services/backend";

type State = {
    lat: number,
    lng: number,
    zoom: number,
}

export default class MapComponent extends Component<{}, State> {
    state = {
        lat: 46.49390189209105,
        lng: 2.451366218749995,
        zoom: 6,
    };

    async componentDidMount(): Promise<void> {
        const localisation = await Localisation.getUserLocalisation();
        this.setState({
            lat: localisation.latitude,
            lng: localisation.longitude,
            zoom: 10
        })
    }

    render() {
        const position: LatLngExpression = [this.state.lat, this.state.lng];
        return (
            <Paper className={"Map"}>
                <LeafletMap
                    center={position}
                    zoom={this.state.zoom}
                    onzoomend={this.onZoomLevelsChange}
                    ref={"map"}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup >
                            A pretty CSS3 popup. <br/> Easily customizable.
                        </Popup>
                    </Marker>
                </LeafletMap>
            </Paper>

        )
    }

    private onZoomLevelsChange = (e: LeafletEvent) => {
        // @ts-ignore
        const {_southWest,_northEast} = this.refs.map.leafletElement.getBounds();
        console.log(_southWest)
        Backend.getPOI({
            southWest: _southWest,
            nordEast: _northEast
        })

    }
}
