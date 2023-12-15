import {Suppliers} from "../../constants/suppliers.js";

export class Naver {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            url: Suppliers.Naver.url + `list?placeFileName=place%${keywordItem['naver_city_name']}&includeTax=true&adultCnt=2&checkIn=${checkinDate}&checkOut=${checkoutDate}&sortField=popularityKR&sortDirection=descending`,
            // Suppliers.Naver.url + `list?placeFileName=place%3ASeoul&includeTax=true&adultCnt=2&checkIn=${checkinDate}&checkOut=${checkoutDate}&sortField=popularityKR&sortDirection=descending`
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt
        }
    }

    generateTaskForHotelDetail(checkinDate, checkoutDate, keywordItem, createdAt, supplierId, hotelId) {
        return {}
    }
}

