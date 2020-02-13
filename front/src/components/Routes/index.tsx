import React, {Component} from "react";
import {Button} from "@material-ui/core";

export class Routes extends Component<any, any> {
    render(): React.ReactNode {
        return <div>
            <form action="">
                <p>From<input type="text"/></p>
                <p>to<input type="text"/></p>
                <p>Car</p>
                <Button variant={"outlined"}>GO</Button>
            </form>
        </div>
    }
}
