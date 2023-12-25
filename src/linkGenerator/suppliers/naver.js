import {SUPPLIERS} from "../../config/suppliers.js";

export class Naver {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            link: `list?placeFileName=place%3A${keywordItem['naver_city_name']}&includeTax=true&adultCnt=2&checkIn=${checkinDate}&checkOut=${checkoutDate}&sortField=popularityKR&sortDirection=descending`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Naver.id
        }
    }
}

