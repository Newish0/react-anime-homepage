import React, { CSSProperties, useState } from "react";
import LoadingBar from "./ARG/LoadingBar";
import NetworkInfoOverlay from "./ARG/NetworkInfoOverlay";
import RelationNetwork from "./ARG/RelationNetwork";

interface RelationVisWrapperProps {
    id: number | string;
    type: string;
    style: CSSProperties;
}

export const RelationVisWrapper = ({
    id,
    type,
    style,
}: RelationVisWrapperProps) => {
    const [loadingData, setLoadingData] = useState({
        percentage: 0,
        message: "",
    });
    const [noData, setNoData] = useState(false);

    const nodeSelectHandler = (params: any) => {};

    const progressHandler = (percentage: number, message: string) => {
        if (
            !percentage ||
            loadingData.percentage < percentage ||
            loadingData.message !== message
        ) {
            setLoadingData({
                percentage,
                message,
            });
        }
    };

    const networkNoDataHandler = (noData: boolean) => {
        setNoData(noData);
    };

    console.log(id, type);

    return (
        <div style={style}>
            <RelationNetwork
                kitsuID={id ?? 0}
                kitsuType={type ?? ""}
                onSelectNode={nodeSelectHandler}
                onProgress={progressHandler}
                onNoData={networkNoDataHandler}
                maxDepth={12}
            />

            <NetworkInfoOverlay hidden={loadingData.percentage === null}>
                <LoadingBar percentProgress={loadingData.percentage}>
                    {loadingData.message}
                </LoadingBar>
            </NetworkInfoOverlay>

            <NetworkInfoOverlay hidden={!noData}>
                <h2>No Data!</h2>
            </NetworkInfoOverlay>
        </div>
    );
};
