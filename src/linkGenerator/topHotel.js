/**
 * Input: List of destination (province), a checking date, a checkout date
 * Output: List of tasks having this format:
 *  - url: url of supplier page after searching with destination
 *      Optional (for agoda):
 *  - destination or keyword: name of destination (Hanoi, Seoul)
 *  - checkin date: checkin date
 *  - checkout date: checkout date
 */

import {Suppliers} from "../constants/suppliers.js";
import {sendMessages} from "../utils/util.js";
import axios from "axios";

function getDateInString(date){
    let month = date.getUTCMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    const day = date.getUTCDate()
    const year = date.getUTCFullYear()
    return `${year}-${month}-${day}`
}

function getTargetDate(dayType, subsequentWeek){
    const targetDayInWeek = dayType === 'weekday' ? 3 : 6;
    let date = new Date();
    date.setDate(date.getDate() + (targetDayInWeek - (date.getDay() % 7)) + 7 * subsequentWeek);
    const checkin = getDateInString(date)
    date = new Date()
    date.setDate(date.getDate() + (targetDayInWeek + 1 - (date.getDay() % 7)) + 7 * subsequentWeek);
    const checkout = getDateInString(date)

    return [checkin, checkout]
};

function generateLink(keywords, checkinDate, checkoutDate){
    let tasks = []
    const createdAt = new Date()
    for (const item of keywords){
        const keyword = item.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        for (const supplier in Suppliers){
            let task = {}
            switch (supplier) {
                case Suppliers.Booking.name:
                    task.url = Suppliers.Booking.url + `searchresults.ko.html?ss=${encodedKeyword}&dest_type=city&checkin=${checkinDate}&checkout=${checkoutDate}&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure&selected_currency=KRW`
                    break
                case Suppliers.Agoda.name:
                    task.url = Suppliers.Agoda.url + `ko-kr/search?city=${item.agoda_city_id}&isdym=true&searchterm=${keyword}&locale=ko-kr&currency=KRW&pageTypeId=1&realLanguageId=9&languageId=9&origin=KR&cid=-1&whitelabelid=1&loginLvl=0&storefrontId=3&currencyId=26&currencyCode=KRW&htmlLanguage=ko-kr&cultureInfoName=ko-kr&trafficSubGroupId=4&aid=130243&cttp=4&isRealUser=true&mode=production&browserFamily=Chrome&checkIn=2023-04-01&checkOut=2023-04-02&rooms=1&adults=1&children=0&priceCur=KRW&los=1&textToSearch=Hanoi&travellerType=0&familyMode=off`
                    break
                case Suppliers.Expedia.name:
                    task.url = Suppliers.Expedia.url + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${encodedKeyword}`
                    break
                case Suppliers.Hotels.name:
                    task.url = Suppliers.Hotels.url + `Hotel-Search?adults=2&startDate=${checkinDate}&endDate=${checkoutDate}&destination=${encodedKeyword}&locale=ko_KR`
                    break
                case Suppliers.Naver.name:
                    task.url = Suppliers.Naver.url + `list?placeFileName=place%3A${item.naver_city_name}&adultCnt=2&checkIn=${checkinDate}&checkOut=${checkoutDate}&includeTax=false&sortField=popularityKR&sortDirection=descending`
                    break
                case Suppliers.Trip.name:
                    const checkin = checkinDate.replaceAll('-', '/')
                    const checkout = checkoutDate.replaceAll('-', '/')
                    task.url = Suppliers.Trip.url + `hotels/list?city=${item.trip_city_id}&provinceId=${item.trip_province_id}&cityName=${encodedKeyword}&checkin=${checkin}&checkout=${checkout}&barCurr=KRW&adult=2&children=0&curr=KRW`
                    task.devices = ['mobile']
                    break
                case Suppliers.Priviatravel.name:
                    task.url = Suppliers.Priviatravel.url + `search/${item.privia_dest_info}.html?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&destinationType=${item.privia_dest_type}&destinationId=${item.privia_dest_id}`
                    task.devices = ['mobile']
                    break
                case Suppliers.Tourvis.name:
                    task.url = Suppliers.Tourvis.url + `hotels?type=${item.privia_dest_type}&keyword=${encodedKeyword}&id=${item.privia_dest_id}&in=${checkinDate.replaceAll("-", "")}&out=${checkoutDate.replaceAll("-", "")}&guests=2`
                    task.devices = ['mobile']
                    break
                // case Suppliers.Goodchoice.name:
                //     task.url = Suppliers.Goodchoice.url + `product/result?keyword=${encodedKeyword}`
                //     break
                // case Suppliers.Interpark.name:
                //     task.url = Suppliers.Interpark.url + `checkinnow/search/keyword?disp_q=${keyword}&startdate=20230520&enddate=20230522`
                //     task.devices = ['mobile']
                //     break
                // case Suppliers.Yanolja.name:
                //     task.url = Suppliers.Yanolja.url + `${item.yanolja_dest_info}?checkinDate=${checkinDate}&checkoutDate=${checkoutDate}`
                //     break

            }
            task.checkinDate = checkinDate
            task.checkoutDate = checkoutDate
            task.keywordId = item.id
            task.createdAt = createdAt
            tasks.push(task)
        }
    }
    console.log(tasks)
    console.log(tasks.length)
    return tasks
}

async function main() {
    const [checkinDate, checkoutDate] = getTargetDate('weekday', 1)
    const keywords = (await axios.get(process.env.HOTELFLY_API_HOST + '/keyword')).data
    const tasks = generateLink(keywords, checkinDate, checkoutDate)
    await sendMessages(tasks)
}

await main()
