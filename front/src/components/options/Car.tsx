import React, {PureComponent} from 'react';
import {Paper} from "@material-ui/core";
import {CarData, CarId} from '../../../../back/src/interfaces/Car'
import './Car.scss'
import {setCar} from "../../store/action/Car";
import {connect} from "react-redux";
import {BatteryChargingFull, Done, LocalGasStation} from "@material-ui/icons";
import {getTravelSteps} from "../../store/action/Travel";
import {LatLngLiteral} from "leaflet";
import {StoreState} from "../../store/reducer";
import {TravelPoint} from "../../store/reducer/Travel";

type StateProps = {
	travel: {
		start?: TravelPoint,
		dest?: TravelPoint
	},
}

type DispatchProps = {
	setCurrentCar: Function
	refreshTravel: Function
}

const mapStateToProps = (state: StoreState) => {
	return {
		travel: {
			start: state.travel.startPoint,
			dest: state.travel.destPoint
		},
	}
}

const mapDispatchToProps = (dispatch: Function) => {
	return {
		setCurrentCar: (id: CarId) => {
			return dispatch(setCar(id));
		},
		refreshTravel: (start: LatLngLiteral, dest: LatLngLiteral, car: CarId) => {
			dispatch(getTravelSteps(start, dest, car))
		},
	}
}

type Props = DispatchProps & StateProps & {
	data: CarData,
	selected?: boolean
}


class Car extends PureComponent<Props> {
	private static Cars = {
		zoe: "zoe",
		teslaModel3: "teslaModel3"
	};

	private static imagePaths = {
		zoe: "/assets/cars/zoe.jpg",
		teslaModel3: "/assets/cars/tesla.jpg"
	}

	render() {

		const {id, maxPower, range, model} = this.props.data;

		// @ts-ignore
		const image = Car.imagePaths[id]
		return (
			<Paper className={"Car"}
			       onClick={this.setCurrentCar}>
				<p className={"selected-icon"}>{this.props.selected ?
					<Done/> : ""}</p>

				<div className="grid">
					<p className="header">{model}</p>
					<img src={image} alt={model}/>
					<div className={"attributes"}>
						<p><LocalGasStation/>
							<span className="label">Autonomie : </span>
							<span>{range} km</span></p>
						<p>
							<BatteryChargingFull/>
							<span
								className="label">Puissance maximale de charge : </span>
							<span>{maxPower} kWh</span></p>
					</div>
				</div>


			</Paper>
		);
	}

	private setCurrentCar = () => {
		this.props.setCurrentCar(this.props.data.id);
		if(this.props.travel.start && this.props.travel.dest) {
			this.props.refreshTravel(this.props.travel.start.pos, this.props.travel.dest.pos, this.props.data.id);
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Car) as any;
