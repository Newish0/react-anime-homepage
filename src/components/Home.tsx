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

    const page = {
        limit: 20,
        offset: 0,
    };

    const {
        status: pStatus,
        data: pData,
        error: pError,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ["poolShows", "infinite"],
        getNextPageParam: () => (page.offset += page.limit),
        queryFn: ({ pageParam = page }) => {
            return api.get("anime", {
                params: {
                    include: "genres",
                    sort: "-averageRating",
                    filter: { season, seasonYear },
                    page,
                },
            });
        },
    });

    const infiniteScroll = {
        onLoadMore: (evt: SyntheticEvent) => {
            fetchNextPage();
        },
        useClick: true,
    };

    if (bStatus === "loading") return <h1>Loading...</h1>;
    if (bStatus === "error") return <h1>{JSON.stringify(bError)}</h1>;

    if (pStatus === "loading") return <h1>Loading...</h1>;
    if (pStatus === "error") return <h1>{JSON.stringify(bError)}</h1>;

    console.log(pData);

    return (
        <div className="Home">
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
                {bData.data.map((item: any, i: number) => {
                    return (
                        <SwiperSlide
                            className="slide"
                            key={`homePageTopSlide-${i}`}
                        >
                            <BannerShowCard
                                title={item.canonicalTitle}
                                description={item.synopsis}
                                cover={
                                    item.coverImage?.original ??
                                    item.posterImage?.original
                                }
                                tags={item.genres.data.map((g: any) => g.name)}
                            />
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <br />

            <ShowCardPool infiniteScroll={infiniteScroll}>
                {pData.pages.map((p) =>
                    p.data.map((item: any, i: number) => {
                        console.log(item);
                        return (
                            <ShowCard
                                title={item.canonicalTitle}
                                poster={item.posterImage?.small}
                                subtype={item.subtype}
                                key={`homePagePoolCard-${i}`}
                            ></ShowCard>
                        );
                    })
                )}
            </ShowCardPool>

            <hr />
            <pre>{JSON.stringify(bData, null, 4)}</pre>
        </div>
    );
}
