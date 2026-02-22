import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"

function QuizMode({ mcqs }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  if (!mcqs || mcqs.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-indigo-200 dark:border-gray-700">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
          No Quiz Questions Available
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Quiz questions are generated when <strong>Exam Revision Mode is OFF</strong>.
        </p>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 max-w-md mx-auto text-left">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            💡 <strong>Tip:</strong> To get interactive quiz questions:
          </p>
          <ol className="text-sm text-gray-600 dark:text-gray-300 mt-2 ml-4 list-decimal space-y-1">
            <li>Go back to the form</li>
            <li>Turn OFF "Exam Revision Mode"</li>
            <li>Generate notes again</li>
          </ol>
        </div>
      </div>
    )
  }

  const currentMCQ = mcqs[currentQuestion]

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return; // Already answered
    
    setSelectedAnswer(index)
    setShowExplanation(true)
    
    if (index === currentMCQ.correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizComplete(false)
  }

  if (quizComplete) {
    const percentage = Math.round((score / mcqs.length) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 bg-gradient-to-br from-black/90 via-black/80 to-black/90 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-white/10">
        <h2 className="text-4xl font-bold text-white mb-4">🎉 Quiz Complete!</h2>
        <p className="text-6xl font-extrabold text-white mb-2">{score}/{mcqs.length}</p>
        <p className="text-2xl text-gray-300 mb-8">{percentage}%</p>
        <div className="mb-6">
          {percentage >= 80 && <p className="text-green-400 text-xl">🌟 Excellent Work!</p>}
          {percentage >= 60 && percentage < 80 && <p className="text-blue-400 text-xl">👍 Good Job!</p>}
          {percentage < 60 && <p className="text-yellow-400 text-xl">📚 Keep Practicing!</p>}
        </div>
        <button
          onClick={handleRestart}
          className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors">
          Restart Quiz
        </button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {mcqs.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / mcqs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-gradient-to-br from-black/90 via-black/80 to-black/90 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-white/10 shadow-2xl">
          
          <h3 className="text-2xl font-bold text-white mb-6">
            {currentMCQ.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentMCQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentMCQ.correct
              const showResult = selectedAnswer !== null

              return (
                <motion.button
                  key={index}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-xl font-medium transition-all border-2
                    ${!showResult ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : ''}
                    ${showResult && isCorrect ? 'bg-green-500/20 border-green-500 text-green-300' : ''}
                    ${showResult && isSelected && !isCorrect ? 'bg-red-500/20 border-red-500 text-red-300' : ''}
                    ${showResult && !isSelected && !isCorrect ? 'bg-white/5 border-white/10 text-gray-400' : ''}
                  `}>
                  <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                  {showResult && isCorrect && <span className="float-right">✓</span>}
                  {showResult && isSelected && !isCorrect && <span className="float-right">✗</span>}
                </motion.button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-blue-300 mb-1">Explanation:</p>
                <p className="text-gray-300 text-sm">{currentMCQ.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {selectedAnswer !== null && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors">
              {currentQuestion < mcqs.length - 1 ? 'Next Question →' : 'Finish Quiz'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default QuizMode
