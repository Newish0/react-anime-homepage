import { eFetchJSON } from "./eFetchJSON";

class Kitsu {

    static BASEURL = "https://kitsu.io/api/edge";

    static async getByTypeID(type, id) {
        const url = `${Kitsu.BASEURL}/${type}/${id}`;
        let data = await eFetchJSON(url);
        return data;
    }

    static async anime(id) {
        return await Kitsu.getByTypeID("anime", id);
    }

    static async manga(id) {
        return await Kitsu.getByTypeID("manga", id);
    }

    static async simpleSearch(query, type = "anime", limit = 5, sort = "-followersCount") {
        // const url = `${Kitsu.BASEURL}/anime?filter[text]=${query}&page[limit]=${limit}&sort=${sort}`;
        const url = `${Kitsu.BASEURL}/${type}?filter[text]=${query}&page[limit]=${limit}`;
        let data = await eFetchJSON(url);
        return data;
    }
}

export default Kitsu;