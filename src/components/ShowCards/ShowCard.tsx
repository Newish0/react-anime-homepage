import { Link } from "react-router-dom";
import "./ShowCard.scss";

interface ShowCardProps {
    title: string;
    poster: string;
    subtype: string;
    type?: string;
    id?: number;
}
export default function ShowCard({
    title,
    poster,
    subtype,
    type,
    id,
}: ShowCardProps) {
    const card = (
        <div className="ShowCard">
            <h3 className="Title">{title}</h3>
            <span className="Subtype">{subtype}</span>
            <img className="Poster" src={poster} alt={`Poster of ${title}`} />
        </div>
    );

    if (type && id) return <Link to={`/${type}/${id}`} className="Link">{card}</Link>;
    else return card;
}
