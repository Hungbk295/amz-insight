import { getContext } from '../utils/browserManager.js'
import { getConfigBySupplierId } from '../config/suppliers.js'
import { SUPPLIERS } from '../config/suppliers.js'
import { sleep } from '../utils/util.js'
import { scroll } from '../utils/util.js'

const listClickItems = [
	'Item details',
	'Design',
	'Additional details',
	'Connectivity',
	'Power',
	'Measurements',
	'Battery',
]

export const search = async (req, res) => {
	try {
		const { keyword } = req.query

		if (!keyword) {
			return res.status(400).json({ error: 'Keyword is required' })
		}

		// Get browser context with Amazon config
		const config = getConfigBySupplierId(SUPPLIERS.Amazon.id)
		const browser = await getContext(config)
		const page = await browser.pages()[0]

		// Navigate to Amazon
		await page.goto(config.baseUrl)

		// Login to Amazon
		// await page.click('#nav-link-accountList')
		// await page.fill('#ap_email_login', 'viethungbk295@gmail.com')
		// await page.click('#continue')
		// await page.fill('#ap_password', 'Jaychun@1994')
		// await page.click('#signInSubmit')
		// await page.click('#signInSubmit')

		// // Wait for login to complete
		// await page.waitForNavigation()

		// Wait 5 seconds after login
		await sleep(2)

		// Search for the keyword
		await page.fill('#twotabsearchtextbox', keyword)
		await page.press('#twotabsearchtextbox', 'Enter')

		// Wait for results to load
		await page.waitForSelector('.s-result-item')

		// Sort by most reviews - Click dropdown and select 4th option
		// await page.click('#a-autoid-2-announce')
		// await sleep(1)
		// const sortOptions = await page.$$('#a-list-link')
		// if (sortOptions.length >= 4) {
		// 	await sortOptions[3].click()
		// }
		// await sleep(5) // Wait for sorting to complete

		// Get products with most reviews
		const listLink = await page
			.locator(
				`//div[contains(@data-csa-c-content-id,'alf-customer-ratings-count-component')]/a`
			)
			.elementHandles()

		const result = []

		for (const link of listLink) {
			const linkText = await link.getAttribute('href')
			const countCommentRaw = await (await link.$(`//span`)).innerText()
			console.log(countCommentRaw)

			const countComments =
				countCommentRaw && countCommentRaw.includes('(')
					? countCommentRaw?.split('(')[1]?.split(')')[0]
					: Number(countCommentRaw?.replace(',', ''))
			if (
				(countComments &&
					typeof countComments === 'string' &&
					countComments.includes('K')) ||
				countComments > 300
			) {
				result.push({
					link: linkText,
					countComments: countComments,
				})
			}
		}

		// Visit top 2 products with most reviews
		result.sort((a, b) => b.countComments - a.countComments)
		const topProducts = result
			// .filter(link => link.link.includes('/sspa'))
			.slice(0, 1)
		console.log('Found products:', result)

		const visitedProducts = []
		for (const product of topProducts) {
			console.log('Visiting product:', product)
			const productUrl = product.link.includes('amazon.com')
				? product.link
				: `https://www.amazon.com${product.link}`
			await page.goto(productUrl)
			await sleep(1)
			await page.evaluate(scroll, { direction: 'down', speed: 'slow' })

			// Get product details
			const comments = await page
				.locator(
					`//div[@class="card-padding"]//div[contains(@data-hook,'review-collapsed')]/span`
				)
				.allInnerTexts()

			const description = await page
				.locator(`//div[@id='feature-bullets']`)
				.allInnerTexts()

			const alternativeInfo = await page
				.locator(`//div[@id='tech']`)
				.allInnerTexts()

			const prodDetail = await page
				.locator(`//div[@id='prodDetails']`)
				.allInnerTexts()
			// await sleep(40)
			// for (const item of listClickItems) {
			// 	const key = item?.trim()
			// 	try {
			// 		await page.click(`//span[contains(text(),'${key}')][1]`, {
			// 			timeout: 1000,
			// 		})
			// 	} catch (error) {
			// 		console.log('Error:', error)
			// 	}
			// }
			const newinfoProduct = await page
				.locator(`//div[@id='productDetails_expanderSectionTables']`)
				.allInnerTexts()

			console.log('newinfoProduct', newinfoProduct)
			console.log('prodDetail', prodDetail)

			visitedProducts.push({
				link: productUrl,
				comments: comments,
				description: description,
				infoProduct: newinfoProduct.length ? newinfoProduct : prodDetail,
				alternativeInfo: alternativeInfo,
			})
		}

		// Close browser
		await browser.close()

		if (visitedProducts.length === 0) {
			await browser.close()
			return search(req, res)
		}

		return res.json({
			success: true,
			data: visitedProducts,
		})
	} catch (error) {
		console.error('Search error:', error)
		await browser.close()
		return res.status(500).json({
			success: false,
			error: 'Internal server error',
		})
	}
}
