import React, {Component} from 'react';
import * as L from 'leaflet'
import * as Leaflet from 'leaflet'
import {GeoJSON, LatLng, LatLngExpression, LayerGroup, LeafletMouseEvent} from 'leaflet'
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import {Poi} from "../../../../back/src/interfaces/Poi";
import {StoreState} from "../../store/reducer";
import {Dispatch} from "redux";
import {changePosition, setBoundingBox, setPois} from "../../store/action/Map";
import {connect} from "react-redux";
import {Localisation} from "../../services/localisation";
import {Backend} from "../../services/backend";
import ContextMenu from "./ContextMenu";
import './Map.css'
import {BoundingBox, Marker, MarkerType} from "../../store/interface/Map";
import {MarkerFactory} from "./leaflet/MarkerFactory";

export type ContextMenuData = {
    screenPos: {
        x: number,
        y: number
    };
    geoPos: {
        lat: number,
        lng: number
    };
}


type StoreProps = {
    zoomLevel: number,
    carId?: string;
    mapPosition: LatLngExpression,
    pois: Poi[],
    customMarkers: Marker[],
    geoJson?: GeoJSON.GeoJsonObject
}

const mapStateToProps = (store: StoreState) => {
    return {
        zoomLevel: store.map.zoom,
        carId: store.car.current,
        mapPosition: store.map.position,
        pois: store.map.pois,
        customMarkers: store.map.customMarker,
        geoJson: store.travel.journey?.routes[0].geometry
    }
}

type DispatchProps = {
    changeMapPosition: Function,
    setPois: Function,
    setBoundingBox: Function,
}

type Props = DispatchProps & StoreProps & {}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeMapPosition: (position: LatLngExpression) => {
            dispatch(changePosition(position))
        },
        setPois: (pois: Poi[]) => {
            dispatch(setPois(pois))
        },
        setBoundingBox: (boundingBox: BoundingBox) => {
            dispatch(setBoundingBox(boundingBox))
        },
    }
}
type State = {
    contextMenu?: ContextMenuData,
    markerInfo?: {
        position: ContextMenuData,
        data: Marker
    }
    mouse?: {
        x: number,
        y: number
    },
    boundingBox?: BoundingBox,
    markers?: Marker[]
}

class CustomMap extends Component<Props, State> {
    public state: State = {}
    private map?: L.Map;
    private cluster?: L.MarkerClusterGroup;
    private travelMarkers?: LayerGroup;
    private geoJsonLayer?: any

    static getDerivedStateFromProps(props: Props, state: State) {
        console.log("STP2", props);

        return {
            ...state,
            markers: [...props.customMarkers, ...props.pois.map(poi => {
                return {
                    type: MarkerType.chargePoint,
                    pos: {
                        lat: poi.addressInfo.latitude,
                        lng: poi.addressInfo.longitude
                    },
                    data: poi,
                }
            })]
        }
    }


    private static getEventData(event: LeafletMouseEvent) {
        return {
            geoPos: event.latlng,
            screenPos: {
                x: event.originalEvent.clientX,
                y: event.originalEvent.clientY
            }
        };
    }

    async componentDidUpdate(props: Props) {
        // check if data has changed
        // if (this.props.markersData !== markersData) {
        // 	this.updateMarkers(this.props.markersData);
        // }
        console.log("componentDidUpdate", props);

        await this.refreshCustomMakers();
        await this.refreshGeoJson();
    }

    async componentDidMount() {

        const pos = await Localisation.getUserLocalisation()

        this.map = this.mapEvents(this.createMap(pos));

        let bounds = this.map.getBounds();
        const _southWest = bounds.getSouthWest();
        const _northEast = bounds.getNorthEast();
        const pois: Poi[] = await Backend.getPOI({
            southWest: {lat: _southWest.lat, lng: _southWest.lng},
            northEast: {lat: _northEast.lat, lng: _northEast.lng}
        }, this.props.carId as string)

        this.props.setPois(pois);
        console.log("componentDidMount PROPS", this.props);

        await this.refreshPoi();

    }

    render() {
        const state = this.state;
        console.log("je s'appel render", this.state, this.props);
        const contextPopup = state.contextMenu ? <ContextMenu
            data={state.contextMenu}
            closeModal={this.closeContextMenu}
        /> : null
        return (
            <div>
                <div id={"leaflet"}>
                </div>
                {contextPopup}
            </div>

        );
    }

    private async refreshCustomMakers() {
        const grouped = MarkerFactory.groupByTypes(this.state.markers as Marker[])

        if(this.map) {
            if (this.travelMarkers) {
                this.map.removeLayer(this.travelMarkers);
            }

            this.travelMarkers = L.layerGroup();
            let marker
            if (grouped.start) {
                marker = MarkerFactory.createMarker(grouped.start.pos, MarkerType.startPoint);
                marker.on("click", (evt: LeafletMouseEvent) => this.onMarkerClick(evt, grouped.start));
                this.travelMarkers.addLayer(marker);
            }
            if (grouped.dest) {
                marker = MarkerFactory.createMarker(grouped.dest.pos, MarkerType.destPoint);
                marker.on("click", (evt: LeafletMouseEvent) => this.onMarkerClick(evt, grouped.dest));
                this.travelMarkers.addLayer(marker);
            }
            this.map?.addLayer(this.travelMarkers);

        }



    }
    private refreshGeoJson() {
        console.log(this.props);
        if(this.props.geoJson) {
            if(this.geoJsonLayer) {
                this.map?.removeLayer(this.geoJsonLayer);
            }
            this.geoJsonLayer = new L.GeoJSON(this.props.geoJson as any);
            this.map?.addLayer(this.geoJsonLayer);
        }
    }
    private async refreshPoi() {
        if (this.map) {
            if (this.cluster) {
                this.map?.removeLayer(this.cluster);
            }

            if (this.state.markers) {
                const grouped = MarkerFactory.groupByTypes(this.state.markers)
                this.cluster = L.markerClusterGroup();
                this.cluster.addLayers(grouped.poi.map(poi => {

                    return MarkerFactory.createMarker(poi.pos, MarkerType.chargePoint).on("click", (event: LeafletMouseEvent) => {
                        const marker = grouped.poi.find(poi => poi.pos as LatLng === event.latlng);
                        if (marker === undefined) {
                            throw new Error(`Can not find poi marker with coords=${JSON.stringify(poi.pos)}`)
                        }
                        this.onMarkerClick(event, marker);
                    })
                }))

                this.map?.addLayer(this.cluster);
            }
        }

    }

    private onMarkerClick(event: LeafletMouseEvent, marker: Marker) {
        this.setState({
            markerInfo: {
                position: CustomMap.getEventData(event),
                data: marker
            }
        })
        console.log("click on poi marker");
    }


    private mapEvents = (map: L.Map) => {
        map.on("contextmenu", this.handleContextMenu)
        map.on("movestart", this.closeContextMenu)
        map.on("click", this.closeContextMenu)
        return map;
    }

    private createMap(pos: LatLngExpression) {
        let map = L.map('leaflet', {
            center: pos,
            zoom: 3,
            maxZoom: 16,
            minZoom: 3,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}),
            ],
        });


        return map;
    }

    private handleContextMenu = (event: Leaflet.LeafletMouseEvent) => {
        console.log(event);
        this.setState({
            contextMenu: CustomMap.getEventData(event),
        })
        event.originalEvent.preventDefault();
    }

    private closeContextMenu = () => {
        this.setState({
            contextMenu: undefined
        })

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomMap) as any;
