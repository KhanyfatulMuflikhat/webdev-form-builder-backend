import { Router } from 'express'
import { getForms, getFormById, createForm, updateForm, deleteForm } from '../controllers/formController.js'
import { authenticate } from '../middlewares/auth.js'
import questionRoutes from './questions.js'
import responseRoutes from './responses.js'

const router = Router()

router.get('/', authenticate, getForms)
router.get('/:id', authenticate, getFormById)
router.post('/', authenticate, createForm)
router.put('/:id', authenticate, updateForm)
router.delete('/:id', authenticate, deleteForm)

router.use('/:formId/questions', questionRoutes)
router.use('/:formId/responses', responseRoutes)

export default router