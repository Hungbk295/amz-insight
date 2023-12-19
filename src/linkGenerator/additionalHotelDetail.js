import {Suppliers} from "../config/suppliers.js";
import {Agoda, Booking, Expedia, Hotels, Kyte, Naver, Priviatravel, Tourvis, Trip} from "./suppliers/index.js";
import axios from "axios";
import {getTargetDate} from "./linkGenerator.js";
import {importantSuppliers, MAX_RANK_WITH_DETAIL_PRICE, suppliersWithDetailPrice} from "../config/app.js";
import {createSqsMessages} from "../utils/awsSdk.js";

const taskGenerators = {
    [Suppliers.Agoda.id]: new Agoda(),
    [Suppliers.Booking.id]: new Booking(),
    [Suppliers.Expedia.id]: new Expedia(),
    [Suppliers.Hotels.id]: new Hotels(),
    [Suppliers.Kyte.id]: new Kyte(),
    [Suppliers.Naver.id]: new Naver(),
    [Suppliers.Priviatravel.id]: new Priviatravel(),
    [Suppliers.Tourvis.id]: new Tourvis(),
    [Suppliers.Trip.id]: new Trip(),
}

const getRankForHotelData = (items, supplier) => {
    for (const item of items)
        if (item['supplier_id'] === supplier.id && !item['site_id']) return item['rank']
    return Infinity
}

const groupHotelDataByHotelId = (hotelData, currentSupplier) => {
    const supplierData = hotelData['supplierData']
    const group = {};
    if (supplierData) {
        const supplierDataOfOthers = [];
        supplierData.forEach((item) => {
            if (item['hotel_id']) {
                const key = item['hotel_id'];
                if (item['supplier_id'] === currentSupplier.id) {
                    group[key] = group[key] ?? [];
                    group[key].push(item);
                } else supplierDataOfOthers.push(item);
            } else {
                const key = `${item.identifier},${item['supplier_id']}`;
                group[key] = group[key] ?? [];
                group[key].push(item);
            }
        });
        supplierDataOfOthers.forEach((item) => {
            const key = item['hotel_id'];
            if (group[key]) group[key].push(item);
        });
    }
    const res = Object.values(group).sort((a, b) => {
        return getRankForHotelData(a, currentSupplier) - getRankForHotelData(b, currentSupplier)
    })
    return res.slice(0, MAX_RANK_WITH_DETAIL_PRICE);
};

const getHotelInfoIfMissingData = (hotelDataItems, supplier) => {
    const mainPriceItem = hotelDataItems.find(item => item['supplier_id'] === supplier.id && !item['site_id'])
    if (mainPriceItem && mainPriceItem['rank'] > MAX_RANK_WITH_DETAIL_PRICE) return mainPriceItem
    return null
}

const generateAdditionalHotelDetailLinksBySupplier = async (hotelData, supplier, keywordItem, checkinDate, checkoutDate) => {
    const hotelDataGroupedByHotelId = groupHotelDataByHotelId(hotelData, supplier)
    const checkingSuppliers = suppliersWithDetailPrice.filter(item => item.id !== supplier.id)
    const tasks = []
    for (let items of hotelDataGroupedByHotelId) {
        if (items.length === 0) return
        const createdAt = items[0]['created_at']
        for (const checkingSupplier of checkingSuppliers) {
            const hotelInfo = getHotelInfoIfMissingData(items, checkingSupplier)
            if (hotelInfo) {
                const taskGenerator = taskGenerators[checkingSupplier.id]
                const task = await taskGenerator.generateTaskForHotelDetail(checkinDate, checkoutDate, keywordItem, createdAt, hotelInfo)
                tasks.push(task)
            }
        }
    }
    return tasks
}

const generateAdditionalHotelDetailLinks = async () => {
    const keywords = (await axios.get(process.env.HOTELFLY_API_HOST + '/keyword')).data
    const dayTypes = ['weekday', 'weekend']
    const subsequentWeeks = [3, 5]
    for (const keywordItem of keywords) {
        for (const dayType of dayTypes) {
            for (const subsequentWeek of subsequentWeeks) {
                const [checkinDate, checkoutDate] = getTargetDate(dayType, subsequentWeek)
                const params = {
                    keyword_id: keywordItem.id,
                    checkin: checkinDate,
                };
                const hotelData = (await axios.get(process.env.HOTELFLY_API_HOST + '/hotel/hotel-result-data', {params})).data
                for (const supplier of importantSuppliers) {
                    const tasks = await generateAdditionalHotelDetailLinksBySupplier(hotelData, supplier, keywordItem, checkinDate, checkoutDate)
                    await createSqsMessages(process.env.AWS_SQS_HOTELFLY_HOTEL_DETAILS_LINK_URL, tasks)
                }
            }
        }
    }
}

export {generateAdditionalHotelDetailLinks}
