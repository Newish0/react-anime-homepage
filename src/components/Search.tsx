import { useQuery } from "@tanstack/react-query";
import Kitsu from "kitsu";
import { ReactNode, useRef, useState } from "react";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import "./Search.scss";

interface SearchProp {
    defaultQuery: string;
}

export default function Search({ defaultQuery }: SearchProp) {
    const api = new Kitsu();
    const [query, setQuery] = useState(defaultQuery);
    const [isFocus, setIsFocus] = useState(false);
    const [mouseIsOverResult, setMouseIsOverResult] = useState(false);
    const searchBox = useRef<HTMLInputElement>(null);

    const { status, data, error } = useQuery({
        queryKey: ["anime", "filter[text]", `${query}`],
        queryFn: () =>
            api.fetch(`anime/`, {
                params: {
                    filter: { text: query },
                    page: {
                        limit: 5,
                    },
                },
            }),
    });
    
    return (
        <div className="Search">
            <input
                className="SearchBox"
                placeholder="Search..."
                ref={searchBox}
                value={query}
                onChange={(evt) => setQuery(evt.target.value)}
                type="text"
                onFocus={() => setIsFocus(true)}
                onBlur={() => {
                    if (!mouseIsOverResult) setIsFocus(false);
                }}
            />
            <div
                className="Results"
                hidden={!isFocus || query === ""}
                onMouseEnter={() => setMouseIsOverResult(true)}
                onMouseLeave={() => {
                    setMouseIsOverResult(false);
                }}
                onFocus={() => {
                    searchBox?.current?.focus();
                }}
            >
                <div hidden={status !== "loading"}>
                    <ReactLoading
                        type={"bubbles"}
                        color={"#e39"}
                        height={200}
                        width={100}
                        className="center"
                    />
                </div>

                {data?.data.map((show: any, i: number) => {
                    return (
                        <SearchResultPair
                            title={show.canonicalTitle}
                            poster={show.posterImage?.small}
                            id={show.id}
                            key={`SearchResult-${i}`}
                        ></SearchResultPair>
                    );
                })}

                <div hidden={data?.data.length !== 0}>No result</div>
            </div>
        </div>
    );
}

interface SearchResultPairProp {
    title: string | ReactNode;
    poster: string;
    id?: number | string;
    type?: string;
}

function SearchResultPair({ title, poster, type, id }: SearchResultPairProp) {
    const reusltPair = (
        <div className="SearchResultPair">
            <img src={poster} alt={`Poster of ${title}`} className="Poster" />
            <h3 className="Title">{title}</h3>
        </div>
    );

    if (id)
        return (
            <Link to={`/${type ?? "anime"}/${id}`} className="Link clean-link">
                {reusltPair}
            </Link>
        );
    else return reusltPair;
}
