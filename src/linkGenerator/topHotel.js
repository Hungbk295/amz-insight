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

function generateLink(keywords, suppliers, checkinDate, checkoutDate){
    let tasks = []
    for (const item of keywords){
        const keyword = item.keyword
        const encodedKeyword = encodeURIComponent(keyword)
        for (const supplier of suppliers){
            let task = {}
            switch (supplier) {
                case Suppliers.Booking.name:
                    task.url = Suppliers.Booking.url + `searchresults.ko.html?ss=${encodedKeyword}&dest_type=city&checkin=${checkinDate}&checkout=${checkoutDate}&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure&selected_currency=KRW`
                    break
                case Suppliers.Agoda.name:
                    const agodaCityId = getAgodaCityId(keyword)
                    task.url = Suppliers.Agoda.url + `search?city=${agodaCityId}&isdym=true&searchterm=${keyword}&locale=ko-kr&currency=KRW&pageTypeId=1&realLanguageId=9&languageId=9&origin=KR&cid=-1&whitelabelid=1&loginLvl=0&storefrontId=3&currencyId=26&currencyCode=KRW&htmlLanguage=ko-kr&cultureInfoName=ko-kr&trafficSubGroupId=4&aid=130243&cttp=4&isRealUser=true&mode=production&browserFamily=Chrome&checkIn=2023-04-01&checkOut=2023-04-02&rooms=1&adults=1&children=0&priceCur=KRW&los=1&textToSearch=Hanoi&travellerType=0&familyMode=off`
                    break
                case Suppliers.Expedia.name:
                    task.url = Suppliers.Expedia.url + `Hotel-Search?adults=2&d1=${checkinDate}&d2=${checkoutDate}&destination=${encodedKeyword}`
                    // task.checkinDate = checkinDate
                    // task.checkoutDate = checkoutDate
                    // tasks.push(task)
                    break
                case Suppliers.Hotels.name:
                    task.url = Suppliers.Hotels.url + `Hotel-Search?adults=2&d1=${checkinDate}&d2=${checkoutDate}&destination=${encodedKeyword}&locale=en_US`
                    break
                case Suppliers.Naver.name:
                    const placeName = getNaverCityName(keyword)
                    task.url = Suppliers.Naver.url + `list?placeFileName=place%3A${placeName}&adultCnt=2&checkIn=${checkinDate}&checkOut=${checkoutDate}&includeTax=false&sortField=popularityKR&sortDirection=descending`
                    break
                case Suppliers.Trip.name:
                    const checkin = checkinDate.replaceAll('-', '/')
                    const checkout = checkoutDate.replaceAll('-', '/')
                    const tripCityId = getTripCityId(keyword)
                    task.url = Suppliers.Trip.url + `hotels/list?city=${tripCityId}&cityName=${encodedKeyword}&checkin=${checkin}&checkout=${checkout}&barCurr=KRW&adult=2&children=0&curr=KRW`
                    break
            }
            task.checkinDate = checkinDate
            task.checkoutDate = checkoutDate
            task.keywordId = item.id
            tasks.push(task)
        }
    }
    return tasks
}

async function main() {
    const [checkinDate, checkoutDate] = ['2023-04-13', '2023-04-20']
    const keywords = (await axios.get(process.env.HOTELFLY_API_HOST + '/keyword')).data
    const suppliers = ['Booking', 'Agoda', 'Expedia', 'Hotels', 'Naver', 'Trip']
    const tasks = generateLink(keywords, suppliers, checkinDate, checkoutDate)
    console.log(tasks)
    await sendMessages(tasks)
}

await main()
