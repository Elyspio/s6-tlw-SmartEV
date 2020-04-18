import React, {Component} from 'react';
import {Button, Chip, List, Paper, TextField} from "@material-ui/core";
import {StoreState} from "../../store/reducer";
import {Waypoint} from "../../../../back/src/interfaces/Journey";
import {connect} from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import "./Waitpoints.scss"

interface StateProps {
	waitpoints?: Waypoint[],
}

interface DispatchProps {

}

const mapStateToProps = (state: StoreState): StateProps => {

	let waitpoints = state.travel.journey?.waypoints || [];

	// pas d'itinéraire, on regarde si des points ont été set
	if (waitpoints.length < 2) {
		if (waitpoints.length < 1) {
			if (state.travel.startPoint) {
				let {lat, lng} = state.travel.startPoint.pos;
				waitpoints.push({
					location: [lng, lat],
					name: ""
				})
			}
		}

		if (state.travel.destPoint) {
			let {lat, lng} = state.travel.destPoint.pos;
			waitpoints.push({
				location: [lng, lat],
				name: ""
			})
		}
	}


	return {
		waitpoints: waitpoints
	}
};
const mapDispatchToProps = (dispatch: Function) => {
	return {
		setStartPoint: ()  => {}
	}
};

interface Props extends StateProps, DispatchProps {
}


interface State {
	inputs: {
		start: string,
		dest: string
	}
}

class Waitpoints extends Component<Props, State> {

	state = {
		inputs: {
			start: "",
			dest: ""
		}
	}


	static getDerivedStateFromProps(props: Props, state: State) {
		console.log("Waitpoints: getDerivedStateFromProps ", props, state);
		return {}
	}


	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
		console.log("Waitpoints: componentDidUpdate ", prevProps, prevState);
		// let waypoints = prevProps.waitpoints || [];
		// if (waypoints.length > 0 && waypoints[0].name !== prevState?.inputs.start) {
		// 	this.setState(prev => ({
		// 		inputs: {
		// 			...prev.inputs,
		// 			start: waypoints[0].name
		// 		}
		// 	}))
		// }
		//
		// if (waypoints.length > 1 && waypoints[waypoints?.length - 1]?.name !== prevState.inputs.dest) {
		// 	this.setState(prev => ({
		// 		inputs: {
		// 			...prev.inputs,
		// 			start: waypoints[waypoints.length - 1]?.name
		// 		}
		// 	}))
		// }
	}

	render() {

		const start = <ListItem>
			<Chip className={"Chip"}
			      style={{backgroundColor: "#1bca25"}}
			      label="Départ"/>
			<TextField variant={"outlined"} size={"small"}
			           className={"waitpointInput"}
			           onChange={this.onStartInputChange}
			           onKeyPress={this.onInputKeyPress}
			           value={this.state.inputs.start}/>
		</ListItem>


		const dest = <ListItem>
			<Chip className={"Chip"}
			      style={{backgroundColor: "#242424", color: "#ffffff"}}
			      label="Arrivé"/>
			<TextField variant={"outlined"} size={"small"}
			           className={"waitpointInput"}
			           onChange={this.onDestInputChange}
			           onKeyPress={this.onInputKeyPress}
			           value={this.state.inputs.dest}/>
		</ListItem>


		return (
			<Paper>
				<List>
					{start}
					{dest}
					<ListItem>
						<Button onClick={this.doSearch} size={"small"}>Rechercher
							un itinéraire</Button>
					</ListItem>
				</List>
			</Paper>


		);
	}

	private onInputKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if(event.key === "Enter") this.doSearch();
	};
	private doSearch = () => {

	}

	private onStartInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		e.persist()
		console.log(e.target.value);
		this.setState(prev => ({
			inputs: {
				...prev.inputs,
				start: e.target.value
			}
		}))
	}


	private onDestInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		e.persist()
		console.log(e.target.value);

		this.setState(prev => ({
			inputs: {
				...prev.inputs,
				dest: e.target.value
			}
		}))
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(Waitpoints) as any;
