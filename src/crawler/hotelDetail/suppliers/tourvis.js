export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo['url'], {timeout: 60000})
}
