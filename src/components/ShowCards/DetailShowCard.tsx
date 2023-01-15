import { Link } from "react-router-dom";
import "./ShowCard.scss";
import React from "react";

interface DetailShowCardProps {
    title: string;
    jpTitle: string;
    poster: string;
    subtype: string;
    tags: Array<string>;
    description: string;
    date: { start: string; end: string; tba: number };
    status: string;
    type?: string;
    id?: number;
}

function getDateRange(
    startDate: string,
    endDate: string,
    tba: string | number,
    status: string
) {
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

export default function DetailShowCard({
    title,
    jpTitle,
    poster,
    subtype,
    tags,
    description,
    type,
    id,
    date,
    status,
}: DetailShowCardProps) {
    const card = (
        <div className="DetailShowCard">
            <img className="Poster" src={poster} alt={`Poster of ${title}`} />
            <div className="Details">
                <h1 className="Title">{title}</h1>
                <h4 className="Subtitle">{jpTitle}</h4>
                <div className="Tags">
                    {tags
                        ? tags.map((t: string, i: number) => (
                              <span className="Tag" key={i}>
                                  {t}
                              </span>
                          ))
                        : ""}
                </div>
                <div className="Date">
                    {getDateRange(date.start, date.end, date.tba, status)}
                </div>
                <span className="Subtype">{subtype}</span>

                <p className="Description">{description}</p>
            </div>
        </div>
    );

    if (type && id)
        return (
            <Link to={`/${type}/${id}`} className="Link">
                {card}
            </Link>
        );
    else return card;
}
