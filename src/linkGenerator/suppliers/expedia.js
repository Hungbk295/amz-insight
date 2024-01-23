import {SUPPLIERS} from "../../config/suppliers.js";

export class Expedia {
    generateTopHotelTask(checkIn, checkOut, keywordItem, createdAt) {
        return {
            link: `Hotel-Search?adults=2&startDate=${checkIn}&endDate=${checkOut}&destination=${keywordItem['expediaCityName']}`,
            checkIn: checkIn,
            checkOut: checkOut,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Expedia.id
        }
    }
}