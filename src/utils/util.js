export const sleep = s => new Promise(r => setTimeout(r, s * 1000))
export const scroll = async args => {
	const { direction, speed } = args
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
	const scrollHeight = () => document.body.scrollHeight / 4
	const start = direction === 'down' ? 0 : scrollHeight()
	const shouldStop = position =>
		direction === 'down' ? position > scrollHeight() - 500 : position < 0
	const increment = direction === 'down' ? 200 : -50
	const delayTime = speed === 'slow' ? 100 : 10
	console.error(start, shouldStop(start), increment)
	for (let i = start; !shouldStop(i); i += increment) {
		window.scrollTo(0, i)
		await delay(delayTime)
	}
}
