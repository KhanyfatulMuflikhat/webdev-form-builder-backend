import prisma from '../lib/prisma.js'

export const getForms = async (req, res) => {
  const { search, status, sort } = req.query

  try {
    const forms = await prisma.form.findMany({
      where: {
        userId: req.user.id,
        ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' }
    })
    res.json(forms)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const getFormById = async (req, res) => {
  const { id } = req.params
  try {
    const form = await prisma.form.findUnique({
      where: { id: parseInt(id) },
      include: { questions: true }
    })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak' })
    res.json(form)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const createForm = async (req, res) => {
  const { title, description } = req.body
  if (!title) return res.status(400).json({ message: 'Judul wajib diisi' })
  try {
    const form = await prisma.form.create({
      data: { title, description, userId: req.user.id }
    })
    res.status(201).json(form)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const updateForm = async (req, res) => {
  const { id } = req.params
  const { title, description, status } = req.body
  try {
    const form = await prisma.form.findUnique({ where: { id: parseInt(id) } })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak' })
    const updated = await prisma.form.update({
      where: { id: parseInt(id) },
      data: { title, description, status }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const deleteForm = async (req, res) => {
  const { id } = req.params
  try {
    const form = await prisma.form.findUnique({ where: { id: parseInt(id) } })
    if (!form) return res.status(404).json({ message: 'Form tidak ditemukan' })
    if (form.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak' })
    await prisma.form.delete({ where: { id: parseInt(id) } })
    res.json({ message: 'Form berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}