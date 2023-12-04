import {Suppliers} from "../../constants/suppliers.js";

export class Expedia {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            url: Suppliers.Expedia.url + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${keywordItem['expedia_city_name']}`,
            // Suppliers.Expedia.url + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${item.expedia_city_name}`
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt
        }
    }
}