import {sleep} from '../../../utils/util.js'
import { Suppliers} from '../../../constants/suppliers.js'

export const crawl = async (page, crawlInfo) => {
    return crawlHelper(page, crawlInfo)
}

const addListenerForHandlingSpecificAPI = (page, apiPattern, result) => {
    page.on('response', async response => {
        const urls = await response.url()
        if (urls.includes(apiPattern) && response.status() === 200) {
            let res = await response.json()
            result = result.concat(res.hotelFareList)
        }
    })
}

const convertRawData = (rawData, crawlInfo) => {
    const {htlNameKr, salePrice, htlMasterId, addr, htlNameEn} = rawData
    let [urlPartInLink, queryPartInLink] = crawlInfo['url'].split('?')
    urlPartInLink = urlPartInLink
        .replace(
            /[^/]+$/,
            `${htlNameEn.replaceAll(' ', '').toLowerCase()}.html`
        )
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
        link: link,
    }
}

const getDataFromHomepage = async (page, crawlInfo, loggedInState) => {
    const hotels = new Map()
    const getHomePagePrice = async xpath => {
        const list_hotel = await page.locator(xpath).elementHandles()
        for (const info of list_hotel) {
            const hotel = {}
            try {
                const hotel_price = await (
                    await info.$(`//span[contains(@class,'price')]/em`)
                ).innerText()
                const hotel_name = await (
                    await info.$(`//span[contains(@class,'htl-name')]`)
                ).innerText()
                const identifier = await (
                    await info.$(
                        `//div[contains(@class,'box-hotel-detail')]/dl/input[1]`
                    )
                ).getAttribute('value')
                hotel.name = hotel_name
                hotel.price = parseInt(hotel_price.replaceAll(',', ''))
                hotel.identifier = identifier
                hotel.siteId = null
                hotel.supplierId = Suppliers.Priviatravel.id
                hotel.checkinDate = crawlInfo['checkinDate']
                hotel.checkoutDate = crawlInfo['checkoutDate']
                hotels.set(identifier, hotel)
            } catch (e) {
                console.log(e)
            }
        }
    }
    await getHomePagePrice(
        '//div[contains(@class , "s-list-hotel")]/div[2]/ul[1]/li'
    )
    for (let i = 0; i < 120; i += 1) {
        await getHomePagePrice(
            '//div[contains(@class , "s-list-hotel")]/div[2]/ul[2]/div/div/div'
        )
        // console.log(hotels.size)
        if (hotels.size >= 100) {
            break
        }
        if (i !== 0) {
            await page.mouse.wheel(0, 200)
        }
        await sleep(1)
    }
    return Array.from(hotels.values()).slice(0, 100)
}

const getDataFromAPI = async (page, crawlInfo) => {
    let totalDataFromAPI = []
    addListenerForHandlingSpecificAPI(page, 'prices?', totalDataFromAPI)
    await page.goto(crawlInfo['url'], {timeout: 60000})
    await sleep(20)

    const dataFromAPI = totalDataFromAPI.slice(0, 100).map((item) => convertRawData(item, crawlInfo))
    dataFromAPI.forEach((item, index) => {
        item.rank = index + 1;
    })
    return dataFromAPI
}

const crawlHelper = async (page, crawlInfo) => {
    return getDataFromAPI(page, crawlInfo)
}

const loginPrivia = async (page) => {
    for (let i = 0; i < 10; i++) {
        try {
            await loginPriviaHelper(page)
            break
        } catch {
        }
    }
}

async function loginPriviaHelper(page) {
    const name = 'furmi78'
    const password = 'sjymirr0909!'
    await page.goto('https://www.priviatravel.com', {timeout: 60000})
    await sleep(4)
    try {
        await page.locator('//*[@id="img-banner-pop"]/div/div[1]/span/a').click()
    } catch {
    }
    await page.locator('//*[@data-role="page"]/div[1]/div/div[2]/a').click()
    await page.locator('//*[@id="txt_id"]').fill(name)
    await page.locator('//*[@id="txt_pw"]').fill(password)
    await page.locator('//*[@id="btnLogin"]').click()
    await page.waitForNavigation()
    await sleep(4)
}

