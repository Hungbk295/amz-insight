import {FingerprintGenerator} from 'fingerprint-generator'
import {FingerprintInjector} from 'fingerprint-injector'
import {firefox} from 'playwright'
import dotenv from "dotenv";
import {getConfigBySupplierId, internalSupplier} from "../constants/suppliers.js";

dotenv.config({path: '../../.env'})

export const getBrowser = async (supplierId) => {
    const configForSite = getConfigBySupplierId(supplierId)
    const fingerprintGenerator = new FingerprintGenerator()
    const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint({
        devices: configForSite.devices || ['desktop'],
        browsers: ['chrome', 'firefox'],
    })

    const fingerprintInjector = new FingerprintInjector()
    const {fingerprint} = browserFingerprintWithHeaders
    const useProxy = !internalSupplier.includes(supplierId)
    const options = useProxy ? {
        headless: false,
        proxy: {server: process.env.VPN_PROXY_CONNECTION}
    } : {headless: false}

    const browser = await firefox.launch(options)
    const context = await browser.newContext({
        userAgent: fingerprint.userAgent,
        locale: 'ko_KR',
        viewport: fingerprint.screen,
    })
    await fingerprintInjector.attachFingerprintToPlaywright(
        context,
        browserFingerprintWithHeaders
    )
    return browser
}

