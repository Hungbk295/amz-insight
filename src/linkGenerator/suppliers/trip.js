import {SUPPLIERS} from "../../config/suppliers.js";

export class Trip {
    generateTopHotelTask(checkinDate, checkoutDate, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        return {
            link: `hotels/list?city=${keywordItem['tripCityId']}&provinceId=${keywordItem['tripProvinceId']}&cityName=${encodedKeyword}&checkin=${checkinDate.replaceAll('-', '/')}&checkout=${checkoutDate.replaceAll('-', '/')}&barCurr=KRW&adult=2&children=0&curr=KRW`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Trip.id
        }
    }
}