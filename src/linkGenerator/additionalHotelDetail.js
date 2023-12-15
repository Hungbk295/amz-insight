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

const isSupplierPriceExist = (supplierData, comparedSupplier) => {
    if (supplierData['supplier_id'] !== comparedSupplier.id) return false
    return supplierData.siteId === Sites.detail.id || supplierData.siteId === Sites.detailDiscount.id
}

const generateAdditionalHotelDetailLinksBySupplier = async (hotelData, supplier, keywordItem, checkinDate, checkoutDate) => {
    const hotelDataGroupedByHotelId = groupHotelDataByHotelId(hotelData, supplier)
    const comparedSuppliers = suppliersWithDetailPrice.filter(item => item.id !== supplier.id)
    const tasks = []
    for (let [hotelId, items] of Object.entries(hotelDataGroupedByHotelId)) {
        if (items.length === 0) return
        const createdAt = items[0]['created_at']
        // check if data of the compared supplier is missing (init as missing)
        const check = {}
        comparedSuppliers.forEach(comparedSupplier => {
            check[`${comparedSupplier.id}`] = false
        })
        items.forEach(item => {
            comparedSuppliers.forEach(comparedSupplier => {
                if (isSupplierPriceExist(item, comparedSupplier)) {
                    check[`${comparedSupplier.id}`] = true
                }
            })
        })
        for (const supplierId in check) {
            if (!check[supplierId]) {
                const taskGenerator = taskGenerators[supplierId]
                const task = await taskGenerator.generateTaskForHotelDetail(checkinDate, checkoutDate, keywordItem, createdAt, hotelId)
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
