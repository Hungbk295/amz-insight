import {SUPPLIERS} from "../../config/suppliers.js";

export class Expedia {
    generateTopHotelTask(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            link: `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${keywordItem['expediaCityName']}`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Expedia.id
        }
    }
}