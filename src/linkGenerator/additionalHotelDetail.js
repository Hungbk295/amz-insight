import {Sites, Suppliers} from "../constants/suppliers.js";
import {Agoda, Booking, Expedia, Hotels, Kyte, Naver, Priviatravel, Tourvis, Trip} from "./suppliers/index.js";
import axios from "axios";
import {getTargetDate} from "./linkGenerator.js";

const importantSuppliers = [
    Suppliers.Tourvis,
    Suppliers.Priviatravel,
    Suppliers.Naver
]
const suppliersWithDetailPrice = [
    Suppliers.Priviatravel,
    // Suppliers.Tourvis.id
]
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

const groupHotelDataByHotelId = (hotelData, currentSupplier) => {
    const supplierData = hotelData['supplierData']
    const subSupplierData = hotelData['subSupplierData']
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
            }
        });
        //ignore if currentSupplier does not have that hotel_id
        supplierDataOfOthers.forEach((item) => {
            const key = item['hotel_id'];
            if (group[key]) group[key].push(item);
        });
    }

    if (subSupplierData) {
        subSupplierData.forEach((item) => {
            const key = item['hotel_id'];
            if (group[key]) group[key].push(item);
        });
    }
    return group;
};

const getHotelInfoIfMissingData = (hotelDataItems, supplier) => {
    const mainPriceItem = hotelDataItems.find(item => item['supplier_id'] === supplier.id && !item['site_id'])
    if (!mainPriceItem) return null
    for (const item of hotelDataItems)
        if (item['supplier_id'] === supplier && (item['site_id'] === Sites.detail.id || item['site_id'] === Sites.detailDiscount.id)) return null
    return mainPriceItem
}

const generateAdditionalHotelDetailLinksBySupplier = async (hotelData, supplier, keywordItem, checkinDate, checkoutDate) => {
    const hotelDataGroupedByHotelId = groupHotelDataByHotelId(hotelData, supplier)
    const checkingSuppliers = suppliersWithDetailPrice.filter(item => item.id !== supplier.id)
    const tasks = []
    for (let [hotelId, items] of Object.entries(hotelDataGroupedByHotelId)) {
        if (items.length === 0) return
        const createdAt = items[0]['created_at']
        for (const supplier of checkingSuppliers) {
            const hotelInfo = getHotelInfoIfMissingData(items, supplier)
            if (hotelInfo) {
                const taskGenerator = taskGenerators[supplier.id]
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
    let result = []
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
                    result.push(...tasks)
                }
            }
        }
    }
    return result
}

export {generateAdditionalHotelDetailLinks}
