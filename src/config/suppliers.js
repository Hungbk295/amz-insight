const SUPPLIERS = {
	Amazon: {
		id: 'amazon',
		name: 'Amazon',
		baseUrl: 'https://www.amazon.com',
	},
}

export const getConfigBySupplierId = supplierId => {
	if (supplierId === SUPPLIERS.Amazon.id) {
		return {
			id: supplierId,
			name: SUPPLIERS.Amazon.name,
			baseUrl: SUPPLIERS.Amazon.baseUrl,
		}
	} else {
		return Object.values(SUPPLIERS).find(item => item.id === supplierId)
	}
}

const INTERNAL_SUPPLIER_IDS = [
	SUPPLIERS.Tourvis.id,
	SUPPLIERS.Privia.id,
	SUPPLIERS.Kyte.id,
	SUPPLIERS.Amazon.id,
]

const SITES = {
	detailDiscount: {
		name: 'detailDiscount',
		id: 10001,
	},
	detail: {
		name: 'detail',
		id: 10002,
	},
	discountDetailLoggedIn: {
		id: 10101,
		name: 'detailDiscountLoggedIn',
		domain: '',
	},
	detailLoggedIn: {
		id: 10102,
		name: 'detailLoggedIn',
		domain: '',
	},
}

export { SUPPLIERS, SITES, INTERNAL_SUPPLIER_IDS }
