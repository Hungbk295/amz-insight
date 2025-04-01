import {SUPPLIERS} from "../../../config/suppliers.js";
import {sleep, scroll} from "../../../utils/util.js";

export class Naver {
    async crawl(page, task) {
        const waitForApiData = () => {
            return new Promise(async (resolve) => {
                let apiData = null;
                let hasResolved = false;
                
                await page.unroute('**/graphql').catch(() => {});
                
                await page.route('**/graphql', async route => {
                    try {
                        const reqBody = route.request().postDataJSON();
                        if (reqBody['operationName'] === 'hotelSearchByPlaceId') {
                            const response = await route.fetch({ timeout: 45000 });
                            const json = await response.json();
                            apiData = json?.data?.hotelSearchByPlaceId?.hotelList;
                            
                            if (!hasResolved) {
                                hasResolved = true;
                                resolve(apiData);
                            }
                            
                            await route.fulfill({ response, json });
                        } else {
                            await route.continue();
                        }
                    } catch (e) {
                        console.error('Error intercepting GraphQL:', e);
                        await route.continue();
                        
                        if (!hasResolved) {
                            hasResolved = true;
                            resolve(null);
                        }
                    }
                });
                
                setTimeout(() => {
                    if (!hasResolved) {
                        console.log('Timeout waiting for API data');
                        hasResolved = true;
                        resolve(apiData);
                    }
                }, 20000);
            });
        };

        let dataPromise = waitForApiData();
        
        await page.goto(SUPPLIERS.Naver.link + task["link"], {timeout: 60000});
        await sleep(10);
        await page.evaluate(scroll, {direction: "down", speed: "slow"});
        await sleep(5);
        
        let linkURL = page.url();
        const uniqueURL = linkURL.replace(SUPPLIERS.Naver.link, "").split("?")[0] + "/";

        let hotelDataFromAPI = await dataPromise;
        let hotels = await this.handleSinglePage(task, page, hotelDataFromAPI);

        while (hotels.length < 100) {
            try {
                dataPromise = waitForApiData();
                
                await page.locator("(//button[contains(@class, 'Pagination_next')])[1]").click();
                await sleep(10);
                
                await page.evaluate(scroll, {direction: "down", speed: "slow"});
                await sleep(5);
                
                hotelDataFromAPI = await dataPromise;
                const newHotels = await this.handleSinglePage(task, page, hotelDataFromAPI);
                hotels = hotels.concat(newHotels);
                
                console.log(`Total hotels collected: ${hotels.length}`);
            } catch (e) {
                console.log('Error in pagination:', e);
                break;
            }
        }
        const result = hotels.slice(0, 100);
        
        result.forEach((item, index) => {
            item.rank = index + 1;
            item.link = uniqueURL+item.link;
        });
        console.log(result[0]);
        
        return result
    }

    async handleSinglePage(task, page, hotelDataFromAPI) {
        const hotelInfos = await page.locator(`//div[contains(@class, 'Contents_result')]/ul/li`).elementHandles()
        await sleep(5)
        
        const hotelPromises = hotelInfos.map(async (info) => {
            try {
                const hotel = {};

                const hotelNameElement = await info.$(`//div[1]/div/h4`);
                if (!hotelNameElement) {
                    console.log('hotelNameElement not found');
                    return null;
                }
                let hotelName = '';
                try {
                    hotelName = await hotelNameElement.innerText();
                } catch (e) {
                    console.log('hotelNameError', e);
                    return null;
                }
                if (!hotelName) {
                    console.log('Empty hotel name');
                    return null;
                }
                
                let hotelPrice = Infinity;
                const pricePromises = [1, 2, 3].map(async (i) => {
                    try {
                        const priceElement = await info.$(`//ul[contains(@class,'RateList_RateList')]/li[${i}]//div[contains(@class,'RateList_price_area')]/b/strong`);
                        if (!priceElement) return Infinity;
                        
                        const priceText = await priceElement.innerText();
                        return parseInt(priceText.replace(/[^0-9]/g, '')) || Infinity;
                    } catch (e) {
                        console.log(`hotelPriceError at index ${i}:`, e);
                        return Infinity;
                    }
                });
                
                const prices = await Promise.all(pricePromises);
                hotelPrice = Math.min(...prices);
                
                const hotelMatch = hotelDataFromAPI?.find(item => item.hotelName === hotelName);
                
                if (!hotelMatch) {
                    console.log('Hotel not found in API data:', hotelName);
                    return null;
                }
                
                const hotelId = hotelMatch.hotelId;
                
                hotel.name = hotelName;
                hotel.price = hotelPrice === Infinity ? null : hotelPrice;
                hotel.link = hotelId;
                hotel.supplierId = SUPPLIERS.Naver.id;
                hotel.identifier = hotelId;
                hotel.tag = hotelId;
                hotel.checkIn = task.checkIn;
                hotel.checkOut = task.checkOut;
                
                return hotel;
            } catch (e) {
                console.log('Error processing hotel:', e);
                return null;
            }
        });
        
        const hotels = (await Promise.all(hotelPromises)).filter(hotel => hotel !== null);
        
        return hotels;
    }
}