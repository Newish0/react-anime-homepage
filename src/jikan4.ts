import axios from "axios";
import { Type } from "typescript";

// Source: https://dev.to/tylim88/typescript-numeric-range-type-15a5
type CreateArrayWithLengthX<
    LENGTH extends number,
    ACC extends unknown[] = [],
> = ACC['length'] extends LENGTH
    ? ACC
    : CreateArrayWithLengthX<LENGTH, [...ACC, 1]>

type NumericRange<
    START_ARR extends number[],
    END extends number,
    ACC extends number = never>
    = START_ARR['length'] extends END
    ? ACC | END
    : NumericRange<[...START_ARR, 1], END, ACC | START_ARR['length']>


type JikanLimit = NumericRange<CreateArrayWithLengthX<0>, 25>;

interface JikanPaginationParams {
    limit?: JikanLimit;
    page?: number;
}


interface MalTag {
    id: number;
    type: string;
    name: string;
}

class Jikan {
    static BASEURL = "https://api.jikan.moe";
    pagination: any;
    lastUrl: string;
    lastParams: any;
    self: any;

    constructor() {
        this.pagination = null;
        this.lastUrl = "";
        this.lastParams = null;
        this.self = this;
    }

    getSeasonNow(params: JikanPaginationParams = {
        limit: 25, page: 1
    },) {
        const url = `${Jikan.BASEURL}/v4/seasons/now`;
        return this.get(url, params);
    }

    // FIXME: this.pagination etc... not updated in get()
    hasNext() {
        if (this.lastUrl && this.pagination) {
            return this.pagination["has_next_page"];
        }
    }

    // FIXME: this.pagination etc... not updated in get()
    getNext() {
        if (!this.hasNext()) {
            return null;
        }

        const newParam = { ...this.lastParams, page: this.pagination["lastParams"] + 1 }
        return this.get(this.lastUrl, newParam);
    }

    // Wraps axios.get with additional class data operation 
    // FIXME: this.pagination etc... not updated in get()
    private get(url: string, params: object) {
        return axios.get(url, { params }).then((response) => {
            this.pagination = response.data.pagination;
            this.lastUrl = url;
            this.lastParams = params;
            return response.data
        });
    }

}

export default Jikan;