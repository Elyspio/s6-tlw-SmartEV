import React, {Component} from 'react';
import * as L from 'leaflet'
import * as Leaflet from 'leaflet'
import {
	GeoJSON,
	LatLng,
	LatLngExpression,
	LayerGroup,
	LeafletMouseEvent
} from 'leaflet'
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
import './Map.scss'
import {BoundingBox, Marker, MarkerType} from "../../store/interface/Map";
import {MarkerFactory} from "./leaflet/MarkerFactory";
import {init as defaultPosition} from "../../constants/Map";
import * as Logger from "../../services/Logger";

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
	geoJson?: GeoJSON.LineString
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
	markers: Marker[],
	car: {
		id?: string,
	},
	travel?: {
		polyline: GeoJSON.LineString
	},
	refresh: {
		car: boolean,
		pois: boolean,
		customMarkers: boolean,
		polyline: boolean
	}
}

class CustomMap extends Component<Props, State> {
	public state: State = {
		markers: [],
		refresh: {
			car: true,
			customMarkers: false,
			pois: true,
			polyline: false
		},
		car: {}
	}
	private map?: L.Map;
	private cluster?: L.MarkerClusterGroup;
	private travelMarkers?: LayerGroup;
	private geoJsonLayer?: any

	static getDerivedStateFromProps(props: Props, state: State): State {
		const logger = new Logger.Function("getDerivedStateFromProps", true)
		logger.log("props", props);
		logger.log("state", state);

		const stateMarkers = MarkerFactory.groupByTypes(state.markers);
		logger.log("stateMarkers", stateMarkers);

		let reloadCustomMarker = (stateMarkers.start === undefined && props.customMarkers.find(m => m.type === MarkerType.startPoint) !== undefined); // s'il y a un marker start dans le props et non dans le state
		reloadCustomMarker = reloadCustomMarker || (stateMarkers.dest === undefined && props.customMarkers.find(m => m.type === MarkerType.destPoint) !== undefined);   // s'il y a un marker dest dans le props et non dans le state
		reloadCustomMarker = reloadCustomMarker || (stateMarkers.start ? props.customMarkers.find(m => m && m.pos === stateMarkers.start.pos) === undefined : false);          // s'il y a un nouveau marker start
		reloadCustomMarker = reloadCustomMarker || (stateMarkers.dest ? props.customMarkers.find(m => m && m.pos === stateMarkers.dest.pos) === undefined : false)             // s'il y a un nouveau marker dest


		logger.log("refresh", reloadCustomMarker);
		logger.end();
		return {
			...state,
			refresh: {
				car: props.carId !== state.car?.id,
				pois: stateMarkers.pois.length !== props.pois.length,
				customMarkers: reloadCustomMarker,
				polyline: state.travel?.polyline.coordinates.length !== props.geoJson?.coordinates.length || false
			},
			car: {
				id: props.carId,
			},

			markers: [...props.customMarkers, ...props.pois.map(MarkerFactory.convert)]
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

	public async componentDidUpdate(props: Props) {

		console.log("componentDidUpdate", props);
		await this.refresh()


	}

	public async componentDidMount() {

		let pos;
		try {
			pos = await Localisation.getUserLocalisation()
		} catch (e) {
			pos = defaultPosition;
		}

		this.map = this.mapEvents(this.createMap(pos));


		await this.refresh();
	}

	public render() {
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

	private async refresh() {
		const {start, dest, pois} = MarkerFactory.groupByTypes(this.state.markers);
		const l = new Logger.Function("refresh");
		l.log({start, dest, pois}, this.state.refresh)
		l.end();
		if (this.state.refresh.customMarkers) {
			await this.refreshCustomMakers({start, dest})
		}
		if (this.state.refresh.pois) {
			await this.refreshPoiMarkers(pois);
		}

		if (this.state.refresh.car) {
			await this.fetchPois();
		}

		if(this.state.refresh.polyline) {
			await this.refreshGeoJson();
		}

	}

	private async fetchPois() {

		const pois: Poi[] = await Backend.getPOI({
			southWest: {lat: -90, lng: -180},
			northEast: {lat: 90, lng: 180}
		}, this.state.car.id as string)
		this.props.setPois(pois);
	}

	private async refreshCustomMakers({start, dest}: { start: Marker, dest: Marker }) {
		if (this.map) {
			if (this.travelMarkers) {
				this.map.removeLayer(this.travelMarkers);
			}
			this.travelMarkers = L.layerGroup();
			let marker
			if (start) {
				marker = MarkerFactory.createMarker(start.pos, MarkerType.startPoint);
				marker.on("click", (evt: LeafletMouseEvent) => this.onMarkerClick(evt, start));
				this.travelMarkers.addLayer(marker);
			}
			if (dest) {
				marker = MarkerFactory.createMarker(dest.pos, MarkerType.destPoint);
				marker.on("click", (evt: LeafletMouseEvent) => this.onMarkerClick(evt, dest));
				this.travelMarkers.addLayer(marker);
			}
			this.map?.addLayer(this.travelMarkers);

		}


	}

	private refreshGeoJson() {
		console.log(this.props);
		if (this.props.geoJson) {
			if (this.geoJsonLayer) {
				this.map?.removeLayer(this.geoJsonLayer);
			}
			this.geoJsonLayer = new L.GeoJSON(this.props.geoJson as any);
			this.map?.addLayer(this.geoJsonLayer);
		}
	}

	private async refreshPoiMarkers(pois: Marker[]) {
		if (this.map) {
			if (this.cluster) {
				this.map?.removeLayer(this.cluster);
			}

			if (this.state.markers) {
				this.cluster = L.markerClusterGroup();
				this.cluster.addLayers(pois.map(poi => {

					return MarkerFactory.createMarker(poi.pos, MarkerType.chargePoint).on("click", (event: LeafletMouseEvent) => {
						const marker = pois.find(poi => poi.pos as LatLng === event.latlng);
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
			minZoom: 3,
			zoomControl: false,
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
