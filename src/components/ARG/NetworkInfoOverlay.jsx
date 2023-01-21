import React, { Component } from "react";

class NetworkInfoOverlay extends Component {
    state = {};
    render() {
        const { children, hidden } = this.props;
        return (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    width: "-webkit-fill-available",
                    display: hidden ? "none" : "flex",
                    height: "-webkit-fill-available",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    gap: "12px",
                    backdropFilter: "blur(16px)",
                }}
            >
                {children}
            </div>
        );
    }
}

export default NetworkInfoOverlay;
