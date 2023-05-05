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
import {getAgodaCityId, getNaverCityName, getTripCityId} from "../utils/cityInfo.js";
import axios from "axios";

function generateLink(keywords, checkinDate, checkoutDate){
    let tasks = []
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
                    task.url = Suppliers.Agoda.url + `search?city=${item.agoda_city_id}&isdym=true&searchterm=${keyword}&locale=ko-kr&currency=KRW&pageTypeId=1&realLanguageId=9&languageId=9&origin=KR&cid=-1&whitelabelid=1&loginLvl=0&storefrontId=3&currencyId=26&currencyCode=KRW&htmlLanguage=ko-kr&cultureInfoName=ko-kr&trafficSubGroupId=4&aid=130243&cttp=4&isRealUser=true&mode=production&browserFamily=Chrome&checkIn=2023-04-01&checkOut=2023-04-02&rooms=1&adults=1&children=0&priceCur=KRW&los=1&textToSearch=Hanoi&travellerType=0&familyMode=off`
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
                    task.url = Suppliers.Priviatravel.url + `${item.privia_dest_info}.html?checkIn=${checkinDate}&checkOut=${checkoutDate}&occupancies=1~1~0&destinationType=${item.privia_dest_type}&destinationId=${item.privia_dest_id}`
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
            tasks.push(task)
        }
    }
    console.log(tasks)
    console.log(tasks.length)
    return tasks
}

async function main() {
    const [checkinDate, checkoutDate] = ['2023-06-13', '2023-06-14']
    const keywords = (await axios.get(process.env.HOTELFLY_API_HOST + '/keyword')).data
    const suppliers = ['Booking', 'Agoda', 'Expedia', 'Hotels', 'Trip', 'Naver']
    const tasks = generateLink(keywords, suppliers, checkinDate, checkoutDate)
    console.log(tasks)
    await sendMessages(tasks)
}

await main()
