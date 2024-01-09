import {SUPPLIERS} from "../../config/suppliers.js";
import Sentry from "../../utils/sentry.js";

export class Tourvis {
    generateTopHotelTask(checkinDate, checkoutDate, keywordItem, createdAt) {
        const keyword = keywordItem.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        return {
            link: `hotels?type=${keywordItem['priviaDestType']}&keyword=${encodedKeyword}&id=${keywordItem['priviaDestId']}&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}&guests=2`,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            keywordId: keywordItem.id,
            createdAt: createdAt,
            supplierId: SUPPLIERS.Tourvis.id
        }
    }

    generateHotelDetailTask(checkinDate, checkoutDate, keyword, createdAt, hotelInfo) {
        if (hotelInfo['link']) {
            const keywordTxt = keyword.keyword
            const encodedKeyword = encodeURIComponent(keywordTxt)
            const link = hotelInfo['link'] + `?type=${keyword['priviaDestType']}&keyword=${encodedKeyword}&id=${keyword['priviaDestId']}&&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}&guests=2&pageType=main&h=1`
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

