import prisma from '../lib/prisma.js'

export const submitResponse = async (req, res) => {
  const { formId } = req.params
  const { answers } = req.body

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Answers harus berupa array' })
  }

  try {
    const form = await prisma.form.findUnique({
      where: { id: parseInt(formId) },
      include: { questions: true }
    })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.status !== 'active') return res.status(400).json({ message: 'Form tidak aktif' })

    // Cek required questions
    const requiredQuestions = form.questions.filter(q => q.required)
    for (const q of requiredQuestions) {
      const answer = answers.find(a => a.questionId === q.id)
      if (!answer || !answer.value) {
        return res.status(400).json({ message: `Pertanyaan "${q.label}" wajib diisi` })
      }
    }

    const response = await prisma.response.create({
      data: {
        formId: parseInt(formId),
        answers: {
          create: answers.map(a => ({
            questionId: a.questionId,
            value: String(a.value)
          }))
        }
      },
      include: { answers: true }
    })

    res.status(201).json({ message: 'Response berhasil dikirim', response })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}