import React, {Component, CSSProperties} from 'react';

type Props = {
    open: boolean,
    style?: CSSProperties,
    ajustements?: CSSProperties
    onClick: (event: React.MouseEvent) => void
}

class Modal extends Component<Props> {
    render() {
        if (!this.props.open) return null

        const {style, children, ajustements, onClick} = this.props;

        return (
            <div className={"Modal"} onClick={onClick} style={{
                display: "flex",
                margin: 0,
                padding: 0,
                height: "100vh",
                width: "100vw",
                ...style
            }}>
                <div style={ajustements}>
                    {children}
                </div>
            </div>
        );
    }
}

export default Modal;
