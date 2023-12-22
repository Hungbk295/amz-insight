import {SUPPLIERS} from '../../../config/suppliers.js'
import {sleep} from "../../../utils/util.js";
import {createSqsMessages} from "../../../utils/awsSdk.js";
import {MAX_RANK_WITH_DETAIL_PRICE} from "../../../config/app.js";

export class Privia {
    async crawl (page, crawlInfo) {
        let totalDataFromAPI = []
        page.on('response', async response => {
            const urls = await response.url()
            if (urls.includes('price?') && response.status() === 200) {
                let res = await response.json()
                totalDataFromAPI = totalDataFromAPI.concat(res.hotelFareList)
            }
        })
        await page.goto(crawlInfo['link'], {timeout: 60000})
        await sleep(20)
        const dataFromAPI = totalDataFromAPI.slice(0, 100).map((item) => this.convertRawCrawlData(item, crawlInfo))
        dataFromAPI.forEach((item, index) => {
            item.rank = index + 1;
        })
        return dataFromAPI
    }

    async generateDetailTasks(data) {
        const hotelDetailTasks = data.slice(0, MAX_RANK_WITH_DETAIL_PRICE)
        await createSqsMessages(process.env.QUEUE_DETAIL_TASKS_URL, hotelDetailTasks)
    }

    convertRawCrawlData (rawData, crawlInfo) {
        const {htlNameKr, salePrice, htlMasterId, addr, htlNameEn} = rawData
        let [urlPartInLink, queryPartInLink] = crawlInfo['link'].split('?')
        urlPartInLink = urlPartInLink
            .replace(
                '.html',
                `/${htlNameEn.replaceAll(' ', '').toLowerCase()}.html`
            )
            .replace('search/', 'view/')
            .split('.com/')[1]
        queryPartInLink = queryPartInLink.replace(
            /destinationType(.*)/g,
            `htlMasterId=${htlMasterId}`
        )
        const link = urlPartInLink + '?' + queryPartInLink
        return {
            name: htlNameKr,
            nameEn: htlNameEn,
            address: addr,
            price: salePrice,
            siteId: null,
            supplierId: SUPPLIERS.Privia.id,
            identifier: htlMasterId + '',
            tag: htlNameEn,
            checkinDate: crawlInfo['checkinDate'],
            checkoutDate: crawlInfo['checkoutDate'],
            keywordId: crawlInfo["keywordId"],
            createdAt: crawlInfo["createdAt"],
            link: link,
        }
    }
}