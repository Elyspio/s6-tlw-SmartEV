import React, {Component} from 'react';
import {Button, Paper} from "@material-ui/core";
import {ContextMenuData} from "./Map";
import './ContextMenu.css'
import {Directions, Place} from "@material-ui/icons";

export type Props = {
    data: ContextMenuData
}

class ContextMenu extends Component<Props> {

    doNothing = (e: React.MouseEvent) => e.preventDefault();

    render() {

        const {screenPos} = this.props.data

        return (
            <Paper style={{top: screenPos.y, left: screenPos.x}}
                   id={"MenuContextMenu"}
                   onContextMenu={this.doNothing}
            >
                <Button onContextMenu={this.doNothing} size={"small"}>
                    <div className={"context-menu-label"}>
                        <Directions/>
                        Aller ici
                    </div>
                </Button>
                <Button onContextMenu={this.doNothing} size={"small"}>
                    <div className={"context-menu-label"}>
                        <Place/>
                        Partir d'ici
                    </div>
                </Button>

            </Paper>

        );
    }
}

export default ContextMenu;
