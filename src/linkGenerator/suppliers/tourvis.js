import {Suppliers} from "../../constants/suppliers.js";

export class Tourvis {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        return {
            url: Suppliers.Tourvis.url + `hotels?type=${keywordItem['privia_dest_type']}&keyword=${encodedKeyword}&id=${keywordItem['privia_dest_id']}&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}&guests=2`,
            // Suppliers.Tourvis.url + `hotels?type=${item.privia_dest_type}&keyword=${encodedKeyword}&id=${item.privia_dest_id}&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}&guests=2`
            devices: ['mobile'],
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt
        }
    }
}