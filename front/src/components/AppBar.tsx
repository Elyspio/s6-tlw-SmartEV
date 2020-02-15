import React from 'react';
import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import {routes} from "../constants/Navigation";
import {setCurrentLocation} from "../store/action/Navigation";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {StoreState} from "../store/reducer";


const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeLocation: (location: string) => {
            dispatch(setCurrentLocation(location));
        }
    }
}

const mapStateToProps = (state: StoreState) => {
    return {
        location: state.router.current.join("/")
    }
};
const styles = ((theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

type DispatchProps = {
    changeLocation: (location: string) => void
}

type StateProps = {
    location: string
}

type OwnProps = {
    classes: any
}
type Props = DispatchProps & OwnProps & StateProps

type State = {
    current: string;
}

class NavBar extends React.Component<Props, State> {

    handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        this.props.changeLocation(newValue);
    };

    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.props?.location}
                        onChange={this.handleChange}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Carte"
                             value={routes.map}
                             icon={<PhoneIcon/>}/>
                        <Tab label="Itinéraires"
                             value={routes.routes}
                             icon={<FavoriteIcon/>}/>
                        <Tab label="Options"
                             value={routes.options}
                             icon={<PersonPinIcon/>}/>

                    </Tabs>
                </AppBar>
            </div>
        );
    }
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NavBar))
