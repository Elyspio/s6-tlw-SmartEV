import React, {Component} from 'react';
import './Options.scss'
import {StoreState} from "../../store/reducer";
import {CarData} from "../../../../back/src/interfaces/Car";
import Car from "./Car";
import {connect} from "react-redux";
import {DriveEta} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Modal from "./Modal";
import {Paper, Typography} from "@material-ui/core";

const mapStateToProps = (store: StoreState) => {
    return {
        cars: store.car.cars,
        selected: store.car.cars[store.car.current as string]
    }
}

type  StateProps = {
    cars: { [key: string]: CarData }
    selected: CarData
}

type Props = StateProps & {
    classes: {
        root: any,
    }
};

type State = {
    open: boolean
}


class Options extends Component<Props, State> {

    state = {
        open: false
    }

    render() {
        const cars: CarData[] = [];
        Object.keys(this.props.cars).forEach(key => cars.push(this.props.cars[key]))

        return (
            <div id={"options"}>
                <IconButton onClick={this.handleClick}>
                    <DriveEta fontSize={"large"}/>
                </IconButton>
                <Modal open={this.state.open} onClick={this.handleClick}
                       style={{
                           justifyContent: "center",
                           alignItems: "center",
                           flexDirection: "row"
                       }}
                       ajustements={{
                           transform: "translate(0, -200px)",
                           display: "flex",
                           alignItems: "center",
                           flexDirection: "column"
                       }}
                >
                    <Paper
                        className={"container"}
                        elevation={5}
                        style={{}}>
                        <Typography className={"header"} variant={"h3"}>Quelle
                            est votre voiture ?</Typography>
                        <div id={"cars"}>
                            {cars.map(car => <Car key={car.id} data={car}
                                                  selected={this.props.selected.id === car.id}/>)}
                        </div>
                    </Paper>
                </Modal>

            </div>
        );
    }

    private handleClick = () => {
        console.log("handle click");
        this.setState(prev => {
            return {
                open: !prev.open
            }
        })
    }
}

export default connect(mapStateToProps, null)(Options) as any;

