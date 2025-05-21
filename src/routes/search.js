import express from 'express'
import { search } from '../api/search.js'

const router = express.Router()

router.get('/search', search)

export default router
