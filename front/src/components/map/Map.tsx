import React, {Component} from 'react';
import * as L from 'leaflet'
import * as Leaflet from 'leaflet'
import {
	DragEndEvent,
	GeoJSON,
	LatLng,
	LatLngExpression,
	LatLngLiteral,
	LayerGroup,
	LeafletMouseEvent
} from 'leaflet'
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import {Poi} from "../../../../back/src/interfaces/Poi";
import {StoreState} from "../../store/reducer";
import {
	changeMarkerPos,
	ChangeMarkerPosFn,
	setPois
} from "../../store/action/Map";
import {connect} from "react-redux";
import {Localisation} from "../../services/localisation";
import {Backend} from "../../services/backend";
import ContextMenu from "./ContextMenu";
import './Map.scss'
import {BoundingBox, Marker, MarkerType} from "../../store/interface/Map";
import {MarkerFactory} from "./leaflet/MarkerFactory";
import {init as defaultPosition} from "../../constants/map"
import * as Logger from "../../services/Logger";
import {getTravelSteps} from "../../store/action/Travel";
import {CarId} from "../../../../back/src/interfaces/Car";
import {Snackbar} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';

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
	pois: Poi[],
	customMarkers: Marker[],
	geoJson?: GeoJSON.LineString | Error
}

const mapStateToProps = (store: StoreState) => {


	let geoJson;
	if (store.travel.journey?.routes) {
		geoJson = store.travel.journey?.routes[0].geometry;
	} else {
		geoJson = new Error("Could not find a travel for this waitpoints")
	}
	return {
		zoomLevel: store.map.zoom,
		carId: store.car.current,
		pois: store.map.pois,
		customMarkers: store.map.customMarker,
		geoJson: geoJson
	}
}

type DispatchProps = {
	setPois: Function,
	changeMarkerPos: ({newPos, oldPos}: { newPos: LatLngLiteral, oldPos: LatLngLiteral }) => void,
	getTravel: (start: LatLngLiteral, dest: LatLngLiteral, car: CarId) => void
}

type Props = DispatchProps & StoreProps & {}

const mapDispatchToProps = (dispatch: Function) => {
	return {
		setPois: (pois: Poi[]) => {
			dispatch(setPois(pois))
		},
		changeMarkerPos: ({newPos, oldPos}: ChangeMarkerPosFn) => {
			dispatch(changeMarkerPos({newPos, oldPos}))
		},
		getTravel: (start: LatLngLiteral, dest: LatLngLiteral, car: CarId) => {
			dispatch(getTravelSteps(start, dest, car))
		}
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
		polyline?: GeoJSON.LineString,
		error: boolean
	},
	refresh: {
		car: boolean,
		pois: boolean,
		customMarkers: boolean,
		polyline: boolean
	},

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


		let polyline

		if (props.geoJson instanceof Error) {
			polyline = false;
		} else {
			polyline = state.travel?.polyline?.coordinates.length !== props.geoJson?.coordinates.length || false;

		}

		return {
			...state,
			refresh: {
				car: props.carId !== state.car?.id,
				pois: stateMarkers.pois.length !== props.pois.length,
				customMarkers: reloadCustomMarker,
				polyline: polyline
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

		console.log("componentDidUpdate", props, this.state);
		if(!this.state.travel?.error && props.customMarkers.length === 2 && props.geoJson instanceof Error) {
			this.setState(prev => ({
				...prev,
				travel: {
					...prev.travel,
					error: true,
				}
			}))
		}
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
				<Snackbar open={this.state.travel?.error && this.props.geoJson instanceof Error} autoHideDuration={6000} onClose={this.handleClose}>
					<Alert onClose={this.handleClose} severity="error">
						Aucun chemin n'a été trouvé pour ce trajet
					</Alert>
				</Snackbar>
			</div>

		);
	}

	private handleClose = () => {
		this.setState(prev => ({
			...prev,
			travel: {
				...prev.travel,
				error: false,
			}
		}))
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

		if (this.state.refresh.polyline) {
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
			if (start) {
				this.travelMarkers.addLayer(this.createCustomMarker(MarkerType.startPoint, start));
			}
			if (dest) {
				this.travelMarkers.addLayer(this.createCustomMarker(MarkerType.destPoint, dest));
			}

			if (start && dest && this.state.car.id) {
				this.props.getTravel(start.pos, dest.pos, this.state.car.id as CarId);
				this.removeGeoJson();
			}

			this.map?.addLayer(this.travelMarkers);

		}
	}

	private createCustomMarker(type: MarkerType, marker: Marker): L.Marker {
		const m = MarkerFactory.createMarker(marker.pos, type);
		m.on("click", (evt: LeafletMouseEvent) => this.onMarkerClick(evt, marker));
		m.on("dragend", (event) => this.onMarkerMove(event, marker.pos as LatLngLiteral));
		return m;
	}

	private removeGeoJson() {
		if (this.props.geoJson) {
			if (this.geoJsonLayer) {
				this.map?.removeLayer(this.geoJsonLayer);
			}
		}
	}

	private refreshGeoJson() {
		if (this.props.geoJson) {
			this.removeGeoJson();
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

	private onMarkerMove(event: DragEndEvent, originalPos: LatLngLiteral) {
		const newPos = event.target.getLatLng()
		this.props.changeMarkerPos({
			newPos: {lng: newPos.lng, lat: newPos.lat},
			oldPos: {lng: originalPos.lng, lat: originalPos.lat}
		})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomMap) as any;
