import {SUPPLIERS} from "../../config/suppliers.js";

export class Booking {
    generateTopHotelTask(checkIn, checkOut, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        return {
            link: `searchresults.ko.html?ss=${encodedKeyword}&dest_type=city&checkin=${checkIn}&checkout=${checkOut}&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure&selected_currency=KRW`,
            checkIn: checkIn,
            checkOut: checkOut,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Booking.id
        }
    }
}