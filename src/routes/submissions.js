import { Router } from 'express'
import { getSubmissions, getSubmissionById } from '../controllers/submissionController.js'
import { authenticate } from '../middlewares/auth.js'

const router = Router({ mergeParams: true })

router.get('/', authenticate, getSubmissions)
router.get('/:submissionId', authenticate, getSubmissionById)

export default router