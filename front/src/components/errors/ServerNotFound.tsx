import React, {Component} from 'react';
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {baseUrl} from "../../constants/Server";
import "./ServerNotFound.css"

interface Props {
    timer: number,
    fn: Function
}

class ServerNotFound extends Component<Props> {
    private interval!: number

    componentDidMount(): void {
        this.interval = setInterval(this.props.fn, this.props.timer)
    }

    componentWillUnmount(): void {
        clearInterval(this.interval)
    }


    render() {
        return (
            <Paper className={"ServerNotFound"} variant={"outlined"} >
                <Typography variant={"h3"} style={{color: "#F00"}}>Impossible de joindre le serveur</Typography>
                <Typography variant={"subtitle1"}  >Adresse : <a href={baseUrl} style={{color:"cyan"}}>{baseUrl}</a></Typography>
                <Typography variant={"subtitle2"}>Refresh : {this.props.timer / 1000}s</Typography>
            </Paper>
        );
    }
}

export default ServerNotFound;