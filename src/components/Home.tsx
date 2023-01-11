import React from "react";
import { useQuery } from "@tanstack/react-query";
import Kitsu from "kitsu";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Pagination } from "swiper";
import "swiper/css/pagination";

import BannerShowCard from "./ShowCards/BannerShowCard";

export default function Home() {
    const api = new Kitsu();

    // Wrap queryFn to allow passing params
    const { status, data, error } = useQuery({
        queryKey: ["seasonNow"],
        queryFn: () => api.get("anime"),
    });

    if (status === "loading") return <h1>Loading...</h1>;
    if (status === "error") return <h1>{JSON.stringify(error)}</h1>;

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
                {data.data.map((item: any, i: number) => {
                    return (
                        <SwiperSlide
                            className="slide"
                            key={`homePageTopSlide-${i}`}
                        >
                            <BannerShowCard
                                title={item.canonicalTitle}
                                description={item.synopsis}
                                poster={item.coverImage?.original}
                                // tags={item.genres.map((g: any) => g.name)}
                            />
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <hr />
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </div>
    );
}
