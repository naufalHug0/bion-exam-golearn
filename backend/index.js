import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'

import authRoutes from './src/routes/authRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js'
import interactionRoutes from './src/routes/interactionRoutes.js'
import subjectRoutes from './src/routes/subjectRoutes.js'
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/migrate', adminRoutes);

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(notFound)
app.use(errorHandler)

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB')
    const PORT = process.env.PORT || 5001
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
.catch(err => console.error('Could not connect to MongoDB', err))