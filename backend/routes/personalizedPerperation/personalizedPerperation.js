import express from 'express'
import { preperation } from '../../controllers/personalizedPerperation/personalizedPerperation.js'
import { auth } from '../../middleware/auth.js'


const router = express.Router()

router.post('/',auth,preperation)

export default router