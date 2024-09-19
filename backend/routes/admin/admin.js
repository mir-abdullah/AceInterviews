import express from 'express'
import { createAdmin ,loginAdmin} from '../../controllers/admin/admin.js'

const router = express.Router()

//create admin route
router.post('/', createAdmin)

//login admin
router.post('/login', loginAdmin)

export default router