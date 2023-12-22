import {SUPPLIERS} from "../../config/suppliers.js";

export class Tourvis {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        return {
            link: SUPPLIERS.Tourvis.link + `hotels?type=${keywordItem['privia_dest_type']}&keyword=${encodedKeyword}&id=${keywordItem['privia_dest_id']}&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}&guests=2`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Tourvis.id
        }
    }

    async generateTaskForHotelDetail(checkinDate, checkoutDate, keywordItem, createdAt, hotelInfo) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        const link = SUPPLIERS.Tourvis.link + hotelInfo['link'].substring(1) + `?type=${keywordItem['privia_dest_type']}&keyword=${encodedKeyword}&id=${keywordItem['privia_dest_id']}&&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}&guests=2&pageType=main&h=1`
        return {
            name: hotelInfo['name'],
            nameEn: hotelInfo['name_en'],
            address: hotelInfo['address'],
            supplierId: hotelInfo['supplier_id'],
            identifier: hotelInfo['identifier'],
            tag: hotelInfo['tag'],
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            createdAt: createdAt,
            link: link,
            keywordId: keywordItem['id']
        }
    }
}

