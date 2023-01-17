import AWS from "aws-sdk";
import fs from "fs"
const s3Config = {
    apiVersion: '2006-03-01',
    region: 'ap-northeast-2',
}
const s3 = new AWS.S3(s3Config)
export const sleep = s => new Promise(r => setTimeout(r, s * 1000));
export const getRandomInt = (min, max) => Math.random() * (max - min) + min;
export const checkBreakfast = (text, key) => {return (text.includes(key)) ? 'Y' : `N`}
export const checkCancelable = (text, key) => {return (text.includes(key)) ? 'N' : 'Y'}
export const classify = (link) => {
    if (link === undefined) return ""
    if (link.includes("www.agoda.co")) return "agoda"
    if (link.includes("www.expedia.co")) return "expedia"
}
export const uploadFile = (file) => {
    const fileContent = fs.readFileSync(file);
    return s3.upload({
        Bucket: 'airticket-daily-fly',
        ACL: 'private',
        Key: file,
        Body: fileContent
    }).promise()
}
export const scroll = async (args) => {
    const {direction, speed} = args;
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const scrollHeight = () => document.body.scrollHeight/3;
    const start = direction === "down" ? 0 : scrollHeight();
    const shouldStop = (position) => direction === "down" ? position > scrollHeight() : position < 0;
    const increment = direction === "down" ? 100 : -100;
    const delayTime = speed === "slow" ? 50 : 10;
    console.error(start, shouldStop(start), increment)
    for (let i = start; !shouldStop(i); i += increment) {
        window.scrollTo(0, i);
        await delay(delayTime);
    }
};
export const takeScreenshot = async (page) => {
    let currentDate = (new Date()).toString().trim()
    let cwd = process.cwd()
    await page.screenshot({path: cwd + "/temp/" + currentDate + ".jpeg", fullPage: true, quality: 20, type: 'jpeg'});
    await uploadFile(cwd + "/temp/" + currentDate + ".jpeg")
    let html = await page.innerHTML("//body")
    fs.writeFileSync(cwd + "/temp/" +  currentDate + ".html", html);
    await uploadFile(cwd + "/temp/" +  currentDate + ".html")
}
export async function sendMessages(tasks) {
    AWS.config.update({region: 'ap-northeast-2'});
    const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    for (const task of tasks) {
        const params = {
            MessageBody: JSON.stringify(task),
            QueueUrl: process.env.AWS_SQS_HOTELFLY_LINK_URL
        };
        await sqs.sendMessage(params, () => {})
    }
}