import {SUPPLIERS} from "../../config/suppliers.js";

export class Trip {
    generateTopHotelTask(checkIn, checkOut, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        return {
            link: `hotels/list?city=${keywordItem['tripCityId']}&provinceId=${keywordItem['tripProvinceId']}&cityName=${encodedKeyword}&checkin=${checkIn.replaceAll('-', '/')}&checkout=${checkOut.replaceAll('-', '/')}&barCurr=KRW&adult=2&children=0&curr=KRW`,
            checkIn: checkIn,
            checkOut: checkOut,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Trip.id
        }
    }
}