import React, { SyntheticEvent } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import Kitsu from "kitsu";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Pagination } from "swiper";
import "swiper/css/pagination";

import BannerShowCard from "./ShowCards/BannerShowCard";
import ShowCardPool from "./ShowCards/ShowCardPool";
import ShowCard from "./ShowCards/ShowCard";

import Season from "../season";
import axios from "axios";
import { getParameterByName } from "../misc";
import ReactLoading from "react-loading";

export default function Home() {
    const api = new Kitsu();

    const season = Season.current();
    const seasonYear = Season.currentYear();

    // Wrap queryFn to allow passing params
    const {
        status: bStatus,
        data: bData,
        error: bError,
    } = useQuery({
        queryKey: ["bannerShows"],
        queryFn: () =>
            api.get("anime", {
                params: {
                    include: "genres",
                    sort: "-averageRating",
                    filter: { season, seasonYear },
                },
            }),
    });

    const {
        status: pStatus,
        data: pData,
        error: pError,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ["poolShows", "infinite"],
        getNextPageParam: (prevData: any) => {
            let nextUrl = decodeURIComponent(prevData.links.next);

            if (nextUrl === "undefined") return undefined;

            return {
                limit: getParameterByName("page[limit]", nextUrl),
                offset: getParameterByName("page[offset]", nextUrl),
            };
        },
        queryFn: ({
            pageParam = {
                limit: 20,
                offset: 0,
            },
        }) => {
            return api.get("anime", {
                params: {
                    include: "genres",
                    sort: "-averageRating",
                    filter: { season, seasonYear },
                    page: pageParam,
                },
            });
        },
    });

    const infiniteScroll = {
        onLoadMore: () => {
            fetchNextPage();
        },
        useClick: false,
        hasNext: hasNextPage ?? false,
        isFetching: isFetchingNextPage,
    };

    // if (bStatus === "loading") return <h1>Loading...</h1>;
    if (bStatus === "error") return <h1>{JSON.stringify(bError)}</h1>;

    // if (pStatus === "loading") return <h1>Loading...</h1>;
    if (pStatus === "error") return <h1>{JSON.stringify(bError)}</h1>;

    const slides = bData?.data.map((item: any, i: number) => {
        return (
            <SwiperSlide className="slide" key={`homePageTopSlide-${i}`}>
                <BannerShowCard
                    title={item.canonicalTitle}
                    description={item.synopsis}
                    cover={
                        item.coverImage?.original ?? item.posterImage?.original
                    }
                    tags={item.genres.data.map((g: any) => g.name)}
                />
            </SwiperSlide>
        );
    });

    const cardPool = (
        <ShowCardPool infiniteScroll={infiniteScroll}>
            {pData?.pages.map((p) =>
                p.data.map((item: any, i: number) => {
                    return (
                        <ShowCard
                            title={item.canonicalTitle}
                            poster={item.posterImage?.small}
                            subtype={item.subtype}
                            id={item.id}
                            type={item.type}
                            key={`homePagePoolCard-${i}`}
                        ></ShowCard>
                    );
                })
            )}
        </ShowCardPool>
    );

    return (
        <div className="Home page">
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
                scrollbar={{ draggable: true }}
                pagination={{ dynamicBullets: true, clickable: true }}
                grabCursor={true}
                loop={true}
                modules={[Pagination]}
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
                className="banner"
            >
                {bStatus === "loading" ? (
                    <SwiperSlide>
                        <ReactLoading
                            type={"bubbles"}
                            color={"#e39"}
                            height={400}
                            width={300}
                            className="center"
                        />
                    </SwiperSlide>
                ) : (
                    slides
                )}
            </Swiper>

            <br />

            {pStatus === "loading" ? (
                <ReactLoading
                    type={"bubbles"}
                    color={"#e39"}
                    height={400}
                    width={300}
                    className="center"
                />
            ) : (
                cardPool
            )}

            {/* <hr />
            <div>
                <pre
                    style={{
                        position: "relative",
                        display: "block",
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                    }}
                >
                    {JSON.stringify(bData, null, 4)}
                </pre>
            </div> */}
        </div>
    );
}
