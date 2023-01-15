import { Property } from "csstype";
import { CSSProperties } from "react";

interface BannerProps extends React.PropsWithChildren {
    src: string;
    height: Property.Height;
    className?: string;
    style?: CSSProperties;
}

export default function Banner({
    src,
    height,
    style,
    children,
    className,
}: BannerProps) {
    return (
        <div
            className={className}
            style={{
                width: "100%",
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                height,
                ...style,
            }}
        >
            {children}
        </div>
    );
}
