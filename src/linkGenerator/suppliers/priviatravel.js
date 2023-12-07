import {Suppliers} from "../../constants/suppliers.js";

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
}