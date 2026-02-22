import React, { useState } from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { generateFormulaSheet } from '../services/api'
import ReactMarkdown from 'react-markdown'

function FormulaSheet() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  
  const [subject, setSubject] = useState("")
  const [chapters, setChapters] = useState("")
  const [classLevel, setClassLevel] = useState("")
  const [examType, setExamType] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!subject.trim()) {
      setError("Please enter a subject")
      return
    }

    setError("")
    setLoading(true)
    setResult(null)

    try {
      const response = await generateFormulaSheet({
        subject,
        chapters,
        classLevel,
        examType,
        userId: userData?._id
      })
      setResult(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || "Failed to generate formula sheet")
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    // This will be implemented with the backend PDF generator
    alert("PDF download will be implemented shortly!")
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-8'>
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-6 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex md:items-center justify-between gap-4 flex-col md:flex-row"
      >
        <div onClick={() => navigate("/")} className='cursor-pointer'>
          <h1 className='text-2xl font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent'>
            🧮 Formula Sheet Generator
          </h1>
          <p className='text-sm text-gray-300 mt-1'>
            Extract all formulas and equations into one printable sheet
          </p>
        </div>

        <button
          onClick={() => navigate("/history")}
          className='px-4 py-3 rounded-full text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center gap-2'
        >
          📚 Your Notes
        </button>
      </motion.header>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-12"
      >
        <form onSubmit={handleSubmit} className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 shadow-2xl">
          <div className='space-y-6'>
            {/* Subject */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>
                Subject *
              </label>
              <input
                type="text"
                className='w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-white/30'
                placeholder='e.g., Physics, Mathematics, Chemistry'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            {/* Chapters */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>
                Chapters/Topics (Optional)
              </label>
              <textarea
                className='w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[100px]'
                placeholder='Enter chapters separated by commas&#10;e.g., Thermodynamics, Optics, Electromagnetism'
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
              />
              <p className='text-xs text-white/70 mt-2'>
                Leave blank to generate all major formulas for the subject
              </p>
            </div>

            {/* Class Level */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>
                Class Level (Optional)
              </label>
              <input
                type="text"
                className='w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-white/30'
                placeholder='e.g., Class 11, Class 12, Undergraduate'
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
              />
            </div>

            {/* Exam Type */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>
                Exam Type (Optional)
              </label>
              <input
                type="text"
                className='w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-white/30'
                placeholder='e.g., JEE, NEET, CBSE, SAT'
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className={`w-full py-4 rounded-xl font-semibold text-lg
                ${loading 
                  ? 'bg-white/20 cursor-not-allowed text-white/50' 
                  : 'bg-white text-green-600 hover:bg-gray-100 shadow-lg'
                } transition-all`}
            >
              {loading ? '🧮 Generating Formulas...' : '🧮 Generate Formula Sheet'}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-center text-black font-medium mb-6"
        >
          Generating formula sheet... This may take 20-30 seconds.
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 text-center">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="max-w-3xl mx-auto h-64 rounded-2xl flex flex-col items-center justify-center bg-white/60 backdrop-blur-lg border border-dashed border-gray-300 text-gray-500 shadow-inner"
        >
          <span className="text-6xl mb-3">🧮</span>
          <p className="text-lg font-medium">Formula sheet will appear here</p>
          <p className="text-sm text-gray-400 mt-2">Enter subject details above to get started</p>
        </motion.div>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='max-w-5xl mx-auto'
        >
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl'>
            {/* Header */}
            <div className='flex justify-between items-start mb-8'>
              <div>
                <h2 className='text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2'>
                  📑 {result.subject} Formula Sheet
                </h2>
                {result.classLevel && (
                  <p className='text-gray-600 dark:text-gray-400'>
                    {result.classLevel} {result.examType && `• ${result.examType}`}
                  </p>
                )}
              </div>
              <button
                onClick={downloadPDF}
                className='px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition'
              >
                ⬇️ Download PDF
              </button>
            </div>

            {/* Formula Content */}
            <div className='prose prose-lg max-w-none dark:prose-invert'>
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mt-8 mb-4 border-b-2 border-green-200 dark:border-green-800 pb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-none space-y-2 ml-0">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-gray-800 dark:text-gray-200">
                      {children}
                    </li>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-green-600 dark:text-green-400 font-mono text-sm">
                      {children}
                    </code>
                  )
                }}
              >
                {result.formulas}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default FormulaSheet
