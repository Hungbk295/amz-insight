import {SUPPLIERS} from "../../config/suppliers.js";

export class Hotels {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            link: SUPPLIERS.Hotels.link + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${keywordItem['hotels_city_name']}&locale=ko_KR`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Hotels.id
        }
    }
}