import express from "express"
import { summarizeYouTube, transcribeVoice, generateFormulaSheet } from "../controllers/tools.controller.js"
import multer from "multer"

const toolsRouter = express.Router()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB limit
    }
})

// Routes
toolsRouter.post("/youtube-summarize", summarizeYouTube)
toolsRouter.post("/voice-transcribe", upload.single('audio'), transcribeVoice)
toolsRouter.post("/formula-sheet", generateFormulaSheet)

export default toolsRouter
