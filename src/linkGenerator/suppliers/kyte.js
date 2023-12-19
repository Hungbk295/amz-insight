import {Suppliers} from "../../config/suppliers.js";

export class Kyte {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        return {
            url: Suppliers.Kyte.url + `hotels/list?id=${keywordItem['kyte_city_id']}&keyword=${keyword}&type=SEARCH_SOURCE_REGION_EPS&no_cal=true&guests=2&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt
        }
    }
}