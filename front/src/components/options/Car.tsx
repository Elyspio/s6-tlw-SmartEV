import React, {Component} from 'react';
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {CarData} from '../../../../back/src/Car'

type StateProps = {}
type DispatchProps = {}

type Props = {
    data: CarData
}


class Car extends Component<Props> {
    private static Cars = {
        zoe: "zoe",
        tesla: "teslaModel3"
    };

    render() {
        return (
            <Paper className={"Car"}>
                <Typography variant={"subtitle1"}>{this.props.data.model}</Typography>
                <p><span className="label">Autonomie :</span> <span>{this.props.data.range}</span></p>
                <p><span className="label">Puissance maximale de charge :</span> <span>{this.props.data.maxPower}</span></p>
            </Paper>
        );
    }
}

export default Car;
