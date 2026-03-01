import prisma from '../lib/prisma.js'

export const getSubmissions = async (req, res) => {
  const { formId } = req.params

  try {
    const form = await prisma.form.findUnique({ where: { id: parseInt(formId) } })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak' })

    const submissions = await prisma.response.findMany({
      where: { formId: parseInt(formId) },
      orderBy: { submittedAt: 'desc' },
      include: {
        answers: {
          include: { question: true }
        }
      }
    })

    res.json(submissions)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const getSubmissionById = async (req, res) => {
  const { formId, submissionId } = req.params

  try {
    const form = await prisma.form.findUnique({ where: { id: parseInt(formId) } })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak' })

    const submission = await prisma.response.findUnique({
      where: { id: parseInt(submissionId) },
      include: {
        answers: {
          include: { question: true }
        }
      }
    })

    if (!submission) return res.status(404).json({ message: 'Submission tidak ditemukan' })
    if (submission.formId !== parseInt(formId)) return res.status(403).json({ message: 'Akses ditolak' })

    res.json(submission)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}