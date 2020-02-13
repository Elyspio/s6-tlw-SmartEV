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


const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changeLocation: (location: string) => {
            dispatch(setCurrentLocation(location));
        }
    }
}

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


type OwnProps = {
    classes: any
}
type Props = DispatchProps & OwnProps

type State = {
    current: string;
}

class NavBar extends React.Component<Props, State> {

    public state = {
        current: routes.map
    };

    constructor(props: Props) {
        super(props);
    }

    handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        this.setState({
            current: newValue
        }, () => this.props.changeLocation(newValue));

    };

    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state?.current}
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(NavBar))
