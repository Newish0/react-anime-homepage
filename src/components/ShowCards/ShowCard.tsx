import "./ShowCard.scss";

interface ShowCardProps {
    title: string;
    poster: string;
    subtype: string;
}
export default function ShowCard({ title, poster, subtype }: ShowCardProps) {
    return (
        <div className="ShowCard">
            <h3 className="Title">{title}</h3>
            <span className="Subtype">{subtype}</span>
            <img className="Poster" src={poster} alt={`Poster of ${title}`} />
        </div>
    );
}
