import React from "react";
import { useQuery } from "@tanstack/react-query";
import Kitsu from "kitsu";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Pagination } from "swiper";
import "swiper/css/pagination";

import BannerShowCard from "./ShowCards/BannerShowCard";
import ShowCardPool from "./ShowCards/ShowCardPool";
import ShowCard from "./ShowCards/ShowCard";

export default function Home() {
    const api = new Kitsu();

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
                    sort: "popularityRank",
                },
            }),
    });

    const {
        status: pStatus,
        data: pData,
        error: pError,
    } = useQuery({
        queryKey: ["poolShows"],
        queryFn: () =>
            api.get("anime", {
                params: {
                    include: "genres",
                    sort: "popularityRank",
                },
            }),
    });

    if (bStatus === "loading") return <h1>Loading...</h1>;
    if (bStatus === "error") return <h1>{JSON.stringify(bError)}</h1>;

    if (pStatus === "loading") return <h1>Loading...</h1>;
    if (pStatus === "error") return <h1>{JSON.stringify(bError)}</h1>;

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

            <ShowCardPool>
                {pData.data.map((item: any, i: number) => {
                    return (
                        <ShowCard
                            title={item.canonicalTitle}
                            poster={item.posterImage?.small}
                            subtype={item.subtype}
                            key={`homePagePoolCard-${i}`}
                        ></ShowCard>
                    );
                })}
            </ShowCardPool>

            <hr />
            <pre>{JSON.stringify(bData, null, 4)}</pre>
        </div>
    );
}
