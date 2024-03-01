const convertCrawlResult = (crawlResult, task) => {
    if(crawlResult.length === 0)
        throw new Error('Cannot crawl ' + JSON.stringify(task))
    const resultData = [];
    for (let idx = 0; idx < crawlResult.length; idx++) {
        const resultItem = crawlResult[idx];
        const item = {};
        item["rank"] = resultItem["rank"] || null;
        item["name"] = resultItem["name"];
        item["price"] = parseInt(resultItem["price"]);
        item["identifier"] = resultItem["identifier"];
        item["link"] = resultItem["link"];
        item["checkIn"] = task["checkIn"];
        item["checkOut"] = task["checkOut"];
        item["keywordId"] = task["keywordId"];
        item["createdAt"] = task["createdAt"];
        item["supplierId"] = resultItem["supplierId"];
        item["siteId"] = resultItem['siteId'];
        item["tag"] = resultItem["tag"];
        item["price"] = !isNaN(item["price"]) ? item["price"] : 0;
        resultData.push(item);
    }
    return resultData;
}

export {convertCrawlResult}