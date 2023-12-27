import {SUPPLIERS} from "../../config/suppliers.js";

export class Hotels {
    generateTopHotelTask(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            link: `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${keywordItem['hotelsCityName']}&locale=ko_KR`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Hotels.id
        }
    }
}