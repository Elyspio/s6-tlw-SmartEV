import React from 'react';
import {connect} from "react-redux";
import './App.scss'
import {getCar, setCar} from "../store/action/Car";
import {cars, init} from "../constants/Car";
import Options from "./options/Options";
import CustomMap from "./map/Map";
import {StoreState} from "../store/reducer";
import {Backend} from "../services/backend";
import * as Error from "./errors"
import {Paper} from "@material-ui/core";
import Travel from "./Travel/Travel";

type StateProps = {
	currentCar?: string,
	nbCars: number
}

type State = {
	serverIsOk: boolean
}

type DispatchProps = {
	getCars: Function,
	setDefaultCar: Function
}
type Props = StateProps & DispatchProps;


class App extends React.Component<Props, State> {


	public state = {
		serverIsOk: false
	}

	async componentDidMount() {
		await this.checkServer();
	}

	render() {

		const areCarLoaded: boolean = this.props.nbCars === cars.length

		const app = <>
			<div id={"content"}>
				<CustomMap/>
			</div>
			{areCarLoaded ? <Options/> : null}
			<Travel/>
		</>


		let error = <div id={"content"}>
			{this.state.serverIsOk ? <CustomMap/> :
				<Error.ServerNotFound fn={this.checkServer} timer={1000}/>}
		</div>;
		return (
			<Paper className="App">
				{this.state.serverIsOk ? app : error}
			</Paper>
		);
	}

	private checkServer = async () => {
		const serverIsOk = await Backend.ping();
		if (serverIsOk) {
			await this.props.getCars();
			await this.props.setDefaultCar();
		}
		this.setState({serverIsOk})
	}
}

const mapStateToProps = (state: StoreState): StateProps => {
	return {
		currentCar: state.car.current,
		nbCars: state.car.cars.size
	}
};
const mapDispatchToProps = (dispatch: Function) => {
	return {
		getCars: () => {
			cars.forEach(id => dispatch(getCar(id)))
		},
		setDefaultCar: () => {
			dispatch(setCar(init))
		}
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(App) as any;
