import React, { useState } from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FinalResult from '../components/FinalResult'
import { summarizeYouTube } from '../services/api'

function YouTubeSummarizer() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [generateQuiz, setGenerateQuiz] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    // Basic YouTube URL validation
    if (!youtubeUrl.includes('youtube.com/') && !youtubeUrl.includes('youtu.be/')) {
      setError("Please enter a valid YouTube URL")
      return
    }

    setError("")
    setLoading(true)
    setResult(null)

    try {
      const response = await summarizeYouTube({
        youtubeUrl,
        generateQuiz,
        userId: userData?._id
      })
      setResult(response.data)
      setLoading(false)
      setYoutubeUrl("")
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || "Failed to summarize video")
      setLoading(false)
    }
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
            🎥 YouTube Summarizer
          </h1>
          <p className='text-sm text-gray-300 mt-1'>
            Turn YouTube lectures into structured notes with quiz
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
        <form onSubmit={handleSubmit} className="rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 p-8 shadow-2xl">
          <div className='space-y-6'>
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>
                YouTube Video URL
              </label>
              <input
                type="text"
                className='w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-white/30'
                placeholder='https://www.youtube.com/watch?v=...'
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <p className='text-xs text-white/70 mt-2'>
                Paste any YouTube video URL (lectures, tutorials, educational content)
              </p>
            </div>

            <div className='flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4'>
              <input
                type="checkbox"
                id="quiz"
                checked={generateQuiz}
                onChange={(e) => setGenerateQuiz(e.target.checked)}
                className='w-5 h-5 rounded'
              />
              <label htmlFor="quiz" className='text-white text-sm'>
                Generate interactive quiz questions from video content
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className={`w-full py-4 rounded-xl font-semibold text-lg
                ${loading 
                  ? 'bg-white/20 cursor-not-allowed text-white/50' 
                  : 'bg-white text-red-600 hover:bg-gray-100 shadow-lg'
                } transition-all`}
            >
              {loading ? '🎬 Summarizing Video...' : '🎬 Summarize Video'}
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
          Extracting transcript and generating notes... This may take 30-60 seconds.
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
          <span className="text-6xl mb-3">🎥</span>
          <p className="text-lg font-medium">Video summary will appear here</p>
          <p className="text-sm text-gray-400 mt-2">Paste a YouTube URL above to get started</p>
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
          <FinalResult result={result} />
        </motion.div>
      )}
    </div>
  )
}

export default YouTubeSummarizer
