import { handle } from './handler.js'
import { crawl } from '../suppliers/agoda.js'

const crawlInfo = {
    url: 'https://www.agoda.com/ko-kr/search?guid=ea812ece-92e0-4558-803d-e9976eb8d62b&asq=u2qcKLxwzRU5NDuxJ0kOF3T91go8JoYYMxAgy8FkBH1BN0lGAtYH25sdXoy34qb9%2FgrBDc31uxdy7NGWxgdKosSsoS2kNiwgHvd6%2FVn%2FoD6GO3E%2BUqvogGDbjgFtg57UbS3dzzacn%2Bn7QZeTArmFDzdeTBHVQ0IPWBM1Oapvx1rppLjdbDVnEVYeh%2FttHx0U4vYBSd86EVFMQNW14nE%2FIg%3D%3D&city=6126&tick=638191642615&locale=ko-kr&ckuid=6acc5884-0938-4ccb-834c-f204ad2e5745&prid=0&currency=KRW&correlationId=c6051203-b672-4454-a0cf-9ccfc05bb17c&analyticsSessionId=8676012449680535355&pageTypeId=1&realLanguageId=9&languageId=9&origin=VN&cid=-1&userId=6acc5884-0938-4ccb-834c-f204ad2e5745&whitelabelid=1&loginLvl=0&storefrontId=3&currencyId=26&currencyCode=KRW&htmlLanguage=ko-kr&cultureInfoName=ko-kr&machineName=hk-pc-2f-acm-web-user-76489bdb8b-br658&trafficGroupId=4&sessionId=3vlshheduakg1r1iafr503sd&trafficSubGroupId=4&aid=130243&useFullPageLogin=true&cttp=4&isRealUser=true&mode=production&browserFamily=Chrome&checkIn=2023-06-24&checkOut=2023-06-25&rooms=1&adults=1&children=0&priceCur=KRW&los=1&textToSearch=%EA%B4%8C&travellerType=0&familyMode=off&productType=-1',
    checkinDate: '2023-06-25',
    checkoutDate: '2023-06-26',
    keywordId: 2,
}

console.log(await handle(crawlInfo, crawl))
