import express from 'express'
import searchRoutes from './routes/search.js'

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(express.json())

// Default route
app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to Amazon Search API',
		endpoints: {
			search: '/api/search?keyword=your_search_term',
		},
	})
})

// Routes
app.use('/api', searchRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).json({
		success: false,
		error: 'Something went wrong!',
	})
})

app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
