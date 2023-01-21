
import { eFetchJSON } from "./eFetchJSON";

// Prototype
// TODO: move parse to async within BFS to improve performance
class KitsuRelation {
    static BASEURL = `https://kitsu.io/api/edge/media-relationships`

    static async get(id, type, maxDepth = 0, progressCallback) {
        let accumData = [];

        // Ensure type[0] is upper case
        type = type[0].toUpperCase() + type.substring(1);

        await this.#getRecur(id, type, 0, maxDepth, accumData, [], progressCallback);
        return accumData;
    }

    // BFS 
    // TODO: parse as async to improve performance --> move to Iter. ver.
    static async #getRecur(id, type, depth, maxDepth, accumData, visited, progressCallback) {
        if (depth > maxDepth) return false;

        if (progressCallback) {
            progressCallback(depth / maxDepth);
        }

        const url = `${this.BASEURL}?filter[source_id]=${id}&filter[source_type]=${type}&include=destination&page[limit]=20&&sort=role`

        if (visited.includes(url)) return false;
        else visited.push(url);



        let data = await eFetchJSON(url);
        const relations = data.data;
        let links = data.links;
        data.depth = depth;
        accumData.push(data);

        const recRelsCalls = [];

        // Get all next pages
        while (links && links.next) {
            data = await eFetchJSON(links.next)
            links = data.links;
            accumData.push(data);
            relations.push(...data.data);
        }

        for (const relation of relations) {
            let destType = relation.relationships.destination.data.type;
            const desId = relation.relationships.destination.data.id;

            // Add in additional data to API returned data
            relation.relationships.source.data = {
                id,
                type: type.toLowerCase()
            }
            relation.depth = depth;


            destType = destType[0].toUpperCase() + destType.substring(1);

            recRelsCalls.push(this.#getRecur(desId, destType, depth + 1, maxDepth, accumData, visited, progressCallback));
        }

        await Promise.all(recRelsCalls);

        return true;
    }


    static parseRelations(relations) {
        // return relation ~edges 
        // return des/source data ~nodes 

        const desList = []
        const relList = []


        for (const relation of relations) {
            const desData = relation.included;
            const relData = relation.data;

            // TODO: too much nesting; refactor to function?
            if (desData) {
                // TODO: consider hash instead to improve performance
                for (const item of desData) {
                    if (!desList.find(n => n.id === item.id && n.type === item.type)) {
                        desList.push(item);
                    }
                }
            }
            // TODO: too much nesting; refactor to function?
            if (relData) {
                // TODO: consider hash instead to improve performance
                for (const item of relData) {
                    if (!relList.find(n => n.id === item.id)) {
                        relList.push(item);
                    }
                }
            }

        }

        return {
            destinations: desList,
            relations: relList
        }
    }
}

export default KitsuRelation;