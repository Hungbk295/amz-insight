import {SUPPLIERS} from "../../config/suppliers.js";

export class Kyte {
    generateTopHotelTask(checkIn, checkOut, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        return {
            link: `hotels/list?id=${keywordItem['kyteCityId']}&keyword=${keyword}&type=SEARCH_SOURCE_REGION_EPS&no_cal=true&guests=2&in=${checkIn.replaceAll('-', '')}&out=${checkOut.replaceAll('-', '')}`,
            checkIn: checkIn,
            checkOut: checkOut,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Kyte.id
        }
    }
}