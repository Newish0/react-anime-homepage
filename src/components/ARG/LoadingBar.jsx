import React, { Component } from "react";
import { Theme } from './Colors';

class LoadingBar extends Component {
    state = {};
    render() {
        const { children, percentProgress} = this.props;
        return (
            <React.Fragment>
                <div>{children}</div>
                <div
                    style={{
                        width: "calc(100% - 64px)",
                        border: "2px solid #333",
                        boxSizing: "border-box",
                        position: "relative",
                        borderRadius: "12px",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            marginBlock: "10px",
                            zIndex: 2,
                        }}
                    >
                        {percentProgress ? percentProgress.toFixed(1) : 0}%
                    </div>
                    <div
                        style={{
                            background: Theme.primary,
                            height: "100%",
                            width: `calc(100% * ${percentProgress / 100})`,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            borderRadius: "12px",
                            zIndex: -1,
                        }}
                    ></div>
                </div>
            </React.Fragment>
        );
    }
}

export default LoadingBar;
