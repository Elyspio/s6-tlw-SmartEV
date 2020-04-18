import React, {Component} from 'react';
import {StoreState} from "../../store/reducer";
import {connect} from "react-redux";
import {Step as IStep} from "../../../../back/src/interfaces/Journey"
import {ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {JourneyService} from "../../services/JourneyService";

interface StateProps {

}

interface DispatchProps {

}

const mapStateToProps = (state: StoreState) => {
	return {}
};
const mapDispatchToProps = (dispatch: Function) => {
	return {}
};


type Props = StateProps & DispatchProps & {
	data: IStep
}

class Step extends Component<Props> {

	state = {
		isOverflowding: false
	}

	isOverflowing = () => {

	}

	render() {
		const data = this.props.data;
		const distance = JourneyService.splitDistance(data.distance);
		let distanceStr = "";
		if (distance.km > 0) {
			distanceStr += distance.km.toFixed(0) + "km";
		}
		if (distance.m > 0) {
			distanceStr += distanceStr.length > 0 ? " " : "" + distance.m.toFixed(0) + "m";
		}

		let svgPath = `${data.maneuver.type}`
		if (data.maneuver.modifier) {
			svgPath += `_${data.maneuver.modifier}`;
		}

		console.log("path",`/assets/travel/icons/${svgPath.replace(/ /g, "_")}.svg` )

		return (
			<ListItem divider>
				<ListItemAvatar>
					<Avatar src={`/assets/travel/icons/${svgPath.replace(/ /g, "_")}.svg`}
					        alt={svgPath}/>
				</ListItemAvatar>
				<ListItemText primary={data.maneuver.instruction}
				              secondary={distanceStr}/>
			</ListItem>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Step);
