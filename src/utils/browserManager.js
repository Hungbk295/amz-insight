import {FingerprintGenerator} from 'fingerprint-generator'
import {FingerprintInjector} from 'fingerprint-injector'
import {chromium} from 'playwright'
import { SUPPLIERS } from '../config/suppliers.js'

export const getBrowser = async (config) => {
    const fingerprintGenerator = new FingerprintGenerator()
    const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint({
        devices: config?.devices || ['desktop'],
        browsers: ['chrome', 'firefox'],
    })
    const fingerprintInjector = new FingerprintInjector()
    const {fingerprint} = browserFingerprintWithHeaders
    const options = config?.proxy && process.env.ENV === 'prod' ? {
        headless: false,
        proxy: {server: process.env.PROXY_SERVER}
    } : {headless: false}

    const browser = await chromium.launch(options)
    const userAgent = [SUPPLIERS.Privia.id,SUPPLIERS.Tourvis.id].includes(config.id) ? 'hn_worker' : fingerprint.navigator.userAgent
    const context = await browser.newContext({
        userAgent: userAgent,
        locale: 'ko_KR',
        viewport: fingerprint.screen,
    })
    await fingerprintInjector.attachFingerprintToPlaywright(
       context,
       {
           ...browserFingerprintWithHeaders,
           headers: {
               ...browserFingerprintWithHeaders.headers,
               'user-agent': userAgent
           }
       }
    );
    return browser
}

export const disableLoadImage = async (page) => {
    await page.route('**/*', (route) => {
        return route.request().resourceType() === 'image'
            ? route.fulfill({
                status: 200,
                path: 'resource/mockImage.png',
            })
            : route.continue()
    });
}