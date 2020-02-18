import React, {Component} from 'react';
import {Map as LeafletMap, Marker, Popup, TileLayer} from "react-leaflet";
import * as Leaflet from "leaflet";
import {LatLngExpression, LeafletEvent} from "leaflet";
import './Map.css'
import {Paper} from "@material-ui/core";
import {Localisation} from "../../services/localisation";
import {Backend} from "../../services/backend";
import ContextMenu from "./ContextMenu";
import {StoreState} from "../../store/reducer";
import {connect} from "react-redux";

export type ContextMenuData = {
    screenPos: {
        x: number,
        y: number
    };
    geoPos: {
        lat: number,
        lng: number
    };
    visible: boolean;
}


type StoreProps = {
    zoomLevel: number
}

const  mapStateToProps = (store: StoreState) =>  {
    return {
        zoomLevel: store.map.zoom
    }
}

type State = {
    lat: number,
    lng: number,
    contextMenu?: ContextMenuData,
    mouse?: {
        x: number,
        y: number
    }
}

class MapComponent extends Component<StoreProps, State> {
    state: State = {
        lat: 46.49390189209105,
        lng: 2.451366218749995,
    };

    async componentDidMount(): Promise<void> {
        const localisation = await Localisation.getUserLocalisation();
        this.setState({
            lat: localisation.latitude,
            lng: localisation.longitude,
        })
    }

    render() {
        let state = this.state;
        const position: LatLngExpression = [state.lat, state.lng];

        const contextPopup = state.contextMenu ? <ContextMenu
            data={this.state.contextMenu as ContextMenuData}/> : null


        return <Paper className={"Map"}>
            <LeafletMap
                center={position}
                zoom={this.props.zoomLevel}
                onzoomend={this.onZoomLevelsChange}
                ref={"map"}
                oncontextmenu={this.handleContextMenu}
                onclick={this.onclick}
                ondragstart={this.closeContextMenu}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br/> Easily customizable.
                    </Popup>
                </Marker>
            </LeafletMap>
            {/*<Menu*/}
            {/*    keepMounted*/}
            {/*    open={state.contextMenu != undefined}*/}
            {/*    onClose={this.closeContextMenu}*/}
            {/*    anchorReference="anchorPosition"*/}
            {/*    onContextMenu={this.closeContextMenu}*/}
            {/*    anchorPosition={*/}
            {/*        state.contextMenu?.screenPos.y  && state.contextMenu?.screenPos.x*/}
            {/*            ? { top: state.contextMenu?.screenPos.y, left: state.contextMenu?.screenPos.x }*/}
            {/*            : undefined*/}
            {/*    }*/}
            {/*>*/}
            {/*    <MenuItem onClick={this.closeContextMenu}>Copy</MenuItem>*/}
            {/*    <MenuItem onClick={this.closeContextMenu}>Print</MenuItem>*/}
            {/*    <MenuItem onClick={this.closeContextMenu}>Highlight</MenuItem>*/}
            {/*    <MenuItem onClick={this.closeContextMenu}>Email</MenuItem>*/}
            {/*</Menu>*/}
            {contextPopup}

        </Paper>
    }

    private closeContextMenu = () => {
        this.setState({
            contextMenu: undefined
        })
    }

    private onZoomLevelsChange = (e: LeafletEvent) => {
        // @ts-ignore
        const {_southWest, _northEast} = this.refs.map.leafletElement.getBounds();
        console.log(_southWest)
        Backend.getPOI({
            southWest: _southWest,
            nordEast: _northEast
        })
        this.closeContextMenu();
    }

    private handleContextMenu = (event: Leaflet.LeafletMouseEvent) => {
        console.log(event);
        this.setState({
            contextMenu: {
                visible: true,
                geoPos: event.latlng,
                screenPos: {
                    x: event.originalEvent.clientX,
                    y: event.originalEvent.clientY
                }
            },
        })
        event.originalEvent.preventDefault();
    }
    private onclick = (event: Leaflet.LeafletMouseEvent) => {
        console.log("ON CLICK", event);
        this.closeContextMenu()
    }
}

export default connect(mapStateToProps, null)(MapComponent) as any
