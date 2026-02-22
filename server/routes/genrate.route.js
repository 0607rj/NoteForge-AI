import express from "express"
import { generateNotes } from "../controllers/generate.controller.js"
import { getMyNotes, getSingleNotes } from "../controllers/notes.controller.js"



const notesRouter = express.Router()


notesRouter.post("/generate-notes",generateNotes)
notesRouter.get("/getnotes", getMyNotes)
notesRouter.get("/:id" , getSingleNotes)

export default notesRouter