import React, {Component} from 'react';
import {Button, Paper} from "@material-ui/core";
import {ContextMenuData} from "./Map";
import './ContextMenu.css'
import {Directions, Place} from "@material-ui/icons";
import {connect} from "react-redux";
import {StoreState} from "../../store/reducer";
import {MarkerType} from "../../store/interface/Map";
import {LatLngLiteral} from "leaflet";
import {
	getTravelSteps,
	setDestPoint,
	setStartPoint
} from "../../store/action/Travel";
import {TravelPoint} from "../../store/reducer/Travel";
import {CarData, CarId} from "../../../../back/src/interfaces/Car";
import {setDestMarker, setStartMarker} from "../../store/action/Map";
import Typography from "@material-ui/core/Typography";
import {setCar} from "../../store/action/Car";
import {Cars} from "../../store/reducer/Car";

interface StateProps {
	travel: {
		start?: TravelPoint,
		dest?: TravelPoint
	},
	car: {
		current?: CarData,
		all: Cars
	}
}

interface DispatchProps {
	setDestPoint: (marker: TravelPoint) => void,
	setStartPoint: (marker: TravelPoint) => void,
	getTravel: (start: LatLngLiteral, dest: LatLngLiteral, car: CarId) => void,
	setCurrentCar: (id: CarId) => void
}

const mapStateToProps = (state: StoreState) => {
	return {
		travel: {
			start: state.travel.startPoint,
			dest: state.travel.destPoint
		},
		car: {
			current: state.car.cars.get(state.car.current as CarId),
			all: state.car.cars
		},

	}
};
const mapDispatchToProps = (dispatch: Function) => {
	return {
		setStartPoint: (point: TravelPoint) => {
			dispatch(setStartPoint(point))
			dispatch(setStartMarker(point.pos));
		},
		setDestPoint: (point: TravelPoint) => {
			dispatch(setDestPoint(point))
			dispatch(setDestMarker(point.pos));
		},
		getTravel: (start: LatLngLiteral, dest: LatLngLiteral, car: CarId) => {
			dispatch(getTravelSteps(start, dest, car))
		},
		setCurrentCar: (id: CarId) => dispatch(setCar(id))

	}
};

export type Props = DispatchProps & StateProps & {
	data: ContextMenuData,
	closeModal: Function
}


class ContextMenu extends Component<Props> {

	doNothing = (e: React.MouseEvent) => e.preventDefault();

	render() {

		const {screenPos, geoPos} = this.props.data as ContextMenuData
		const isSelected = new Map<CarId, boolean>();
		this.props.car.all.forEach(value => {
			isSelected.set(value.id, this.isSelectedCar(value.id));
		})
		return (
			<Paper style={{top: screenPos.y, left: screenPos.x}}
			       id={"MenuContextMenu"}
			       onContextMenu={this.doNothing}
			>
				<Paper className={"category"} id={"ctx-direction"}>
					<Typography className={"label"}>
						Direction
					</Typography>
					<Button onContextMenu={this.doNothing} size={"small"}
					        onClick={() => this.setPoint(geoPos, MarkerType.startPoint)}>
						<div className={"item"}>
							<Place/>
							Partir d'ici
						</div>
					</Button>
					<Button onContextMenu={this.doNothing} size={"small"}
					        onClick={() => this.setPoint(geoPos, MarkerType.destPoint)}>
						<div className={"item"}>
							<Directions/>
							Aller ici
						</div>
					</Button>
				</Paper>

				<Paper className={"category"} id={"ctx-car"}
				       onContextMenu={this.doNothing}>
					<Typography className={"item label"}>
						Voiture
					</Typography>
					<Button size={"small"}
					        disabled={isSelected.get("teslaModel3")}
					        className={isSelected.get("teslaModel3") ? "selected" : ""}
					        onClick={() => this.setCurrentCar("teslaModel3")}>
						<div className={"item "}>
							<img
								src={"/assets/cars/logo.tesla.svg"}
								alt={"icon de la marque Tesla"}/>
							Model 3
						</div>
					</Button>
					<Button size={"small"}
					        disabled={isSelected.get("zoe")}
					        className={isSelected.get("zoe") ? "selected" : ""}
					        onClick={() => this.setCurrentCar("zoe")}>
						<div className={"item"}>
							<img
								alt={"icon de la marque Renault"}
								src={"/assets/cars/logo.renault.png"}/>
							Zoé
						</div>
					</Button>
				</Paper>

			</Paper>

		);
	}

	private isSelectedCar = (id: CarId) => this.props.car.current?.id === id

	private setCurrentCar = (id: CarId) => {

		if (!this.isSelectedCar(id)) {
			this.props.setCurrentCar(id);
			this.props.closeModal();
			if (this.props.travel.start && this.props.travel.dest) {
				this.props.getTravel(this.props.travel.start.pos, this.props.travel.dest.pos, id)
			}
		}

	}

	private setPoint = (geoPos: LatLngLiteral, markerType: MarkerType) => {

		if (this.props.car.current?.id) {
			const point: TravelPoint = {
				pos: {lng: geoPos.lng, lat: geoPos.lat}
			}

			switch (markerType) {
				case MarkerType.startPoint:
					this.props.setStartPoint(point)
					if (this.props.travel.dest) {
						this.props.getTravel(point.pos, this.props.travel.dest.pos, this.props.car.current.id)
					}
					break;
				case MarkerType.destPoint:
					this.props.setDestPoint(point)
					if (this.props.travel.start) {
						this.props.getTravel(this.props.travel.start.pos, point.pos, this.props.car.current.id)
					}
					break;
			}
		}

		setTimeout(this.props.closeModal, 300);

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
