import {SUPPLIERS} from "../../config/suppliers.js";

export class Booking {
    generateTopHotelTask(checkinDate, checkoutDate, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        return {
            link: `searchresults.ko.html?ss=${encodedKeyword}&dest_type=city&checkin=${checkinDate}&checkout=${checkoutDate}&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure&selected_currency=KRW`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Booking.id
        }
    }
}