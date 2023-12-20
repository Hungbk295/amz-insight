import {Suppliers} from "../config/suppliers.js";

const convertCrawlResult = (crawlResult, crawlInfo) => {
    const resultData = [];
    for (let idx = 0; idx < crawlResult.length; idx++) {
        const resultItem = crawlResult[idx];
        const item = {};
        item["rank"] = resultItem["rank"] || null;
        item["name"] = resultItem["name"];
        item["price"] = parseInt(resultItem["price"]);
        item["identifier"] = resultItem["identifier"];
        item["link"] = resultItem["link"];
        item["checkinDate"] = crawlInfo["checkinDate"];
        item["checkoutDate"] = crawlInfo["checkoutDate"];
        item["keywordId"] = crawlInfo["keywordId"];
        item["createdAt"] = crawlInfo["createdAt"];
        item["supplierId"] = resultItem["supplierId"];
        item["siteId"] = resultItem['siteId'];
        item["tag"] = resultItem["tag"];
        item["price"] = !isNaN(item["price"]) ? item["price"] : 0;
        resultData.push(item);
    }
    return resultData;
}

const classify = link => {
    if (!link) return (link) => []
    if (link.includes(Suppliers.Naver.url)) return Suppliers.Naver
    if (link.includes(Suppliers.Expedia.url)) return Suppliers.Expedia
    if (link.includes(Suppliers.Agoda.url)) return Suppliers.Agoda
    if (link.includes(Suppliers.Booking.url)) return Suppliers.Booking
    if (link.includes(Suppliers.Trip.url)) return Suppliers.Trip
    if (link.includes(Suppliers.Hotels.url)) return Suppliers.Hotels
    if (link.includes(Suppliers.Priviatravel.url)) return Suppliers.Priviatravel
    if (link.includes(Suppliers.Tourvis.url)) return Suppliers.Tourvis
    if (link.includes(Suppliers.Kyte.url)) return Suppliers.Kyte
}

export {convertCrawlResult, classify}