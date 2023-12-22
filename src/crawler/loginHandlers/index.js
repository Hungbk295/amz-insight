import {Privia} from './suppliers/privia.js'
import {Tourvis} from './suppliers/tourvis.js'
import {SUPPLIERS} from "../../config/suppliers.js";

const suppliers = {
    [SUPPLIERS.Privia.id]: new Privia(),
    [SUPPLIERS.Tourvis.id]: new Tourvis()
}

export const login = async (supplierId, page) => {
    await suppliers[supplierId].login(page)
}