import dayjs from "dayjs";
import fs from "fs";
import AWS from "aws-sdk";

function generateUrlForExpedia(originalUrl, targetDate, nextDate) {
  return originalUrl + ".Hotel-Information?chkin=" + targetDate + "&chkout=" + nextDate
}

function generateUrlForAgoda(originalUrl, targetDate, nextDate, id) {
  return originalUrl
}

function classify(url) {
  if (url === undefined) return null
  if (url.includes("www.expedia")) return "expedia"
  if (url.includes("www.agoda")) return "agoda"
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function generateTaskFromLine(line, startDate, endDate) {
  let lineItems = line.split(",")
  const id = lineItems[0];
  const hotelName = lineItems[1];
  const url = lineItems[2];
  const task = {};
  task["id"] = id;
  task["hotel_name"] = hotelName;
  task["start_date"] = startDate;
  task["end_date"] = endDate;
  let results = [];
  let numberOfDays = dayjs(endDate).diff(dayjs(startDate), "days");
  for (let i = 0; i < numberOfDays; i++) {
    let link = {};
    let targetDate = dayjs(startDate).add(i, "day").format("YYYY-MM-DD");
    let nextDate = dayjs(startDate).add(i + 1, "day").format("YYYY-MM-DD");
    // if (dayjs(targetDate).day() === 2 || dayjs(targetDate).day() === 5 || dayjs(targetDate).day() === 6) {
      link["id"] = id;
      link["target_date"] = targetDate;
      link["next_date"] = nextDate;
      switch (classify(url)) {
        case "agoda":
          link["url"] = generateUrlForAgoda(url, targetDate, nextDate)
          break;
        case "expedia":
          link["url"] = generateUrlForExpedia(url, targetDate, nextDate, id)
          break;
        default:
      }
      results.push(link);
    // }
  }
  task["results"] = results
  return task
}

function generateTasks(startDate, endDate, hotelFilePath) {
  let tasks = [];
  let data = fs.readFileSync(hotelFilePath, {encoding:'utf8', flag:'r'})
  data = data.replace(/(\r\n|\n|\r)/gm, "\n")
  const lines = data.split("\n")
  lines.forEach(line => {
    const task = generateTaskFromLine(line, startDate, endDate)
    tasks.push(task)
  })
  return tasks
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

async function main() {
  let today = dayjs()
  let todayString = today.year() + '-' + today.month() + 1 + '-' + today.date()
  let startDate = dayjs(todayString).add(7, "day").format("YYYY-MM-DD")
  let endDate = dayjs(todayString).add(14, "day").format("YYYY-MM-DD")
  const tasks = generateTasks("2023-02-23", "2023-02-24", "temp.csv")
  shuffle(tasks)
  await sendMessages(tasks)
}

await main()
