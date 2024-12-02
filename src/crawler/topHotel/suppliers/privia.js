import { SUPPLIERS } from '../../../config/suppliers.js'
import { sleep } from '../../../utils/util.js'
import {createSqsMessages} from "../../../utils/awsSdk.js";
import {MAX_RANK_WITH_DETAIL_PRICE} from "../../../config/app.js";
import {Privia as PriviaGenerator} from '../../../linkGenerator/suppliers/index.js'
import moment from 'moment';
export class Privia {
    constructor() {
        this.detailTasksGenerator = new PriviaGenerator()
    }

    async crawl(page, task) {
        let totalDataFromAPI = []
        page.on('response', async response => {
            const urls = await response.url()
            if (urls.includes('price?') && response.status() === 200) {
                let res = await response.json()
                totalDataFromAPI = totalDataFromAPI.concat(res['hotelFareList'])
            }
        })
        await page.goto(SUPPLIERS.Privia.link + task['link'], {timeout: 60000})
        await sleep(20)
        const dataFromAPI = totalDataFromAPI.slice(0, 100).map((item) => this.convertRawCrawlData(item, task))
        dataFromAPI.forEach((item, index) => {
            item.rank = index + 1;
        })
        return dataFromAPI
    }

    async generateHotelDetailTasks(data, keyword) {
        const hotelDetailTasks = data.slice(0, MAX_RANK_WITH_DETAIL_PRICE).map(hotelData => {
            return this.detailTasksGenerator.generateHotelDetailTask(hotelData['checkIn'], hotelData['checkOut'],
                keyword, hotelData['createdAt'], {
                    name: hotelData['name'],
                    nameEn: hotelData['nameEn'],
                    address: hotelData['address'],
                    supplierId: hotelData['supplierId'],
                    identifier: hotelData['identifier'],
                    tag: hotelData['tag'],
                    link: hotelData['link']
                })
        })
        await createSqsMessages(process.env.QUEUE_TASKS_DETAIL_URL, hotelDetailTasks)
    }

    convertRawCrawlData(rawData, task) {
        const {htlNameKr, salePrice, htlMasterId, addr, htlNameEn} = rawData
        let [urlPartInLink, queryPartInLink] = task['link'].split('?')
        urlPartInLink = urlPartInLink
            .replace(
                '.html',
                `/${htlNameEn.replaceAll(' ', '').toLowerCase()}.html`
            )
            .replace('search/', 'view/')
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
            checkIn: task['checkIn'],
            checkOut: task['checkOut'],
            keywordId: task["keywordId"],
            createdAt: task["createdAt"],
            link: link.split('?')[0],
        }
    }
}