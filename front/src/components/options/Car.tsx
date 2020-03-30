import React, {PureComponent} from 'react';
import {Paper} from "@material-ui/core";
import {CarData} from '../../../../back/src/interfaces/Car'
import './Car.css'
import {Dispatch} from "redux";
import {setCar} from "../../store/action/Car";
import {connect} from "react-redux";
import {BatteryChargingFull, Done, LocalGasStation} from "@material-ui/icons";

type StateProps = {}

type DispatchProps = {
    setCurrentCar: Function
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setCurrentCar: (id: string) => dispatch(setCar(id))
    }
}

type Props = DispatchProps & {
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
                   onClick={() => this.props.setCurrentCar(id as string)}>
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
}

export default connect(null, mapDispatchToProps)(Car) as any;
