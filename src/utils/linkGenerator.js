import {Suppliers} from "../constants/suppliers.js";
import {Lambda} from 'aws-sdk';

export function generateLink(keywords, checkinDate, checkoutDate, suppliers, createdAt) {
    let tasks = []
    for (const item of keywords) {
        const keyword = item.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        for (const idxSup in suppliers) {
            let task = {}
            switch (suppliers[idxSup].id) {
                case Suppliers.Booking.id:
                    task.url = Suppliers.Booking.url + `searchresults.ko.html?ss=${encodedKeyword}&dest_type=city&checkin=${checkinDate}&checkout=${checkoutDate}&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure&selected_currency=KRW`
                    task.devices = ['mobile']
                    break
                case Suppliers.Agoda.id:
                    task.url = Suppliers.Agoda.url + `ko-kr/search?city=${item.agoda_city_id}&isdym=true&searchterm=${keyword}&locale=ko-kr&currency=KRW&pageTypeId=1&realLanguageId=9&languageId=9&origin=KR&cid=-1&whitelabelid=1&loginLvl=0&storefrontId=3&currencyId=26&currencyCode=KRW&htmlLanguage=ko-kr&cultureInfoName=ko-kr&trafficSubGroupId=4&aid=130243&cttp=4&isRealUser=true&mode=production&browserFamily=Chrome&checkIn=${checkinDate}&checkOut=${checkoutDate}&rooms=1&adults=1&children=0&priceCur=KRW&los=1&textToSearch=Hanoi&travellerType=0&familyMode=off`
                    break
                case Suppliers.Expedia.id:
                    task.url = Suppliers.Expedia.url + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${item.expedia_city_name}`
                    break
                case Suppliers.Hotels.id:
                    task.url = Suppliers.Hotels.url + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${item.hotels_city_name}&locale=ko_KR`
                    break
                case Suppliers.Naver.id:
                    task.url = Suppliers.Naver.url + `list?placeFileName=place%3ASeoul&includeTax=true&adultCnt=2&checkIn=${checkinDate}&checkOut=${checkoutDate}&sortField=popularityKR&sortDirection=descending`
                    break
                case Suppliers.Trip.id:
                    task.url = Suppliers.Trip.url + `hotels/list?city=${item.trip_city_id}&provinceId=${item.trip_province_id}&cityName=${encodedKeyword}&checkin=${checkinDate.replaceAll('-', '/')}&checkout=${checkoutDate.replaceAll('-', '/')}&barCurr=KRW&adult=2&children=0&curr=KRW`
                    task.devices = ['mobile']
                    break
                case Suppliers.Priviatravel.id:
                    task.url = Suppliers.Priviatravel.url + `search/${item.privia_dest_info}.html?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&destinationType=${item.privia_dest_type}&destinationId=${item.privia_dest_id}`
                    task.devices = ['mobile']
                    break
                case Suppliers.Tourvis.id:
                    task.url = Suppliers.Tourvis.url + `hotels?type=${item.privia_dest_type}&keyword=${encodedKeyword}&id=${item.privia_dest_id}&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}&guests=2`
                    task.devices = ['mobile']
                    break
                case Suppliers.Kyte.id:
                    task.url = Suppliers.Kyte.url + `hotels/list?id=${item.kyte_city_id}&keyword=${keyword}&type=SEARCH_SOURCE_REGION_EPS&no_cal=true&guests=2&in=${checkinDate.replaceAll('-', '')}&out=${checkoutDate.replaceAll('-', '')}`
                    task.devices = ['mobile']
                    break
            }
            task.checkinDate = checkinDate
            task.checkoutDate = checkoutDate
            task.keywordId = item.id
            task.keyword = item.keyword
            task.createdAt = createdAt
            tasks.push(task)
        }
    }
    return tasks
}

export function getDateInString(date) {
    let month = date.getMonth() + 1
    month = month < 10 ? `0${month}` : month
    let day = date.getDate()
    day = day < 10 ? `0${day}` : day
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
}

export function getTargetDate(dayType, subsequentWeek) {
    const targetDayInWeek = dayType === 'weekday' ? 1 : 6
    let date = new Date()
    date.setDate(date.getDate() + (targetDayInWeek - (date.getDay() % 7)) + 7 * subsequentWeek)
    const checkin = getDateInString(date)
    date = new Date()
    date.setDate(date.getDate() + (targetDayInWeek + 1 - (date.getDay() % 7)) + 7 * subsequentWeek)
    const checkout = getDateInString(date)

    return [checkin, checkout]
}

export async function execGetInternalPrices(action, createdAt) {
    const lambda = new Lambda();
    const params = {
        FunctionName: 'hotel-internal-data', /* required */
        Payload: JSON.stringify({
            'action': action, 'createdAt': createdAt
        })
    };
    lambda.invoke(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}
