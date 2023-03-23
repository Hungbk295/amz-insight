import { getRandom, sleep } from '../../utils/util.js'
import { crawlerList, classify } from '../crawler.js'
import { getBrowser } from '../../utils/playwright_browser.js'
import { execSync } from 'child_process'
import { SERVERS } from '../config/expressvpn.js'

const crawl = async (page, crawlInfo) => {
	return crawlerList[classify(crawlInfo['url'])](page, crawlInfo)
}

const tasks = [
	{
		id: '74669',
		target_date: '2023-03-25',
		next_date: '2023-03-26',
		url: 'https://us.trip.com/hotels/detail/?cityId=633&hotelId=1774543&checkIn=2023-04-07&checkOut=2023-04-08&adult=2&children=0&subStamp=517&crn=1&ages=&travelpurpose=0&curr=KRW&link=title&hoteluniquekey=H4sIAAAAAAAAAON6y8jFJMEkxMTBKPWIkeP9gcXfWIS4DE0tTM2MDS0NjAxesls8iHX8phHTf-jWfAdPTSD91W2RQwBPIQMIOGQ6TGK04XwTuEOu1bncQRAs-KHEQUlegUUTpsIQxrB4xhnEwvFpBVMUgxM7x_Un78QkWGYwnl-es4KRcSNjoS3X9cVnihx2MDIdYPwPA4wnGJv2iS9gert2rsAuJhaOpYtkDwGpjbuZTzExXGJiuMXE8IgJbOgrJoZPTAy_IGqamBm6mBkmMYNVzmIGK1jEzCDFa5qSaGqZmmKeZJmUbKkgpHFw9YcFbEbSkxiZQoNPMQobmpkDvW1iaGJmaGGhV2BRWmxgxSzF6ObBGMTmZGFsbuoSpcXFHBrsIsiQ38hy1F_aQYrZOyhccWH65lfFW0vttUByhjC5JNbUPN3Q4IypPAWMXYwcAowejBGMFYyvGEF6foB8DgCfiJI6gQEAAA&subChannel=&masterhotelid_tracelogid=5da59ed7b9bc9&barcurr=KRW',
	},
	{
		id: '74669',
		target_date: '2023-03-25',
		next_date: '2023-03-26',
		url: 'https://vn.trip.com/hotels/w/detail?hotelid=35913091&display=0&highlight=1122112441&curr=KRW&locale=vi-VN&checkin=2023-04-07&checkout=2023-04-08&hoteluniquekey=H4sIAAAAAAAAAON6xszFK8Fo8B8GGIWYOBilLjBz7FzeMZ1FiMvQ1MDQwNDI0MDIYB63xfVSR_nW14E7MtodPBlA4ECnQwBPIZjZEOUwidGaE8wW6HUQBDNutDsoySuwaMJUGMIYFs84g1g4Zs5hjGJwYuO425MtwTSDsfl3v-BGRq7riwtsdwU57GBkOsG48ALHAqaO_wfVdjGxcHy4xXWIiZljW94pJoZLTAy3mBgeMYENecXE8ImJ4RdESRMzQxczwyRmkMJZzGD5RcwMp1hA_EssmdHVStmplUpWJjpKJZklOalKVkohGaUPd-1XcA9xD1HSUUrMzS_NKwEKG5oYGpvoGRgAxUoSKzxTwHqSE3OSS3MSS1JDKguAes10lDKLnUuKMguCUnMzS0pSgarSEnOKU2tjbwFtvGfziCUXZqMpwsaAjMNrFVIe7u5OzlAoe7h7KbK15ubmqLaak2LrJxaGXyxgTzexMnSxMkxiZeHY-ptTiBUcoVIKRmZJyeYp5oYpZuZpJkmJhhZphsbmpkkW5qmGpiaJKZYKfBrds98vYDNi7WJkCvOzYpZidPNgDGIzMjawdHGM0uJidvaLhEQuwwd7KWbvoHDFhembXxVvLbXXYg7zczH8xiFiepDV2D6JtSxTN8wvYypPAWMXI4cAowdjBGMF4ypGhg2MjCcYGS8xcjg7-gY4err7PWLk9fAPcfWJd3f08XENinzFCDIXAHNh4EWdAgAA',
	},
]
const main = async () => {
	let browser = await getBrowser()
	const context = browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()

	for (const crawlInfo of tasks) {
		let data = []
		try {
			let crawlResult = await crawl(page, crawlInfo)
			console.log(crawlResult)
		} catch (e) {
			console.log("Can't crawl", crawlInfo)
			console.log(e)
			await sleep(10)
			await browser.close()
			const stdout = execSync(
				`expressvpn disconnect && expressvpn connect ${getRandom(SERVERS)}`
			)
			console.log(stdout)
			await sleep(5)
			browser = await getBrowser()
			await sleep(5)
		}
	}
	await browser.close()
	console.log('Finish crawling')
}
main()
