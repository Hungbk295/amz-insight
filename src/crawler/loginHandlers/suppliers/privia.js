import {sleep} from "../../../utils/util.js";
import {Suppliers} from "../../../config/suppliers.js";
import {getCookie, setCookie} from "../cookieManager.js";

const siteId = Suppliers.Priviatravel.id;

async function isLoggedIn(cookies) {
    const keyCookie = 'memberNo'
    return cookies.find(cookie => cookie['name'] === keyCookie) !== undefined
}

async function loginByCookie(page) {
    const cookies = getCookie(siteId)
    if (cookies)
        await page.context().addCookies(cookies)
}

async function loginByUserPass(page) {
    for (let i = 0; i < 3; i++) {
        await page.goto('https://priviatravel.com/common/sso/login/', {timeout: 60000})
        await sleep(5)
        await page.locator('//*[@id="txt_id"]').fill(Suppliers.Priviatravel.userName)
        await page.locator('//*[@id="txt_pw"]').fill(Suppliers.Priviatravel.password)
        await page.locator('//*[@id="btnLogin"]').click()
        await page.waitForNavigation()
        const cookies = await page.context().cookies(Suppliers.Priviatravel.url)
        await sleep(5)
        if (await isLoggedIn(cookies)) return true;
    }
    throw new Error('Cannot login Privia!')
}

export const login = async (page) => {
    await loginByCookie(page)
    const cookies = await page.context().cookies(Suppliers.Priviatravel.url)

    if (await isLoggedIn(cookies) || await loginByUserPass(page)) {
        setCookie(siteId, await page.context().cookies(Suppliers.Priviatravel.url))
    }
}

