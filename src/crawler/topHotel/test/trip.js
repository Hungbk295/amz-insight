import { handle } from './handler.js'
import { crawl } from '../suppliers/trip.js'

const crawlInfo = {
	url: 'https://kr.trip.com/hotels/list?city=286&cityName=%ED%95%98%EB%85%B8%EC%9D%B4&provinceId=0&countryId=111&districtId=0&checkin=2023/06/15&checkout=2023/06/16&barCurr=VND&searchType=CT&searchWord=%ED%95%98%EB%85%B8%EC%9D%B4&searchValue=19%7C286_19_286_1&searchCoordinate=BAIDU_-1_-1_0|GAODE_-1_-1_0|GOOGLE_-1_-1_0|NORMAL_21.030735_105.852398_0&crn=1&adult=2&children=0&searchBoxArg=t&travelPurpose=0&ctm_ref=ix_sb_dl&domestic=false&listFilters=17|1*17*1*2,80|2|1*80*2*2,29|1*29*1|2*2&oldLocale=ko-KR&curr=KRW',
	checkinDate: '2023-05-14',
	checkoutDate: '2023-05-15',
	keywordId: 2,
	devices: ['mobile'],
}

console.log(await handle(crawlInfo, crawl))
