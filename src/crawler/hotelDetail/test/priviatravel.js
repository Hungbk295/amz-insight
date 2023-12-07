import {getBrowser} from '../../../utils/playwright_browser.js'
import {crawl} from '../suppliers/priviatravel.js'

const crawlInfo = {
    link: 'https://hotel.priviatravel.com/view/us/unitedstates/hawaii-ohau-honolulu/hyattregencywaikikibeachresortspa.html?hotelInFlowPath=B33&checkIn=2023-12-25&checkOut=2023-12-26&occupancies=1~1~0&htlMasterId=103690&salePrice=716741&h=3',
    checkinDate: '2023-07-30',
    checkoutDate: '2023-07-31',
    keywordId: 2,
}

export const handle = async (crawlInfo, crawlFunction) => {
    let browser = await getBrowser({devices: crawlInfo.devices}, false)
    const context = browser.contexts()[0]
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage()
    return await crawlFunction(page, crawlInfo)
}
console.log(await handle(crawlInfo, crawl))
