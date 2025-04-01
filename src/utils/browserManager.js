import {FingerprintGenerator} from 'fingerprint-generator'
import {FingerprintInjector} from 'fingerprint-injector'
import {chromium} from 'playwright'
import { INTERNAL_SUPPLIER_IDS } from '../config/suppliers.js'
import { FINGERPRINT_INTERNAL_SYS } from '../config/fingerprint_internal_sys.js'
import os from 'os';
import path from 'path';


export const getContext = async (config) => {
    if (INTERNAL_SUPPLIER_IDS.includes(config.id)) return getContextForInternalSystem();
    const fingerprintGenerator = new FingerprintGenerator()
    const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint({
        devices: config?.devices || ['desktop'],
        browsers: ['chrome', 'firefox'],
    })
    const fingerprintInjector = new FingerprintInjector()
    const {fingerprint} = browserFingerprintWithHeaders
    const options = config?.proxy && process.env.ENV === 'prod' ? {
        headless: true,
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
    await context.newPage()
    return browser
}

const getContextForInternalSystem = async () => {
    const nameProfile = process.env.WORKER_NAME
    const pathProfile = path.join(os.homedir(), `hn_worker/profile/${nameProfile}`);
    const fingerprintInjector = new FingerprintInjector()
    const options = {headless: false}
    const context = await chromium.launchPersistentContext(pathProfile,options)
    await fingerprintInjector.attachFingerprintToPlaywright(
       context, FINGERPRINT_INTERNAL_SYS
    );
    return context
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