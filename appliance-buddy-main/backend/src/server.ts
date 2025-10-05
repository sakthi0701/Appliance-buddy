import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import appliancesRouter from './routes/appliances.js'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001
const NODE_ENV = process.env.NODE_ENV || 'development'

// Middleware
app.use(helmet())

// Configure CORS for Railway deployment
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(morgan('combined'))
app.use(express.json())

// Serve static files in production
if (NODE_ENV === 'production') {
  const frontendPath = path.resolve(__dirname, '../../frontend/dist')
  app.use(express.static(frontendPath))
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Appliance Buddy Backend is running' })
})

// API routes
app.use('/api/appliances', appliancesRouter)
app.use('/api', (req: Request, res: Response) => {
  res.json({ message: 'API routes available: /api/appliances' })
})

// Serve frontend in production
if (NODE_ENV === 'production') {
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'))
  })
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler for API routes only in development
if (NODE_ENV === 'development') {
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' })
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
})