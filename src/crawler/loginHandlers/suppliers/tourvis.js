import {sleep} from "../../../utils/util.js";
import {SUPPLIERS} from "../../../config/suppliers.js";
import {Privia} from "./privia.js";

export class Tourvis extends Privia {
    constructor() {
        super();
        this.siteId = SUPPLIERS.Tourvis.id;
        this.siteUrl = SUPPLIERS.Tourvis.link;
    }

    async isLoggedIn(cookies) {
        const keyCookie = 'mobileNo'
        return cookies.find(cookie => cookie['name'] === keyCookie) !== undefined
    }

    async loginByUserPass(page) {
        for (let i = 0; i < 3; i++) {
            await page.goto('https://m.tourvis.com/mobile/login/emailLogin', {timeout: 60000})
            await sleep(5)
            await page.locator('//*[@id="userEmail"]').fill(SUPPLIERS.Tourvis.userName)
            await page.locator('//*[@id="userPwd"]').fill(SUPPLIERS.Tourvis.password)
            await sleep(1)
            await page.locator('//*[@id="btn_submit"]').click()
            await page.waitForNavigation()
            const cookies = await page.context().cookies(this.siteUrl)
            await sleep(5)
            if (await this.isLoggedIn(cookies)) return true;
        }
        throw new Error('Cannot login Tourvis!')
    }
}
