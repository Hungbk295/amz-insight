import {SUPPLIERS} from "../../config/suppliers.js";

export class Expedia {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            link: SUPPLIERS.Expedia.link + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${keywordItem['expedia_city_name']}`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Expedia.id
        }
    }
}