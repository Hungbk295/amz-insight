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

export {convertCrawlResult}