import {SUPPLIERS} from "../../config/suppliers.js";

export class Naver {
    generateTopHotelTask(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            link: `list?placeFileName=place%3A${keywordItem['naverCityName']}&includeTax=true&adultCnt=2&checkIn=${checkinDate}&checkOut=${checkoutDate}&sortField=popularityKR&sortDirection=descending`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Naver.id
        }
    }
}

