import React, { Component } from "react";
import RelationNetwork from "./RelationNetwork";
import KitsuSimpleSearchBar from "./KitsuSimpleSearchBar";
import DetailPanel from "./DetailPanel";
import LoadingBar from "./LoadingBar";
import NetworkInfoOverlay from "./NetworkInfoOverlay";
import NetworkSettingBtn from "./NetworkSettingBtn";
import Kitsu from "../lib/kitsu";

/* 
Should move to TS? 

type KitsuType = "anime" | "manga";

interface KitsuData {
    id: number | string;
    type: KitsuType;
    [key: string]: any;
}
*/

class RelationVis extends Component {
    // constructor(props) {
    //     super(props);
    // }

    state = {
        kitsuData: null,
        detailPanelData: null,
        loadingData: {
            percentage: null,
            message: "",
        },
        networkNoData: false,
        showSettingsOverlay: false,
    };

    // Param: KitsuData
    dataChangeHandler = (kitsuData) => {
        // Note: detailPanelData need copy of kitsuData as it will be independent of state.kitsuData late
        this.setState({
            kitsuData,
            detailPanelData: { ...kitsuData },
        });
    };

    nodeSelectHandler = (params) => {
        const selectedNodeID = params.nodes[0];
        const type = selectedNodeID.split("-")[0];
        const id = selectedNodeID.split("-")[1];

        Kitsu.getByTypeID(type, id).then((data) => {
            this.setState({ detailPanelData: data.data });
        });
    };

    progressHandler = (percentage, message) => {
        this.setState({
            loadingData: {
                percentage,
                message,
            },
        });
    };

    networkNoDataHandler = (noData) => {
        this.setState({ networkNoData: noData });
    };

    render = () => {
        const { kitsuData, detailPanelData, loadingData, networkNoData } =
            this.state;

        return (
            <React.Fragment>
                <div className="side-bar">
                    <KitsuSimpleSearchBar
                        settleTime={300}
                        onResult={this.dataChangeHandler}
                    />
                    <DetailPanel mediaData={detailPanelData} />
                </div>
                <div>
                    <RelationNetwork
                        kitsuID={kitsuData ? kitsuData.id : 0}
                        kitsuType={kitsuData ? kitsuData.type : ""}
                        onSelectNode={this.nodeSelectHandler}
                        onProgress={this.progressHandler}
                        onNoData={this.networkNoDataHandler}
                        maxDepth={20}
                    />

                    <NetworkInfoOverlay
                        hidden={loadingData.percentage === null}
                    >
                        <LoadingBar percentProgress={loadingData.percentage}>
                            {loadingData.message}
                        </LoadingBar>
                    </NetworkInfoOverlay>

                    <NetworkInfoOverlay hidden={!networkNoData}>
                        <h2>No Data!</h2>
                    </NetworkInfoOverlay>

                    {/* <NetworkSettingBtn /> */}
                </div>
            </React.Fragment>
        );
    };
}

export default RelationVis;
