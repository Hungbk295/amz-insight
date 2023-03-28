import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
  await page.goto(crawlInfo["url"],{ timeout: 60000 });
  await page.evaluate(scroll, {direction: "down", speed: "slow"});
  await sleep(2)

  const result = {}
  const hotel_infos = await page.locator(`//div[contains(@data-testid,'property-card')]`).elementHandles()
  const count_elements_page = hotel_infos.length;
  const remain_elements = 40 - count_elements_page
  const hotel_info = []
  for (const hotel of hotel_infos){
    try {
      const dict_raw = {};
      const hotel_name = await (await hotel.$(`//div[contains(@data-testid,'title')]`)).innerText()
      const hotel_price = await (await hotel.$(`//span[contains(@data-testid,'price-and-discounted-price')]`)).innerText()
      const hotel_link = await (await hotel.$(`//a[contains(@data-testid,'title-link')]`)).getAttribute('href')

      dict_raw["hotel_name"] = hotel_name
      dict_raw["hotel_price"] = hotel_price.replace(/[^0-9]/g, '');
      dict_raw["hotel_link"] = hotel_link
      hotel_info.push(dict_raw)
    } catch (e) {
      console.log(await hotel.innerText())
    }

  }
  if(remain_elements > 0 ){
    await page.locator(`//div[contains(@data-testid,'pagination')]/nav/div/div[3]/button`).click()
  }
  await sleep(5)
  await page.evaluate(scroll, {direction: "down", speed: "slow"});
  const hotel_infos2 = await page.locator(`//div[contains(@data-testid,'property-card')]`).elementHandles()

  for (let i = 0 ; i < remain_elements; i+= 1){
    const dict_raw = {};
    const hotel_name = await (await hotel_infos2[i].$(`//div[contains(@data-testid,'title')]`)).innerText()
    const hotel_price = await (await hotel_infos2[i].$(`//span[contains(@data-testid,'price-and-discounted-price')]`)).innerText()
    const hotel_link = await (await hotel_infos2[i].$(`//a[contains(@data-testid,'title-link')]`)).innerText()
    dict_raw["hotel_name"] = hotel_name
    dict_raw["hotel_price"] = hotel_price.replace(/[^0-9]/g, '');
    dict_raw["hotel_link"] = hotel_link
    hotel_info.push(dict_raw)
  }

  result["hotel_info"] = hotel_info
  return result;
}