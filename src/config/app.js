import {Suppliers} from "./suppliers.js";

const importantSuppliers = [
    Suppliers.Tourvis,
    Suppliers.Priviatravel,
    Suppliers.Naver
]
const suppliersWithDetailPrice = [
    Suppliers.Priviatravel,
    // Suppliers.Tourvis.id
]
const MAX_RANK_WITH_DETAIL_PRICE = 20

export {importantSuppliers, suppliersWithDetailPrice, MAX_RANK_WITH_DETAIL_PRICE}