import React from 'react';
import NavBar from "./AppBar";
import {connect} from "react-redux";
import {State as RouterState} from "../store/reducer/Navigation";
import {routes} from "../constants/Navigation";
import {Routes} from "./Routes";
import CustomMap from "./map/Map";
import './App.css'
import {getCar, setCar} from "../store/action/Car";
import {cars, init} from "../constants/car";
import Options from "./options/Options";

type StateProps = {
    location: string
}

type State = {}

type DispatchProps = {
    getCars: Function,
    setDefaultCar: Function
}
type Props = StateProps & DispatchProps;


class App extends React.Component<Props, State> {

    private components = {
        [routes.map]: <CustomMap/>,
        [routes.routes]: <Routes/>,
        [routes.options]: <Options/>
    };

    componentDidMount(): void {
        this.props.getCars();
        this.props.setDefaultCar();
    }

    render() {

        let content = this.components[this.props.location];
        return (
            <div className="App">
                <NavBar/>
                <div id={"content"}>
                    {content}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: { router: RouterState }) => {
    return {
        location: state.router.current.join("/")
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
