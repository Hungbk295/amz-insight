import { FingerprintGenerator } from 'fingerprint-generator'
import { FingerprintInjector } from 'fingerprint-injector'
import { chromium } from 'playwright'

export const getBrowser = async () => {
	const fingerprintGenerator = new FingerprintGenerator()
	const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint({
		devices: [
			'desktop',

			// 'mobile'
		],
		browsers: ['chrome', 'firefox'],
	})

	const fingerprintInjector = new FingerprintInjector()
	const { fingerprint } = browserFingerprintWithHeaders

	const browser = await chromium.launch({ headless: false })
	const context = await browser.newContext({
		// userAgent: fingerprint.userAgent,
		// locale: 'ko_KR',
		viewport: fingerprint.screen,
	})
	await fingerprintInjector.attachFingerprintToPlaywright(
		context,
		browserFingerprintWithHeaders
	)
	return browser
}
