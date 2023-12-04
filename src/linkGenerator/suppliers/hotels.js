import {Suppliers} from "../../constants/suppliers.js";

export class Hotels {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            url: Suppliers.Hotels.url + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${keywordItem['hotels_city_name']}&locale=ko_KR`,
            // Suppliers.Hotels.url + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${item.hotels_city_name}&locale=ko_KR`
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt
        }
    }
}