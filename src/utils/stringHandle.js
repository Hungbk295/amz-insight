import _ from 'lodash'

export const getNumberInString = str => {
	// const textArr = [str]

	let array = str.split('')
	return _.reduce(
		array,
		(total, o) => {
			// console.log(isNaN(o))
			return !isNaN(o) ? total + o : total
		},
		''
	)
}
