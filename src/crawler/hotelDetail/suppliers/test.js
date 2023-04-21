import { getBrowser } from '../../../utils/playwright_browser.js'
import { crawl } from './expedia.js'

export const handle = async (crawlInfo, crawlFunction) => {
	let browser = await getBrowser({ devices: crawlInfo.devices })
	const context = await browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	return await crawlFunction(page, crawlInfo)
}

const crawlInfo = {
	url: 'https://www.expedia.com/Orlando-Hotels-Club-Wyndham-Reunion.h4188525.Hotel-Information?startDate=2023-05-21&endDate=2023-05-24&x_pwa=1&rfrr=HSR&pwa_ts=1682070595769&referrerUrl=aHR0cHM6Ly93d3cuZXhwZWRpYS5jb20vSG90ZWwtU2VhcmNo&useRewards=false&rm1=a2&regionId=178294&destination=Orlando+%28and+vicinity%29%2C+Florida%2C+United+States+of+America&destType=MARKET&neighborhoodId=6126579&selected=4188525&latLong=28.54129%2C-81.37904&badgeType=0&sort=RECOMMENDED&top_dp=598.03&top_cur=USD&userIntent=&origin=New+York%2C+NY%2C+United+States+of+America+%28NYC-All+Airports%29&tripType=ROUND_TRIP&cabinClass=COACH&misId=AgiAhaGU0fCfq10QkoH-0vCE1syjASCjqeVA%7EARIEGgIIAhoxCAESFgoDTllDGLLZ9gIqCjIwMjMtMDUtMjESFQoDTUNPGPbwCioKMjAyMy0wNS0yNA&packageType=fh&selectedRoomType=201631862&selectedRatePlan=208159388&mipt=AQoDVVNEEicKBggCEI77BBIGCAIQjvsEGgYIAhCYsQciBggCENytBCoFCAIQsk0aKwoGCAIQqKsCEgYIAhCoqwIaBQgBEKAGIgYIAhDo7AEqAggCMgYIAhDo7AE',
}

console.log(await handle(crawlInfo, crawl))
