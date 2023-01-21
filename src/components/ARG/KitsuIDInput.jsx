import React, { Component } from "react";
// import "General.css";

class KitsuIDInput extends Component {
    // constructor(props) {
    //     super(props);
    // }

    state = {
        settleTimeout: null,
    };

    updateWhenSettled = (id) => {
        if (this.state.settleTimeout) {
            clearTimeout(this.state.settleTimeout);
        }

        this.setState({
            settleTimeout: setTimeout(() => {
                this.props.inputHandler(id);
            }, this.props.settleTime),
        });
    };

    validateInput = (target) => {
        const { value } = target;

        if (value < 0 || !("" + value).match(/\d+/)) {
            target.classList.add("error");
            return;
        }

        target.classList.remove("error");
        this.updateWhenSettled(value);
    };

    render() {
        return (
            <input
                type="number"
                min="0"
                onChange={(evt) => {
                    this.validateInput(evt.target);
                }}
                placeholder="Kitsu Anime ID"
            ></input>
        );
    }
}

export default KitsuIDInput;
