import {Suppliers} from "../../config/suppliers.js";
import axios from "axios";

export class Priviatravel {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            url: Suppliers.Priviatravel.url + `search/${keywordItem['privia_dest_info']}.html?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&destinationType=${keywordItem['privia_dest_type']}&destinationId=${keywordItem['privia_dest_id']}`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt
        }
    }

    async generateTaskForHotelDetail(checkinDate, checkoutDate, keywordItem, createdAt, hotelInfo) {
        const link = Suppliers.Priviatravel.url + hotelInfo['link'].split('?')[0] + `?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&htlMasterId=${hotelInfo['identifier']}`
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