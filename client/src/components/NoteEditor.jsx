import React, { useState } from 'react'
import { motion } from "motion/react"
import { FiEdit2, FiSave, FiX } from "react-icons/fi"
import ReactMarkdown from 'react-markdown'

function NoteEditor({ initialNotes, onSave, markDownComponent }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(initialNotes)

  const handleSave = () => {
    onSave(editedContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedContent(initialNotes)
    setIsEditing(false)
  }

  return (
    <div className="relative">
      {/* Edit Controls */}
      <div className="flex justify-end gap-2 mb-4">
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            <FiEdit2 />
            Edit Notes
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <FiSave />
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <FiX />
              Cancel
            </motion.button>
          </>
        )}
      </div>

      {/* Content Area */}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full min-h-[500px] p-6 rounded-xl border-2 border-indigo-500 focus:border-indigo-600 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-y"
          placeholder="Edit your notes here (Markdown supported)..."
        />
      ) : (
        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6'>
          <ReactMarkdown components={markDownComponent}>
            {editedContent}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default NoteEditor
