import { getBrowser } from '../../../utils/playwright_browser.js'
// import { crawl } from './suppliers/expedia.js'
// import { crawl } from './suppliers/agoda.js'
// import { crawl } from './suppliers/naver.js'
import { crawl } from '../suppliers/booking.js'
// import { crawl } from './suppliers/interpark.js'
// import { crawl } from './suppliers/hotels.js'
// import { crawl } from './suppliers/priviatravel.js'
// import { crawl } from './suppliers/goodchoice.js'

const crawlInfo = {
	// url: 'https://www.agoda.com/seoul-n-hotel-dongdaemun/hotel/seoul-kr.html?finalPriceView=1&isShowMobileAppPrice=false&cid=1898832&numberOfBedrooms=&familyMode=false&adults=2&children=0&rooms=1&maxRooms=0&checkIn=2023-05-5&isCalendarCallout=false&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=1&showReviewSubmissionEntry=false&currencyCode=VND&isFreeOccSearch=false&isCityHaveAsq=false&los=1&searchrequestid=54902709-a0f1-4f7d-bcdf-3c510e6fb1e3',

	// url: 'https://www.expedia.com/Madrid-Hotels-Barcelo-Emperatriz.h54497.Hotel-Information?chkin=2023-05-14&chkout=2023-05-16&x_pwa=1&rfrr=HSR&pwa_ts=1682435190947&referrerUrl=aHR0cHM6Ly93d3cuZXhwZWRpYS5jb20vSG90ZWwtU2VhcmNo&useRewards=false&rm1=a2&regionId=178281&destination=Madrid+%28and+vicinity%29%2C+Community+of+Madrid%2C+Spain&destType=MARKET&neighborhoodId=6282810&latLong=40.417007%2C-3.703565&sort=RECOMMENDED&top_dp=185&top_cur=USD&userIntent=&selectedRoomType=315888174&selectedRatePlan=384943828',
	url: 'https://www.booking.com/hotel/kr/the-stay-classic-myeongdong.ko.html?aid=304142&label=gen173nr-1FCAEoggI46AdIM1gEaPQBiAEBmAEXuAEZyAEM2AEB6AEB-AEMiAIBqAIDuALp25-iBsACAdICJDZhN2RiM2MxLWI0YzQtNDNhYy04ZjQwLWJiNmMyNDQ0NDZhY9gCBuACAQ&sid=c2e28b9d7c4c5baf4234e2642357367e&all_sr_blocks=962894004_372224286_0_0_0;checkin=2023-04-28;checkout=2023-04-29;dest_id=-716583;dest_type=city;dist=0;group_adults=2;group_children=0;hapos=1;highlighted_blocks=962894004_372224286_0_0_0;hpos=1;matching_block_id=962894004_372224286_0_0_0;no_rooms=1;req_adults=2;req_children=0;room1=A%2CA;sb_price_type=total;sr_order=popularity;sr_pri_blocks=962894004_372224286_0_0_0__20475000;srepoch=1682435580;srpvid=fcdc6afd0e750246;type=total;ucfs=1&#hotelTmpl',

	// url: 'https://travel.interpark.com/checkinnow/goods/GN0002152622?startdate=20230429&enddate=20230430&roomOptions=0%5E2%5E0%5E&npprmaxsort=min',

	// url: 'https://vi.hotels.com/en/ho1770415072/mondrian-seoul-itaewon-seoul-south-korea/?chkin=2023-05-26&chkout=2023-05-27&x_pwa=1&rfrr=HSR&pwa_ts=1682437275981&referrerUrl=aHR0cHM6Ly92aS5ob3RlbHMuY29tL0hvdGVsLVNlYXJjaA%3D%3D&useRewards=false&rm1=a2&regionId=3124&destination=Seoul%2C+South+Korea&destType=MARKET&neighborhoodId=553248635976381100&latLong=37.566535%2C126.977969&trackingData=AAAAAQAAAAEAAAAQItyqRNuqO8IRzCTl4qTdQwetXZTSgHTGoLIuWa9t-oWL51Ws-SDJo3yp6MKbpYU2CU9kHbPnSAuJ40k6vlkH3Ie49XmvUjjhtNOKLlw8F0gYSI2QMiQsZV1tis6QA5Q4-48egWA8pZ0PNZYNGf4uSoj5z1MZ2BWJSKLl15jYbsMDhxkTFPj801RaSM8p5AtFwOeJuto4Di48HEVaG2BKjfZ04k1j0Z1UMnU5g53dI9RoaAv3GxBqX1_NnGlahWzit5nLU2fvVuDyd3_-wzGFjwtOJbAPvc8Lz6M_vHqJJ8iPtU0g4JeIyi1et4IZ_joU0FpmSabMqnELUu2D12sHWMzLnLBkgyNFClESoJzX5aZNtEZm0eKliL2DVvfpNfOkUZwfZU99CYSmiF9Nl6fuCkGe8wdYXDRx0oCrWRXuSCrZF3R8HZD5hYETzfS5kA-UcW8RXISHJH2Z7z5Bhlqh_4_7uX7UNIV92FcVnP6rFpTqxq5yThhnk-jUVdwQsrS8NegyT5xTdhVZ4YFg3tTyyqkVGK-ahA5QDJdmeOCJi_467uctOdEp_ffzz3AVOeT78__Cr5-FaBfqwOpLG0gd0KuI1pTTrfwxU5-V7JsN869qA-05WFrnqp53GDeZw46pjEqsx8WySHYAe5M3XfWM_Vrw0DSa6u4trfxWco2u8wyp1M3uYMDvr4JtK9cZ71yWE706dcxpYKf6FL1NeBzyrKKrW7YCYss_Nnc9MJjNnih1vtRROvlHZhHbdJjeT0hptbVo8Uvo8ufze-7bex52aUS_2vRnB6TkH98C42MgOotI-ju7SM6n84jGK2huJQN-rasWFcpJJXjxkE6vzzbnrnJeDbI3Na4610gnRUh8QJD7EY2v_Yw1WpBjn7IDRPuwWDDKE8mFcjMO7ZnZ_PEcZ1dDTuv2kva8a_-k6c0ui-CE0zox3mVKl5bQba00rCzlQwBwj2iBIR_TDjGv2LkNBiMq0aV1wlCquU8TUSougQAuwO8WfP3pRCyc0Fm79sGNvyPMZPe2_sd-ts7qAmWt-ywqk2GLTFA-tndEBiFiOI8_ABdkSfhUXKYMbk3jeUFvHvFe1uOxu5wu5uF4SGWfJG4agb-qJVpkd5jJ4B0LI73ueB_3h-fXmj2Q-DSrVERIni5K_OhLD98Qh7K7m8vdRIJnGX1UNteocaLbxpiFrS7Aymp1-kK_Nodi3mCPlprGGkxlYITBC3O2WFAChxOx91nYw42zRWpei7LLcxbtNE09-Eb4Awb2ld71twyMYpfouKGEATvVr_Rzde8lX9xCt3GBPWb65kBh6ko6gFek0VoeDyAcSGvN7A-07oLhml_ieZ7ytklCBUeXTR4vnag8uq6tnCI2kBvXjLvHsB8s0KZ5wU1a2wsrzva9petA-hNW_HXO6TvqH8L5-7iZyV2ycw8zUKn-1Vwv3VW3U9gaMAgC6Dm1LrvSeMnuZ9eFHfSIq5ceKM48rK5tq_4vuhvR_4vGInQVTfN-GyBflOB7p73IWOH7mXqRtImaSnGqNvUQcS8WmDc4a66yAdgWhIBS1VpoGaiC0PNGJsfokfsdvLn8kQ2vdOm0OJgfflqq7S11o8rIazCq5CcAenPgz_HY6WjHZ_czMwtUMJCW3wGBBZ0T6_s70-lFRhxNM4_Ey45EcsVSrXsjuldgL1ZHGyaOfYoOEPuP_TGvpfMlSaIT4eJqyxP9bik47h139_w7kFCFY0y5LXKr-KHpblxCUyfw7Ej4zGeCwRg0FE9LC54G3o8MEhtwCxvRA4BnOJ4zMZwfKuOVPukeI5OFQ_RcZAp_dbS6TAsaGocE6apBAXEwZChJd7q8EzCYZIOMGQqgqQlb7I3YJaJBHuQ_8GWcJ7FIENZllVZMY0olHu3KrrCoO47ZfJ0fHQ_UKygm7ZcwIlT3z69TBDmhqlgsQzUFGBKagb35PkfN1WE0ubl8q7lkLHxp4Ah_gRoUuixVtkp_n13LDM8Ohj_s1l7dKbGcWXKDfhz_E4eCvl2HHQoeDO86Ef8lNKtC4vaNQ0Ej4QBzhlCZCVE-OQGf7Ua5zHQPfgsm6wLtR-Bdqxfs2o05T79qvpdhzZbbf029KfBYxFKFp5_7Q1DJmqSkR9hrSTCWeyEsRqW5WfbwOkazio4lnTeNpyRHEZrBqV-2Xjk5-_SaOVdGQLbDrA1Eb-DZ_Zc9cYDF5JN-ylK1Ls8ShhEiLk7pNElpZsDE-abxwtMUZQ0KnEbYItrYtsHdBNnNqu03wpPPU-FxJ2aK13NbDB6HfxeSSi7mTOLh4xnyq014g48mA8vsgTrIBDl2ARbGvPJgMOVoFg8_SBgyJMWNhQRIJhvUH0QrsX19H-6f1fPJriocLB08A_LA279DS3B-yHwG_V1y1BMAnWfYA1yDvViTn2FSJ-rnRLdWjP14vQYo5xDs2CU5mjg_VsUNhEipes1reTqJtiRfGSnu3CQUBOqI7xdvyza5fOIO8cNVix6TXB4F05a0hGHqG4ym6JKtRNxyMNjv6RTBZHtqg4aLmfeSVKzE5plxXrKadt1mmJGyA9pyCUBmJRDO_53fRHV-E7PQmDl1V5y4yDxi-iZdG4KI3JBhgUHt4pKZ7qISMrCIgV3DvOTU&rank=1&testVersionOverride=Buttercup%2C45803.0.0%2C44204.0.0%2C44203.0.0%2C43549.0.0%2C43550.0.0%2C31936.102311.0%2C33775.98848.1%2C38414.114301.0%2C39483.0.0%2C38427.115718.0%2C42444.0.0%2C42589.0.0%2C42876.124673.0%2C42973.0.0%2C42974.0.0%2C42975.0.0%2C42976.0.0%2C42802.125960.1%2C33739.99567.0%2C37898.109354.1%2C37930.0.0%2C37949.0.0%2C37354.0.0%2C43435.128144.0%2C44700.0.0%2C44704.134887.1&slots=&position=1&beaconIssued=&sort=RECOMMENDED&top_dp=3959476&top_cur=VND&userIntent=&selectedRoomType=231955804&selectedRatePlan=286392983&expediaPropertyId=55294221',

	// url: 'https://place-site.yanolja.com/places/3001248',

	// url: 'https://www.goodchoice.kr/product/detail?ano=70163&adcno=2&sel_date=2023-04-25&sel_date2=2023-04-26',

	// url: 'https://hotel.priviatravel.com/view/kr/korea/seoul/theshillaseoul.html?hotelInFlowPath=B37&checkIn=2023-04-27&checkOut=2023-04-28&occupancies=1~1~0&htlMasterId=55143&salePrice=1085526&h=1',
}

export const handle = async (crawlInfo, crawlFunction) => {
	let browser = await getBrowser({ devices: crawlInfo.devices })
	const context = browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	return await crawlFunction(page, crawlInfo)
}

console.log(await handle(crawlInfo, crawl))
