import {Suppliers} from "../../constants/suppliers.js";

export class Trip {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        return {
            url: Suppliers.Trip.url + `hotels/list?city=${keywordItem['trip_city_id']}&provinceId=${keywordItem['trip_province_id']}&cityName=${encodedKeyword}&checkin=${checkinDate.replaceAll('-', '/')}&checkout=${checkoutDate.replaceAll('-', '/')}&barCurr=KRW&adult=2&children=0&curr=KRW`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt
        }
    }
}