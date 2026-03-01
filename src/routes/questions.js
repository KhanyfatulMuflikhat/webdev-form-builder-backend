import { Router } from 'express'
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController.js'
import { authenticate } from '../middlewares/auth.js'

const router = Router({ mergeParams: true })

router.get('/', authenticate, getQuestions)
router.post('/', authenticate, createQuestion)
router.put('/:questionId', authenticate, updateQuestion)
router.delete('/:questionId', authenticate, deleteQuestion)

export default router