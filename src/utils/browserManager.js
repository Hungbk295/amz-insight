import {FingerprintGenerator} from 'fingerprint-generator'
import {FingerprintInjector} from 'fingerprint-injector'
import {firefox} from 'playwright'

export const getBrowser = async (config) => {
    const fingerprintGenerator = new FingerprintGenerator()
    const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint({
        devices: config.devices || ['desktop'],
        browsers: ['chrome', 'firefox'],
    })

    const fingerprintInjector = new FingerprintInjector()
    const {fingerprint} = browserFingerprintWithHeaders
    const options = config.proxy && process.env.ENV === 'prod' ? {
        headless: false,
        proxy: {server: process.env.PROXY_SERVER}
    } : {headless: false}

    const browser = await firefox.launch(options)
    const context = await browser.newContext({
        userAgent: fingerprint.navigator.userAgent,
        locale: 'ko_KR',
        viewport: fingerprint.screen,
    })
    await fingerprintInjector.attachFingerprintToPlaywright(
        context,
        browserFingerprintWithHeaders
    )
    return browser
}

