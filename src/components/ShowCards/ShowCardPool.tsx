import { useQuery } from "@tanstack/react-query";
import Kitsu from "kitsu";
import { ReactNode } from "react";

import "./ShowCard.scss";

interface ShowCardPoolProps {
    children: ReactNode;
}
export default function ShowCardPool({ children }: ShowCardPoolProps) {
    return <div className="ShowCardPool">{children}</div>;
}
