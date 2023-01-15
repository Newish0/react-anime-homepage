import { useQuery } from "@tanstack/react-query";
import Kitsu from "kitsu";
import React from "react";
import { useParams } from "react-router-dom";
import Banner from "./Banner";
import DetailShowCard from "./ShowCards/DetailShowCard";

interface AnimeProps {}

function getFormatedDate(
    startDate: string,
    endDate: string,
    tba: string,
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

export default function Anime(props: AnimeProps) {
    const { id } = useParams();
    const api = new Kitsu();

    const {
        status: qStatus,
        data,
        error,
    } = useQuery({
        queryKey: ["anime", `${id}`],
        queryFn: () =>
            api.fetch(`anime/${id}`, {
                params: {
                    include: "genres,characters",
                },
            }),
    });

    if (qStatus === "loading") return <h1>Loading...</h1>;
    if (qStatus === "error") return <h1>{JSON.stringify(error)}</h1>;

    const {
        genres: { data: genres },
        coverImage,
        posterImage,
        canonicalTitle,
        titles,
        synopsis,
        subtype,
        ageRating,
        startDate,
        endDate,
        tba,
        status,
        episodeCount,
        type,
        titles: { en_jp: jpTitle },
    } = data.data;

    return (
        <div className="Anime page">
            <Banner
                src={coverImage?.original ?? posterImage?.original}
                height="min(600px, 33vh)"
                className="bgimg"
            ></Banner>

            <div className="center-box" style={{top: "200px"}}>
                <DetailShowCard
                    title={canonicalTitle}
                    jpTitle={jpTitle}
                    poster={posterImage?.original ?? posterImage?.large}
                    date={{ start: startDate, end: endDate, tba }}
                    status={status}
                    subtype={subtype}
                    tags={genres}
                    description={synopsis}
                />
            </div>

            <div className="mid-container">
                <pre
                    style={{
                        position: "relative",
                        display: "block",
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                    }}
                >
                    {JSON.stringify(data, null, 4)}
                </pre>
            </div>
        </div>
    );
}
