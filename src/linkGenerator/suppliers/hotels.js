import {SUPPLIERS} from "../../config/suppliers.js";

export class Hotels {
    generateTopHotelTask(checkIn, checkOut, keywordItem, createdAt) {
        return {
            link: `Hotel-Search?adults=2&startDate=${checkIn}&endDate=${checkOut}&destination=${keywordItem['hotelsCityName']}&locale=ko_KR`,
            checkIn: checkIn,
            checkOut: checkOut,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Hotels.id
        }
    }
}