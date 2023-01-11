import React from "react";
import "./BannerShowCard.scss";

interface BannerShowCardProps {
    title: string;
    poster: string;
    description: string;
    tags?: Array<string>;
}

export default function BannerShowCard(props: BannerShowCardProps) {
    return (
        <div className="BannerShowCard">
            <div className="Info">
                <h2 className="Title">{props.title}</h2>
                <div className="Tags">
                    {props.tags
                        ? props.tags.map((t: string, i: number) => (
                              <span className="Tag" key={i}>
                                  {t}
                              </span>
                          ))
                        : ""}
                </div>
                <p className="Description">{props.description}</p>
            </div>

            <img
                className="Poster"
                src={props.poster}
                alt={`Poster of ${props.title}`}
            />
        </div>
    );
}
