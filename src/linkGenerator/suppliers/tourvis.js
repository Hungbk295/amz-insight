import {Suppliers} from "../../constants/suppliers.js";

export class Tourvis {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        return {
            url: Suppliers.Tourvis.url + `hotels?type=${keywordItem['privia_dest_type']}&keyword=${encodedKeyword}&id=${keywordItem['privia_dest_id']}&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}&guests=2`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt
        }
    }

    generateTaskForHotelDetail(checkinDate, checkoutDate, keywordItem, createdAt, hotelId) {
        return {}
    }
}