import {Suppliers} from "../../constants/suppliers.js";
import axios from "axios";

export class Priviatravel {
    generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            url: Suppliers.Priviatravel.url + `search/${keywordItem['privia_dest_info']}.html?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&destinationType=${keywordItem['privia_dest_type']}&destinationId=${keywordItem['privia_dest_id']}`,
            // Suppliers.Priviatravel.url + `search/${item.privia_dest_info}.html?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&destinationType=${item.privia_dest_type}&destinationId=${item.privia_dest_id}`
            devices: ['mobile'],
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            keyword: keywordItem.keyword,
            createdAt: createdAt
        }
    }

    async generateTaskForHotelDetail(checkinDate, checkoutDate, keywordItem, createdAt, hotelId) {
        const params = {
            hotelId: hotelId,
            supplierId: Suppliers.Priviatravel.id,
        };
        const hotelMetaData = (await axios.get(process.env.HOTELFLY_API_HOST + '/hotel/hotel-meta-data', {params})).data
        const identifier = hotelMetaData['identifier']
        const hotelLink = hotelMetaData['link'].split('?')[0]
        const link = Suppliers.Priviatravel.url + hotelLink + `?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&htlMasterId=${identifier}`
        return {
            name: hotelMetaData['name'],
            nameEn: hotelMetaData['name_en'],
            address: hotelMetaData['address'],
            supplierId: hotelMetaData['supplier_id'],
            identifier: hotelMetaData['identifier'],
            tag: hotelMetaData['tag'],
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            createdAt: createdAt,
            link: link,
            keywordId: keywordItem['id']
        }
    }
}