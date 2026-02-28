import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

export const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah digunakan' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Register berhasil',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login berhasil',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}