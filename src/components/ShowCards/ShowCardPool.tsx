import { useQuery } from "@tanstack/react-query";
import Kitsu from "kitsu";
import { MouseEvent, ReactNode, SyntheticEvent } from "react";

import "./ShowCard.scss";

interface ShowCardPoolProps {
    children: ReactNode;
    infiniteScroll?: {
        onLoadMore: (evt: SyntheticEvent) => void;
        useClick?: boolean;
        component?: React.ReactElement;
    };
}
export default function ShowCardPool({
    children,
    infiniteScroll: is,
}: ShowCardPoolProps) {
    if (!is) {
        return <div className="ShowCardPool">{children}</div>;
    }

    function isClickHandler(evt: MouseEvent) {
        if (is?.useClick) {
            is?.onLoadMore(evt);
        }
    }

    return (
        <div>
            <div className="ShowCardPool">{children}</div>
            {is.component ?? (
                <button className="LoadMore" onClick={isClickHandler}>
                    Load more
                </button>
            )}
        </div>
    );
}
