import {SUPPLIERS} from "../../config/suppliers.js";
import Sentry from "../../utils/sentry.js";

export class Privia {
    generateTopHotelTask(checkinDate, checkoutDate, keywordItem, createdAt) {
        return {
            link: `search/${keywordItem['priviaDestInfo']}.html?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&destinationType=${keywordItem['priviaDestType']}&destinationId=${keywordItem['priviaDestId']}`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Privia.id
        }
    }

    generateHotelDetailTask(checkinDate, checkoutDate, keyword, createdAt, hotelInfo) {
        if (hotelInfo['link']) {
            const link = hotelInfo['link'] + `?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&htlMasterId=${hotelInfo['identifier']}`
            return {
                name: hotelInfo['name'],
                nameEn: hotelInfo['nameEn'],
                address: hotelInfo['address'],
                supplierId: hotelInfo['supplierId'],
                identifier: hotelInfo['identifier'],
                tag: hotelInfo['tag'],
                rank: hotelInfo['rank'],
                checkinDate: checkinDate,
                checkoutDate: checkoutDate,
                createdAt: createdAt,
                link: link,
                keywordId: keyword.id
            }
        }
        Sentry.captureMessage('Cannot generate hotel detail task!', {
            level: 'error', extra: {
                json: JSON.stringify({
                    checkinDate,
                    checkoutDate,
                    keyword,
                    createdAt,
                    hotelInfo
                })
            },
        })
    }
}