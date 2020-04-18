import React, {Component} from 'react';
import {StoreState} from "../../store/reducer";
import {connect} from "react-redux";
import "./Travel.scss"
import {Paper} from "@material-ui/core";
import {Step} from "../../../../back/src/interfaces/Journey";
import {JourneyService} from "../../services/JourneyService";
import Typography from "@material-ui/core/Typography";
import {default as StepComponent} from './Step'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import DirectionsIcon from '@material-ui/icons/Directions';

interface StateProps {
	steps?: Step[],
	total?: {
		duration: number,
		distance: number
	}
}

interface DispatchProps {

}

const mapStateToProps = (state: StoreState) => {

	if (!state.travel.journey?.routes || !state.travel.journey?.routes[0]) {
		return {};
	}

	let travel = state.travel.journey?.routes[0];

	const steps: Step[] = [];
	travel?.legs.forEach(leg => steps.push(...leg.steps));


	return {
		steps: steps,
		total: {
			duration: travel?.duration,
			distance: travel?.distance
		}
	}
};
const mapDispatchToProps = (dispatch: Function) => {
	return {}
};

interface Props extends StateProps, DispatchProps {

}

interface State {
	open: boolean
}

class Travel extends Component<Props, State> {

	state = {
		open: false
	}


	static getDerivedStateFromProps(props: Props, state: State): State | null {
		if (props.steps && !state.open) {
			return {
				open: true
			}
		}
		return null;
	}

	render() {

		let journeyData = null;
		let journeySteps = null;

		let comp;

		if (!this.state.open) {
			comp = <IconButton
				onClick={() => this.setState({open: !!this.props.steps})}>
				<DirectionsIcon fontSize={"large"}/>
			</IconButton>
		} else {
			if (this.props.total && this.props.steps) {
				const time = JourneyService.splitTime(this.props.total.duration)
				console.log("time", time);
				let timeStr = "";
				if (time.hours > 0) {
					timeStr += time.hours + "h"
				}
				if (time.minutes > 0) {
					timeStr += timeStr.length > 0 ? " " : "" + time.minutes.toFixed(0) + "mn"
				}
				if (time.seconds > 0) {
					timeStr += timeStr.length > 0 ? " " : "" + time.seconds.toFixed(0) + "s"
				}

				const distance = (this.props.total.distance / 1000).toFixed(2);

				journeyData = <List className={"data"}>
					<ListItem>
						<Typography>Durée: {timeStr}</Typography>
					</ListItem>
					<ListItem>
						<Typography>Distance: {distance} km </Typography>
					</ListItem>
				</List>

				journeySteps = <List id="steps">
					{this.props.steps.map(step =>
						<StepComponent data={step}/>
					)}
				</List>


			}

			comp = <>
				<div className="infos">
					<Typography style={{textAlign: "center"}}
					            variant={"h6"}>Votre trajet</Typography>

					{/*<Waitpoints/>*/}
					{journeyData}
				</div>
				{journeySteps}
			</>

		}


		const className: string = (this.state.open ? "Travel" : "Travel-btn");
		console.log("I", className);
		return this.state.open
			? <Paper className={className}>{comp}</Paper>
			: <div className={className}>{comp}</div>


	}


}

export default connect(mapStateToProps, mapDispatchToProps)(Travel);
