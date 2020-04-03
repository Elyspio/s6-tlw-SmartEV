import React, {Component} from 'react';
import {Button, Paper} from "@material-ui/core";
import {ContextMenuData} from "./Map";
import './ContextMenu.css'
import {Directions, Place} from "@material-ui/icons";
import {connect} from "react-redux";
import {StoreState} from "../../store/reducer";
import {MarkerType} from "../../store/interface/Map";
import {LatLngLiteral} from "leaflet";
import {
    getTravelSteps,
    setDestPoint,
    setStartPoint
} from "../../store/action/Travel";
import {TravelPoint} from "../../store/reducer/Travel";
import {CarData} from "../../../../back/src/interfaces/Car";
import {
    addCustomMarker,
    setDestMarker,
    setStartMarker
} from "../../store/action/Map";


interface StateProps {
    travel: {
        start?: TravelPoint,
        dest?: TravelPoint
    },
    car: CarData
}

interface DispatchProps {
    setDestPoint: (marker: TravelPoint) => void,
    setStartPoint: (marker: TravelPoint) => void,
    getTravel: (start: TravelPoint, dest: TravelPoint, car: CarData) => void
}

const mapStateToProps = (state: StoreState) => {
    return {
        travel: {
            start: state.travel.startPoint,
            dest: state.travel.destPoint
        },
        car: state.car.cars[state.car.current as string]
    }
};
const mapDispatchToProps = (dispatch: Function) => {
    return {
        setStartPoint: (point: TravelPoint) => {
            dispatch(setStartPoint(point))
            dispatch(setStartMarker(point.pos));
        },
        setDestPoint: (point: TravelPoint) => {
            dispatch(setDestPoint(point))
            dispatch(setDestMarker(point.pos));
        },
        getTravel: (start: TravelPoint, dest: TravelPoint, car: CarData) => {
            dispatch(getTravelSteps(start, dest, car))
        }
    }
};

export type Props = DispatchProps & StateProps & {
    data: ContextMenuData,
    closeModal: Function
}


class ContextMenu extends Component<Props> {

    doNothing = (e: React.MouseEvent) => e.preventDefault();

    render() {

        const {screenPos, geoPos} = this.props.data as ContextMenuData

        return (
            <Paper style={{top: screenPos.y, left: screenPos.x}}
                   id={"MenuContextMenu"}
                   onContextMenu={this.doNothing}
            >
                <Button onContextMenu={this.doNothing} size={"small"}
                        onClick={() => this.setPoint(geoPos, MarkerType.startPoint)}>
                    <div className={"context-menu-label"}>
                        <Place/>
                        Partir d'ici
                    </div>
                </Button>
                <Button onContextMenu={this.doNothing} size={"small"}
                        onClick={() => this.setPoint(geoPos, MarkerType.destPoint)}>
                    <div className={"context-menu-label"}>
                        <Directions/>
                        Aller ici
                    </div>
                </Button>
            </Paper>

        );
    }

    private setPoint = (geoPos: LatLngLiteral, markerType: MarkerType) => {
        const point: TravelPoint = {
            pos: {lng: geoPos.lng, lat: geoPos.lat}
        }

        console.log("ctx", this.props);

        switch (markerType) {
            case MarkerType.startPoint:
                this.props.setStartPoint(point)
                if (this.props.travel.dest) {
                    this.props.getTravel(point, this.props.travel.dest, this.props.car)
                }
                break;
            case MarkerType.destPoint:
                this.props.setDestPoint(point)
                if (this.props.travel.start) {
                    this.props.getTravel(this.props.travel.start, point, this.props.car)
                }
                break;
        }

        setTimeout(this.props.closeModal, 300);

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
