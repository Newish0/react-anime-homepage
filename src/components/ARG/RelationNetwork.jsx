import React from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import KitsuRelation from "./lib/kitsuRelation";
import brokenImage from "./imgs/broken-image-small.png";
import bgPattern from "./imgs/bg-pat.png";

class RelationNetwork extends React.PureComponent {
    state = {
        maxDepth: this.props.maxDepth ?? 12,
    };

    constructor(props) {
        super(props);

        this.containerRef = React.createRef();
    }

    // kebab & snake case to title case
    // Source: https://stackoverflow.com/a/64489760
    titleCase = (s) =>
        s
            .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
            .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase()); // First char after each -/_

    createVisNetwork = async (id, type) => {
        const relRoleColorMap = {
            prequel: "hsl(0, 50%, 70%)",
            summery: "hsl(23, 50%, 70%)",
            side_story: "hsl(46, 50%, 70%)",
            spinoff: "hsl(69, 50%, 70%)",
            sequel: "hsl(92, 50%, 70%)",
            alternative_setting: "hsl(115, 50%, 70%)",
            adaptation: "hsl(138, 50%, 70%)",
            parent_story: "hsl(161, 50%, 70%)",
            alternative_version: "hsl(184, 50%, 70%)",
            full_story: "hsl(207, 50%, 70%)",
            other: "hsl(230, 50%, 70%)",
        };

        const container = this.containerRef.current;

        container.style.background = "#222";

        // const rawRelations = await KitsuRelation.get(5287, 5);
        const rawRelations = await KitsuRelation.get(
            id,
            type,
            this.state.maxDepth,
            (proportion) => {
                let percentage = proportion * 50;
                this.props.onProgress(percentage, "Fetching data");
            }
        );

        let { relations, destinations } =
            KitsuRelation.parseRelations(rawRelations);

        let edgeInfoList = relations.map((rel) => {
            const desData = rel.relationships.destination.data;
            const srcData = rel.relationships.source.data;
            return {
                from: `${desData.type}-${desData.id}`,
                to: `${srcData.type}-${srcData.id}`,
                label: this.titleCase(rel.attributes.role),
                color: relRoleColorMap[rel.attributes.role],
                level: rel.depth,
                id: `${rel.type}-${rel.id}`,
                kitsuRelMeta: {
                    role: rel.attributes.role,
                    id: rel.id,
                    type: rel.type,
                },
            };
        });

        // Simplify graph
        for (let i = edgeInfoList.length - 1; i >= 0; i--) {
            const a = edgeInfoList[i];
            for (let j = edgeInfoList.length - 1; j >= 0; j--) {
                const b = edgeInfoList[j];
                if (
                    a.to === b.from &&
                    a.from === b.to &&
                    a.kitsuRelMeta.role === b.kitsuRelMeta.role
                ) {
                    edgeInfoList.splice(j, 1);
                    a.arrows = {
                        to: {
                            enabled: true,
                            type: "arrow",
                        },
                        from: {
                            enabled: true,
                            type: "arrow",
                        },
                    };
                }
            }
        }

        let nodeInfoList = destinations.map((des) => {
            return {
                id: `${des.type}-${des.id}`,
                label: des.attributes.canonicalTitle,
                font: {
                    color: "#eee"
                },
                shape: "circularImage",
                image: des.attributes.posterImage.small ?? brokenImage,
                color:
                    des.type === "anime"
                        ? "#00fffb"
                        : des.attributes.subtype === "manga"
                        ? "#ff00d4"
                        : "#91ff00",
                borderWidth: 4,
            };
        });

        let nodes = new DataSet(nodeInfoList);
        let edges = new DataSet(edgeInfoList);

        // create a graph
        let data = {
            nodes,
            edges,
        };

        let options = {
            edges: {
                length: 500,
                arrows: {
                    from: {
                        enabled: true,
                        type: "arrow",
                    },
                },
                font: {
                    align: "middle",
                },
            },
            nodes: {
                shape: "dot",
                size: 32,
                brokenImage,
            },
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -30,
                    centralGravity: 0.001,
                    springLength: 250,
                    springConstant: 0.1,
                    avoidOverlap: 0.2,
                },
                maxVelocity: 100,
                solver: "forceAtlas2Based",
                timestep: 0.25,
                adaptiveTimestep: true,
                stabilization: { iterations: 1000 },
            },
            layout: {
                randomSeed: 0,
            },
        };

        let network = new Network(container, data, options);

        network.on("selectNode", (params) => {
            this.props.onSelectNode(params);
        });

        // Callback on each stabilization step
        network.on("stabilizationProgress", (params) => {
            let percentage = 50 + (params.iterations / params.total) * 50;
            this.props.onProgress(percentage, "Generating graph");
        });

        // Callback when complete stabilization.
        network.once("stabilizationIterationsDone", () => {
            this.props.onProgress(null, "");

            // Zoom to root node
            this.zoomToNode(network, `${type}-${id}`);
        });

        this.props.onNoData(nodeInfoList.length < 1);
    };

    zoomToNode = (
        network,
        nodeID,
        options = {
            scale: 0.9,
            offset: { x: 0, y: 0 },
            animation: {
                duration: 1000,
                easingFunction: "easeInOutCubic",
            },
        }
    ) => {
        const nodePos = network.getPosition(nodeID);
        network.moveTo({
            position: nodePos,
            ...options,
        });
    };

    componentDidMount = () => {
        const { kitsuID, kitsuType } = this.props;
        this.createVisNetwork(kitsuID, kitsuType);
    };

    render = () => {
        return (
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: " 100%",
                    backgroundColor: "#efefef",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                    ref={this.containerRef}
                    id="relVisNetwork"
                />
            </div>
        );
    };
}

export default RelationNetwork;
