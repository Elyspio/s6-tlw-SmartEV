import React, {Component} from 'react';
import {Paper} from "@material-ui/core";
import './Options.css'
import {StoreState} from "../../store/reducer";
import {CarData} from "../../../../back/src/Car";
import Car from "./Car";
import {connect} from "react-redux";

const mapStateToProps = (store: StoreState) => {
    return {
        cars: store.car.cars
    }
}

type  StateProps = {
    cars: { [key: string]: CarData }
}

type Props = StateProps;

class Options extends Component<Props> {
    render() {

        const cars: CarData[] = [];
        Object.keys(this.props.cars).forEach(key => cars.push(this.props.cars[key]))

        console.log(cars);
        return (
            <Paper id={"options"}>
                {cars.map(car => <Car data={car}/>)}
            </Paper>
        );
    }
}

export default connect(mapStateToProps, null)(Options) as any;
