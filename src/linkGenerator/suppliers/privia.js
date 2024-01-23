import {SUPPLIERS} from "../../config/suppliers.js";
import Sentry from "../../utils/sentry.js";

export class Privia {
    generateTopHotelTask(checkIn, checkOut, keywordItem, createdAt) {
        return {
            link: `search/${keywordItem['priviaDestInfo']}.html?checkIn=${checkIn}&checkOut=${checkOut}&occupancies=1~1~0&destinationType=${keywordItem['priviaDestType']}&destinationId=${keywordItem['priviaDestId']}`,
            checkIn: checkIn,
            checkOut: checkOut,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Privia.id
        }
    }

    generateHotelDetailTask(checkIn, checkOut, keyword, createdAt, hotelInfo) {
        if (hotelInfo['link']) {
            const link = hotelInfo['link'] + `?checkIn=${checkIn}&checkOut=${checkOut}&occupancies=1~1~0&htlMasterId=${hotelInfo['identifier']}`
            return {
                name: hotelInfo['name'],
                nameEn: hotelInfo['nameEn'],
                address: hotelInfo['address'],
                supplierId: hotelInfo['supplierId'],
                identifier: hotelInfo['identifier'],
                tag: hotelInfo['tag'],
                rank: hotelInfo['rank'],
                checkIn: checkIn,
                checkOut: checkOut,
                createdAt: createdAt,
                link: link,
                keywordId: keyword.id
            }
        }
        Sentry.captureMessage('Cannot generate hotel detail task!', {
            level: 'error', extra: {
                json: JSON.stringify({
                    checkIn,
                    checkOut,
                    keyword,
                    createdAt,
                    hotelInfo
                })
            },
        })
    }
}