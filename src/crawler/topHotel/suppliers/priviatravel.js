import {Suppliers} from '../../../constants/suppliers.js'
import dotenv from 'dotenv'
import {sleep} from "../../../utils/util.js";
import {createSqsMessages} from "../../../utils/awsSdk.js";

dotenv.config({path: '../../../../.env'})

export const crawl = async (page, crawlInfo) => {
    return crawlHelper(page, crawlInfo)
}

const convertRawCrawlData = (rawData, crawlInfo) => {
    const {htlNameKr, salePrice, htlMasterId, addr, htlNameEn} = rawData
    let [urlPartInLink, queryPartInLink] = crawlInfo['url'].split('?')
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
        supplierId: Suppliers.Priviatravel.id,
        identifier: htlMasterId + '',
        tag: htlNameEn,
        checkinDate: crawlInfo['checkinDate'],
        checkoutDate: crawlInfo['checkoutDate'],
        keywordId: crawlInfo["keywordId"],
        createdAt: crawlInfo["createdAt"],
        link: link,
    }
}

const createHotelDetailTasks = (crawlResult) => {
    return crawlResult.map((data) => {
        return {
            name: data.name,
            nameEn: data.nameEn,
            address: data.address,
            supplierId: data.supplierId,
            identifier: data.identifier,
            tag: data.tag,
            checkinDate: data.checkinDate,
            checkoutDate: data.checkoutDate,
            createdAt: data.createdAt,
            link: Suppliers.Priviatravel.url + data.link,
            rank: data.rank,
            keywordId: data.keywordId
        }
    })
}

const getDataFromAPI = async (page, crawlInfo) => {
    let totalDataFromAPI = []
    page.on('response', async response => {
        const urls = await response.url()
        if (urls.includes('price?') && response.status() === 200) {
            let res = await response.json()
            totalDataFromAPI = totalDataFromAPI.concat(res.hotelFareList)
        }
    })
    await page.goto(crawlInfo['url'], {timeout: 60000})
    await sleep(20)
    const dataFromAPI = totalDataFromAPI.slice(0, 100).map((item) => convertRawCrawlData(item, crawlInfo))
    dataFromAPI.forEach((item, index) => {
        item.rank = index + 1;
    })
    const hotelDetailTasks = createHotelDetailTasks(dataFromAPI.slice(0, 30))
    await createSqsMessages(process.env.AWS_SQS_HOTELFLY_HOTEL_DETAILS_LINK_URL, hotelDetailTasks)
    return dataFromAPI
}

const crawlHelper = async (page, crawlInfo) => {
    return getDataFromAPI(page, crawlInfo)
}

