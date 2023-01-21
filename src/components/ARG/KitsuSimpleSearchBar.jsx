import React, { Component } from "react";
import Kitsu from "../lib/kitsu";
import "./KitsuSimpleSearchBar.css";

class KitsuSimpleSearchBar extends Component {
    state = {
        query: "",
        settleTimeout: null,
        topResults: [],
        hideResults: false,
    };

    callAPISearch = async (query) => {
        let topResults = (await Kitsu.simpleSearch(query)).data;

        this.setState({ topResults });
    };

    searchWhenSettled = (query) => {
        if (this.state.settleTimeout) {
            clearTimeout(this.state.settleTimeout);
        }

        this.setState({
            settleTimeout: setTimeout(() => {
                this.callAPISearch(query);
            }, this.props.settleTime),
        });
    };

    validateInput = (evt) => {
        const { value } = evt.target;
        this.setState({ query: value });

        if (value === "") return;

        this.searchWhenSettled(value);
    };

    render = () => {
        return (
            <div className="search-container">
                <input
                    type="text"
                    value={this.state.query}
                    onChange={this.validateInput}
                    onFocus={(evt) => {
                        this.validateInput(evt);
                        this.setState({ hideResults: false });
                    }}
                    onBlur={() =>
                        setTimeout(() => {
                            this.setState({ hideResults: true });
                        }, 100)
                    }
                    placeholder="Anime name..."
                ></input>
                <div hidden={this.state.hideResults} className="search-results">
                    {this.state.topResults.map((item, index) => {
                        const { attributes } = item;
                        return (
                            <div
                                onClick={() => {
                                    // Change input to completed name
                                    // and blank out search results
                                    this.setState({
                                        query: attributes.canonicalTitle,
                                    });

                                    this.props.onResult(item);
                                }}
                                className="poster-and-title"
                                key={`${index}-${item.id}-${item.type}`}
                            >
                                <img
                                    src={
                                        attributes.posterImage
                                            ? attributes.posterImage.tiny
                                            : "null"
                                    }
                                    alt={`Poster of ${attributes.canonicalTitle}`}
                                />
                                <h3>{attributes.canonicalTitle}</h3>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
}

export default KitsuSimpleSearchBar;
