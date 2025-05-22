const SUPPLIERS = {
	Amazon: {
		id: 'amazon',
		name: 'Amazon',
		baseUrl: 'https://www.amazon.com/search/s?k=search',
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

const INTERNAL_SUPPLIER_IDS = [SUPPLIERS.Amazon.id]

export { SUPPLIERS, INTERNAL_SUPPLIER_IDS }
