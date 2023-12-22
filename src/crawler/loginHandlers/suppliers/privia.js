import {sleep} from "../../../utils/util.js";
import {SUPPLIERS} from "../../../config/suppliers.js";
import {getCookie, setCookie} from "../cookieManager.js";

export class Privia {
    constructor() {
        this.siteId = SUPPLIERS.Privia.id;
        this.siteUrl = SUPPLIERS.Privia.link;
    }

    async isLoggedIn(cookies) {
        const keyCookie = 'memberNo'
        return cookies.find(cookie => cookie['name'] === keyCookie) !== undefined
    }

    async loginByCookie(page) {
        const cookies = getCookie(this.siteId)
        if (cookies)
            await page.context().addCookies(cookies)
    }

    async loginByUserPass(page) {
        for (let i = 0; i < 3; i++) {
            await page.goto('https://priviatravel.com/common/sso/login/', {timeout: 60000})
            await sleep(5)
            await page.locator('//*[@id="txt_id"]').fill(SUPPLIERS.Privia.userName)
            await page.locator('//*[@id="txt_pw"]').fill(SUPPLIERS.Privia.password)
            await page.locator('//*[@id="btnLogin"]').click()
            await page.waitForNavigation()
            const cookies = await page.context().cookies(this.siteUrl)
            await sleep(5)
            if (await this.isLoggedIn(cookies)) return true;
        }
        throw new Error('Cannot login Privia!')
    }

    async login (page) {
        await this.loginByCookie(page)
        const cookies = await page.context().cookies(this.siteUrl)

        if (await this.isLoggedIn(cookies) || await this.loginByUserPass(page)) {
            setCookie(this.siteId, await page.context().cookies(this.siteUrl))
        }
    }
}
