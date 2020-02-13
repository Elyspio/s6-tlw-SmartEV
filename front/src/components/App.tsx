import React from 'react';
import NavBar from "./AppBar";
import {connect} from "react-redux";
import {State as RouterState} from "../store/reducer/Navigation";
import {routes} from "../constants/Navigation";
import {Routes} from "./Routes";


type StateProps = {
    location: string
}

type State = {}

type Props = StateProps;

class App extends React.Component<Props, State> {
    render() {

        let content = null;
        switch (this.props.location) {
            case routes.routes:
                content = <Routes/>
        }


        return (
            <div className="App">
                <NavBar/>
                <div>
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

export default connect(mapStateToProps, null)(App) as any;
