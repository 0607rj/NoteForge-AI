import express from "express"
import { pdfDownload } from "../controllers/pdf.controller.js"



const pdfRouter = express.Router()


pdfRouter.post("/generate-pdf",pdfDownload)

export default pdfRouter