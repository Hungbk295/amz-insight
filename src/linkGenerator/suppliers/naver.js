import {SUPPLIERS} from "../../config/suppliers.js";

export class Naver {
    generateTopHotelTask(checkIn, checkOut, keywordItem, createdAt) {
        return {
            link: `list?placeFileName=place%3A${keywordItem['naverCityName']}&includeTax=true&adultCnt=2&checkIn=${checkIn}&checkOut=${checkOut}&sortField=popularityKR&sortDirection=descending`,
            checkIn: checkIn,
            checkOut: checkOut,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Naver.id
        }
    }
}

