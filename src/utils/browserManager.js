import {FingerprintGenerator} from 'fingerprint-generator'
import {FingerprintInjector} from 'fingerprint-injector'
import {chromium} from 'playwright'
import { INTERNAL_SUPPLIER_IDS } from '../config/suppliers.js'
import { FINGERPRINT_INTERNAL_SYS } from '../config/fingerprint_internal_sys.js'

export const getBrowser = async (config) => {
    if (INTERNAL_SUPPLIER_IDS.includes(config.id)) return getBrowserForInternalSystem();
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
    const context = await browser.newContext({
        locale: 'ko_KR',
        viewport: fingerprint.screen,
    })
    await fingerprintInjector.attachFingerprintToPlaywright(
       context, browserFingerprintWithHeaders
    );
    return browser
}

const getBrowserForInternalSystem = async () => {
    const fingerprintInjector = new FingerprintInjector()
    const {fingerprint} = FINGERPRINT_INTERNAL_SYS
    const options = {headless: false}
    const browser = await chromium.launch(options)
    const context = await browser.newContext({
        locale: 'ko_KR',
        viewport: fingerprint.screen,
    })
    await fingerprintInjector.attachFingerprintToPlaywright(
       context, FINGERPRINT_INTERNAL_SYS
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