import React, { useState } from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FinalResult from '../components/FinalResult'
import { transcribeVoice } from '../services/api'

function VoiceToNotes() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [audioFile, setAudioFile] = useState(null)
  const [classLevel, setClassLevel] = useState("")
  const [subject, setSubject] = useState("")
  const [generateQuiz, setGenerateQuiz] = useState(true)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (limit to 25MB)
      if (file.size > 25 * 1024 * 1024) {
        setError("File size should be less than 25MB")
        return
      }
      setAudioFile(file)
      setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!audioFile) {
      setError("Please upload an audio file")
      return
    }

    setError("")
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('classLevel', classLevel)
      formData.append('subject', subject)
      formData.append('generateQuiz', generateQuiz)
      formData.append('userId', userData?._id || '')

      const response = await transcribeVoice(formData)
      setResult(response.data)
      setLoading(false)
      setAudioFile(null)
      setClassLevel("")
      setSubject("")
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || "Failed to transcribe audio")
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
            🎙️ Voice to Notes
          </h1>
          <p className='text-sm text-gray-300 mt-1'>
            Record lectures and convert them into structured notes
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
        <form onSubmit={handleSubmit} className="rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 p-8 shadow-2xl">
          <div className='space-y-6'>
            {/* File Upload */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>
                Upload Audio Recording
              </label>
              <div className='relative'>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className='hidden'
                  id='audio-upload'
                />
                <label
                  htmlFor='audio-upload'
                  className='w-full p-6 rounded-xl bg-white/10 backdrop-blur-lg border-2 border-dashed border-white/30 text-white text-center cursor-pointer hover:bg-white/15 transition flex flex-col items-center gap-3'
                >
                  <span className='text-4xl'>🎙️</span>
                  {audioFile ? (
                    <>
                      <span className='font-medium'>{audioFile.name}</span>
                      <span className='text-xs text-white/70'>
                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='font-medium'>Click to upload audio file</span>
                      <span className='text-xs text-white/70'>
                        Supported: MP3, WAV, M4A (Max 25MB)
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Class Level */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>
                Class Level (Optional)
              </label>
              <input
                type="text"
                className='w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-white/30'
                placeholder='e.g., Class 12, Undergraduate, Graduate'
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
              />
            </div>

            {/* Subject */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>
                Subject/Topic (Optional)
              </label>
              <input
                type="text"
                className='w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-white/30'
                placeholder='e.g., Physics, Chemistry, Computer Science'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Generate Quiz */}
            <div className='flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4'>
              <input
                type="checkbox"
                id="quiz-voice"
                checked={generateQuiz}
                onChange={(e) => setGenerateQuiz(e.target.checked)}
                className='w-5 h-5 rounded'
              />
              <label htmlFor="quiz-voice" className='text-white text-sm'>
                Generate quiz questions from transcribed content
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
                  : 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg'
                } transition-all`}
            >
              {loading ? '🎙️ Transcribing Audio...' : '🎙️ Generate Notes'}
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
          Transcribing audio and generating notes... This may take 1-2 minutes.
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
          <span className="text-6xl mb-3">🎙️</span>
          <p className="text-lg font-medium">Transcribed notes will appear here</p>
          <p className="text-sm text-gray-400 mt-2">Upload an audio recording to get started</p>
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

export default VoiceToNotes
