import { MouseEvent, ReactNode, SyntheticEvent, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";

import "./ShowCard.scss";

interface ShowCardPoolProps {
    children: ReactNode;
    infiniteScroll?: {
        onLoadMore: () => void;
        useClick?: boolean;
        component?: React.ReactElement;
        hasNext: boolean;
    };
}
export default function ShowCardPool({
    children,
    infiniteScroll: is,
}: ShowCardPoolProps) {
    const ref = useRef<HTMLButtonElement | null>(null);
    const entry = useIntersectionObserver(ref, {});
    const isVisible = !!entry?.isIntersecting;

    if (!is) {
        return <div className="ShowCardPool">{children}</div>;
    }

    if (isVisible && !is?.useClick) {
        is?.onLoadMore();
    }

    function isClickHandler(evt: MouseEvent) {
        if (is?.useClick) {
            is?.onLoadMore();
        }
    }

    return (
        <div>
            <div className="ShowCardPool">{children}</div>
            {is.component ?? (
                <button
                    ref={ref}
                    className="LoadMore"
                    onClick={isClickHandler}
                    hidden={!is.hasNext}
                >
                    Load more
                </button>
            )}
        </div>
    );
}
