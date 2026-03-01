import prisma from '../lib/prisma.js'

export const getQuestions = async (req, res) => {
  const { formId } = req.params
  try {
    const form = await prisma.form.findUnique({ where: { id: parseInt(formId) } })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak' })

    const questions = await prisma.question.findMany({
      where: { formId: parseInt(formId) },
      orderBy: { order: 'asc' }
    })
    res.json(questions)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const createQuestion = async (req, res) => {
  const { formId } = req.params
  const { label, type, required, options } = req.body

  if (!label || !type) return res.status(400).json({ message: 'Label dan tipe wajib diisi' })

  const validTypes = ['short_answer', 'multiple_choice', 'checkbox', 'dropdown']
  if (!validTypes.includes(type)) return res.status(400).json({ message: 'Tipe tidak valid' })

  try {
    const form = await prisma.form.findUnique({ where: { id: parseInt(formId) } })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak' })

    const count = await prisma.question.count({ where: { formId: parseInt(formId) } })

    const question = await prisma.question.create({
      data: {
        label,
        type,
        required: required || false,
        options: options || null,
        order: count + 1,
        formId: parseInt(formId)
      }
    })
    res.status(201).json(question)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const updateQuestion = async (req, res) => {
  const { formId, questionId } = req.params
  const { label, type, required, options } = req.body

  try {
    const form = await prisma.form.findUnique({ where: { id: parseInt(formId) } })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak' })

    const question = await prisma.question.findUnique({ where: { id: parseInt(questionId) } })
    if (!question) return res.status(404).json({ message: 'Pertanyaan tidak ditemukan' })

    // Constraint: tidak boleh ubah tipe jika sudah ada submission
    if (type && type !== question.type) {
      const responseCount = await prisma.response.count({ where: { formId: parseInt(formId) } })
      if (responseCount > 0) return res.status(400).json({ message: 'Tidak bisa mengubah tipe pertanyaan karena sudah ada submission' })
    }

    const updated = await prisma.question.update({
      where: { id: parseInt(questionId) },
      data: { label, type, required, options }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const deleteQuestion = async (req, res) => {
  const { formId, questionId } = req.params

  try {
    const form = await prisma.form.findUnique({ where: { id: parseInt(formId) } })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak' })

    // Constraint: tidak boleh hapus pertanyaan jika sudah ada submission
    const responseCount = await prisma.response.count({ where: { formId: parseInt(formId) } })
    if (responseCount > 0) return res.status(400).json({ message: 'Tidak bisa menghapus pertanyaan karena sudah ada submission' })

    await prisma.question.delete({ where: { id: parseInt(questionId) } })
    res.json({ message: 'Pertanyaan berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}