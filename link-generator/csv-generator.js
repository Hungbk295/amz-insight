import fs from "fs";
import {FingerprintGenerator} from "fingerprint-generator";
import {FingerprintInjector} from "fingerprint-injector";
import {chromium} from "playwright";
import {sleep} from "../crawler/utils/util.js";

export async function initial() {
    const fingerprintGenerator = new FingerprintGenerator();
    const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint({
        devices: ['desktop', 'mobile'],
        browsers: ['chrome', 'firefox'],
    });

    const fingerprintInjector = new FingerprintInjector();
    const { fingerprint } = browserFingerprintWithHeaders;

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: fingerprint.userAgent,
        locale: "ko_KR",
        viewport: fingerprint.screen,
    });
    await fingerprintInjector.attachFingerprintToPlaywright(context, browserFingerprintWithHeaders);
    const page = await context.newPage();
    return { page, browser }
}

async function searchAgoda(hotelName) {
    let {page, browser} = await initial()
    try {
        await page.goto("https://www.agoda.co.kr/", { timeout: 60000})
        await page.click(`//*[@id="footer"]/button/div/div/span`)
        await page.locator(`//*[@id="textInput"]`).fill(hotelName)
        await sleep(15)

        await page.click(`.ab-close-button`)
        await page.click(`//li[contains(@data-element-name,"search-box-sub-suggestion")]`)
        await page.click(`//button[contains(@data-element-name,"search-button")]`)
        await sleep(10)

        await page.click(`//li[contains(@data-selenium,"hotel-item")]`)
        await sleep(5)
        const context = browser.contexts()[0];
        const newPage = context.pages()[1];
        let url = newPage.url()
        let index = url.indexOf("html") + 4
        return url.substring(0, index)
    } finally {
        await browser.close()
    }
}

async function searchExpedia(hotelName) {
    let {page, browser} = await initial()
    try {
        await page.goto("https://www.expedia.co.kr/", { timeout: 60000})
        await sleep(5)
        await page.click(`//div[contains(@data-stid,"location-field-destination")]`)
        await sleep(5)
        await page.locator(`#location-field-destination`).fill(hotelName)
        await sleep(5)
        await page.click(`//li[contains(@data-stid,"location-field-destination-result-item")]`)
        await page.click(`//button[contains(@data-testid,"submit-button")]`)
        await sleep(20)
        await page.click(`//a[contains(@data-stid,"open-hotel-information")]`)
        await sleep(10)
        const context = browser.contexts()[0];
        const newPage = context.pages()[1];
        let url = newPage.url()
        let index = url.indexOf(".Hotel-Information")
        return url.substring(0, index)
    } finally {
        await browser.close()
    }

}

let generateCsvFile = async function(){
    let hotelNameFilePath = "hotel-name.txt"
    let resultFilePath = "expedia-links.csv"
    let data = fs.readFileSync(hotelNameFilePath, {encoding:'utf8', flag:'r'})
    data = data.replace(/(\r\n|\n|\r)/gm, "\n")
    const lines = data.split("\n")
    for (const line of lines) {
        let hotelId = line.split(",")[0]
        let hotelName = line.split(",")[1]
        let link
        try {
            link = await searchExpedia(hotelName)
            fs.appendFileSync(resultFilePath, hotelId + "," + hotelName + ",")
            fs.appendFileSync(resultFilePath, link + "\n")
        } catch (e) {
            console.log(e)
            console.log(hotelName)
            fs.appendFileSync(resultFilePath, hotelId + "," + hotelName + "\n")
        }
    }
}

// await searchAgoda("JW Marriott")
// await searchExpedia(page, browser, "JW Marriott")

await generateCsvFile()