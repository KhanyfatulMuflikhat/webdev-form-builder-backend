import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/auth.js'
import formRoutes from './src/routes/forms.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/forms', formRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'FormBuilder API is running!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})