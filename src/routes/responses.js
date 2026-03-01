import { Router } from 'express'
import { submitResponse } from '../controllers/responseController.js'

const router = Router({ mergeParams: true })

router.post('/', submitResponse)

export default router