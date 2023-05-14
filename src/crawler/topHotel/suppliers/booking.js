import {scroll, sleep} from "../../../utils/util.js"
import {getBrowser} from "../../../utils/playwright_browser.js";
import {Suppliers} from "../../../constants/suppliers.js";

export const crawl = async (page, crawlInfo) => {
  await page.goto(crawlInfo["url"],{ timeout: 60000 });
  await sleep(15)
  await page.evaluate(scroll, {direction: "down", speed: "slow"});

  const hotel_infos = await page.locator(`//div[contains(@data-testid,'property-card')]`).elementHandles()
  const count_elements_page = hotel_infos.length;
  const remain_elements = 40 - count_elements_page
  const hotels = []
  for (const info of hotel_infos){
    try {
      const hotel = {};
      const hotel_name = await (await info.$(`//div[contains(@data-testid,'title')]`)).innerText()
      const hotel_price = await (await info.$(`//span[contains(@data-testid,'price-and-discounted-price')]`)).innerText()
      const hotel_link = (await (await info.$(`//a[contains(@data-testid,'title-link')]`)).getAttribute('href')).replace(Suppliers.Booking.url, "/")
      const hotel_identifier = hotel_link.split('/')[5].split('.')[0]
      const hotel_tag = hotel_identifier

      hotel.name = hotel_name
      hotel.price = hotel_price.replace(/[^0-9]/g, '');
      hotel.link = hotel_link
      hotel.identifier = hotel_identifier
      hotel.tag = hotel_tag
      hotel.supplierId = Suppliers.Booking.id
      hotel.checkinDate = crawlInfo['checkinDate']
      hotel.checkoutDate = crawlInfo['checkoutDate']
      hotels.push(hotel)
    } catch (e) {

    }
  }
  // if (remain_elements > 0 ){
  //   await page.locator(`//div[contains(@data-testid,'pagination')]/nav/div/div[3]/button`).click()
  // }
  // await sleep(5)
  // await page.evaluate(scroll, {direction: "down", speed: "slow"});
  // const hotel_infos2 = await page.locator(`//div[contains(@data-testid,'property-card')]`).elementHandles()
  //
  // for (let i = 0 ; i < remain_elements; i+= 1){
  //   const dict_raw = {};
  //   const hotel_name = await (await hotel_infos2[i].$(`//div[contains(@data-testid,'title')]`)).innerText()
  //   const hotel_price = await (await hotel_infos2[i].$(`//span[contains(@data-testid,'price-and-discounted-price')]`)).innerText()
  //   const hotel_link = await (await hotel_infos2[i].$(`//a[contains(@data-testid,'title-link')]`)).innerText()
  //   dict_raw["hotel_name"] = hotel_name
  //   dict_raw["hotel_price"] = hotel_price.replace(/[^0-9]/g, '');
  //   dict_raw["hotel_link"] = hotel_link
  //   hotels.push(dict_raw)
  // }
  return hotels
}
