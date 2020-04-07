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

type StateProps = {
	location: string,
	currentCar?: string
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

		const app = <>
			<div id={"content"}>
				<CustomMap/>
			</div>
			<Options/>
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
			this.props.getCars();
			this.props.setDefaultCar();
		}
		this.setState({serverIsOk})
	}
}

const mapStateToProps = (state: StoreState) => {
	return {
		currentCar: state.car.current
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
