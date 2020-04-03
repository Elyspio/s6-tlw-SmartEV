import React from 'react';
import {connect} from "react-redux";
import './App.css'
import {getCar, setCar} from "../store/action/Car";
import {cars, init} from "../constants/Car";
import Options from "./options/Options";
import CustomMap from "./map/Map";
import {StoreState} from "../store/reducer";
import {Backend} from "../services/backend";
import * as Error from "./errors"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {Paper} from "@material-ui/core";

type StateProps = {
    location: string
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

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (this.state.serverIsOk) {
            this.props.getCars();
            this.props.setDefaultCar();
        }
    }

    render() {

        const app = <>
            <div id={"content"}>
                <CustomMap/>
            </div>
            <Options/>
        </>


        let error = <div id={"content"}>
            {this.state.serverIsOk ? <CustomMap/> : <Error.ServerNotFound fn={this.checkServer} timer={1000}/>}
        </div>;
        return (


            <Paper className="App">
                {/*<ThemeProvider theme={theme}>*/}
                {this.state.serverIsOk ? app : error}
                {/*</ThemeProvider>*/}
            </Paper>
        );
    }

    private checkServer = async () => {
        this.setState({serverIsOk: await Backend.ping()})
    }
}

const mapStateToProps = (state: StoreState) => {
    return {}
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

const theme = createMuiTheme({
    palette: {
        type: "dark",
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(App) as any;
