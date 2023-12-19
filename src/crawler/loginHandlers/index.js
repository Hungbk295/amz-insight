import {login as loginPrivia} from './suppliers/privia.js'

const suppliers = {
    7: loginPrivia
}

export const login = async (sideId, page) => {
    await suppliers[sideId](page)
}