import React, { PureComponent } from "react";
import Kitsu from "../lib/kitsu";

class DetailPanel extends PureComponent {
    state = {};

    getDateRange(startDate, endDate, tba, status) {
        if (tba) {
            return (
                <React.Fragment>
                    <time>{status}</time> <p>({status})</p>
                </React.Fragment>
            );
        } else if (startDate && !endDate) {
            return (
                <React.Fragment>
                    <time>{startDate}</time> to ? <p>({status})</p>
                </React.Fragment>
            );
        } else if (startDate === endDate) {
            return (
                <React.Fragment>
                    <time>{startDate}</time>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <time>{startDate}</time> to <time>{endDate}</time>
                </React.Fragment>
            );
        }
    }

    capitalizeFirstLetter(str) {
        return str[0].toUpperCase() + str.substring(1);
    }

    render() {
        const { mediaData } = this.props;

        if (!mediaData) return <div></div>;

        const { type } = mediaData;

        console.log(mediaData);

        const {
            canonicalTitle,
            posterImage,
            startDate,
            endDate,
            status,
            tba,
            synopsis,
            slug,
            subtype,
        } = mediaData.attributes;

        let backdropImage = posterImage.small;

        return (
            <React.Fragment>
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${backdropImage})`,
                        filter: "blur(20px)",
                        opacity: 0.3,
                        zIndex: 0,
                        backgroundOrigin: "border-box",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                    }}
                ></div>

                <div className="center scroll" style={{ position: "relative" }}>
                    <img
                        src={posterImage.medium}
                        alt={`Poster of ${canonicalTitle}`}
                        style={{ width: "100%" }}
                    />
                    <div style={{ padding: "10px" }}>
                        <a
                            href={`https://kitsu.io/${type}/${slug}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <h1>{canonicalTitle}</h1>
                        </a>
                        <div>{this.capitalizeFirstLetter(subtype)}</div>
                        <br />
                        <div>
                            {this.getDateRange(startDate, endDate, tba, status)}
                        </div>
                        <div>
                            <p>{synopsis}</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DetailPanel;
