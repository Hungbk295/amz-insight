import {SUPPLIERS} from "../config/suppliers.js";
import {Agoda, Booking, Expedia, Hotels, Kyte, Naver, Privia, Tourvis, Trip} from "./suppliers/index.js";
import axios from "axios";
import {
    DAY_OF_WEEKS_CONDITION,
    IMPORTANT_SUPPLIERS,
    MAX_RANK_WITH_DETAIL_PRICE, SUBSEQUENT_WEEKS_CONDITION,
    SUPPLIERS_WITH_DETAIL_PRICE
} from "../config/app.js";
import {createSqsMessages} from "../utils/awsSdk.js";
import {getConditions, checkTaskTime ,checkUniqueCreatedAt} from "../utils/util.js";
import Sentry from "../utils/sentry.js";

const taskGenerators = {
    [SUPPLIERS.Agoda.id]: new Agoda(),
    [SUPPLIERS.Booking.id]: new Booking(),
    [SUPPLIERS.Expedia.id]: new Expedia(),
    [SUPPLIERS.Hotels.id]: new Hotels(),
    [SUPPLIERS.Kyte.id]: new Kyte(),
    [SUPPLIERS.Naver.id]: new Naver(),
    [SUPPLIERS.Privia.id]: new Privia(),
    [SUPPLIERS.Tourvis.id]: new Tourvis(),
    [SUPPLIERS.Trip.id]: new Trip(),
}

const getRankForHotelData = (items, supplier) => {
    for (const item of items)
        if (item['supplierId'] === supplier.id && !item['siteId']) return item['rank']
    return Infinity
}

const groupHotelDataByHotelId = (hotelData, currentSupplier) => {
    const supplierData = hotelData['supplierData']
    const group = {};
    if (supplierData) {
        const supplierDataOfOthers = [];
        supplierData.forEach((item) => {
            if (item['hotelId']) {
                const key = item['hotelId'];
                if (item['supplierId'] === currentSupplier.id) {
                    group[key] = group[key] ?? [];
                    group[key].push(item);
                } else supplierDataOfOthers.push(item);
            } else {
                const key = `${item.identifier},${item['supplierId']}`;
                group[key] = group[key] ?? [];
                group[key].push(item);
            }
        });
        supplierDataOfOthers.forEach((item) => {
            const key = item['hotelId'];
            if (group[key]) group[key].push(item);
        });
    }
    const res = Object.values(group).sort((a, b) => {
        return getRankForHotelData(a, currentSupplier) - getRankForHotelData(b, currentSupplier)
    })
    return res.slice(0, MAX_RANK_WITH_DETAIL_PRICE);
};

const getHotelInfoIfMissingData = (hotelDataItems, supplier) => {
    const mainPriceItem = hotelDataItems.find(item => item['supplierId'] === supplier.id && !item['siteId'])
    if (mainPriceItem && mainPriceItem['rank'] > MAX_RANK_WITH_DETAIL_PRICE) return mainPriceItem
    return null
}

const generateAdditionalHotelDetailTasksBySupplier = async (hotelData, supplier, keyword, checkIn, checkOut) => {
    const hotelDataGroupedByHotelId = groupHotelDataByHotelId(hotelData, supplier)
    const checkingSuppliers = SUPPLIERS_WITH_DETAIL_PRICE.filter(item => item.id !== supplier.id)
    const tasks = []
    for (let items of hotelDataGroupedByHotelId) {
        if (items.length === 0) return
        const createdAt = items[0]['createdAt']
        for (const checkingSupplier of checkingSuppliers) {
            const hotelInfo = getHotelInfoIfMissingData(items, checkingSupplier)
            if (hotelInfo) {
                const taskGenerator = taskGenerators[checkingSupplier.id]
                const task = await taskGenerator.generateHotelDetailTask(checkIn, checkOut, keyword, createdAt, hotelInfo)
                tasks.push(task)
            }
        }
    }
    return tasks
}

const generateAdditionalHotelDetailTasks = async () => {
    const keywords = (await axios.get(process.env.API_HOST + '/keyword')).data
    const conditions = getConditions(DAY_OF_WEEKS_CONDITION, SUBSEQUENT_WEEKS_CONDITION, keywords, IMPORTANT_SUPPLIERS)

    let currentCreatedAt
    let currentTasks=[]
    const startGen=new Date()
    Sentry.captureMessage(`generateAdditionalHotelDetailTasks status:begin start:${startGen} on worker: ${process?.argv?.[2]}`,{
        level:'info'
    })
    for (const condition of conditions) {
        const start = new Date(); 
        const params = {
            keywordId: condition['keyword'].id,
            checkIn: condition['checkIn'],
        };
        try {
            const hotelData = (await axios.get(process.env.API_HOST + '/hotel-data/latest-data', {params})).data
            const tasks = await generateAdditionalHotelDetailTasksBySupplier(hotelData, condition['supplier'], condition['keyword'], condition['checkIn'], condition['checkOut'])
 
            await createSqsMessages(process.env.QUEUE_DETAIL_TASKS_URL, tasks)
            const end = new Date();
            if(tasks?.length>0) {
                checkUniqueCreatedAt(hotelData)
                checkTaskTime({
                    tasks,
                    start,
                    end,
                    createdAt:tasks[0].createdAt
                }, 'generate additional tasks')

                if(!currentCreatedAt) {
                    currentCreatedAt=tasks[0].createdAt
                    currentTasks=tasks.slice(0, 10)
                }
                else{
                   if(currentCreatedAt!==tasks[0].createdAt){
                        Sentry.captureMessage(`generateAdditionalHotelDetailTasks start:${startGen} -> logDiff: ${endGen} on worker: ${process?.argv?.[2]}`,{
                            level:'warning',
                            extra:{
                                currentCreatedAt,
                                currentTasks:JSON.stringify(currentTasks.slice(0,10)),
                                nextCreatedAt:tasks[0].createdAt,
                                nextTasks:JSON.stringify(tasks.slice(0,10))
                            }
                        })
                        currentCreatedAt=tasks[0].createdAt
                        currentTasks=tasks.slice(0, 10)
                   }
                }
     
            }
        } catch (e) {
            console.log(e);
        }
    }
    const endGen=new Date()
    Sentry.captureMessage(`generateAdditionalHotelDetailTasks status:done start:${startGen} -> end: ${endGen} on worker: ${process?.argv?.[2]}`,{
        level:'info'
    })
}

export {generateAdditionalHotelDetailTasks}
