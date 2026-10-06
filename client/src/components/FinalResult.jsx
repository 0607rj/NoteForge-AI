import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import MermaidSetup from './MermaidSetup';
import RechartSetUp from './RechartSetUp';
import { downloadPdf } from '../services/api';
import QuizMode from './QuizMode';
import NoteEditor from './NoteEditor';
const markDownComponent = {
    h1: ({ children }) => (
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-6 mb-4 border-b border-gray-200 pb-2 dark:border-gray-700">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mt-6 mb-3">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
            {children}
        </h3>
    ),
    h4: ({ children }) => (
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-2">
            {children}
        </h4>
    ),
    p: ({ children }) => (
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
            {children}
        </p>
    ),
    ul: ({ children }) => (
        <ul className="list-disc ml-6 mb-3 space-y-1 text-gray-800 dark:text-gray-200">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal ml-6 mb-3 space-y-1 text-gray-800 dark:text-gray-200">
            {children}
        </ol>
    ),
    li: ({ children }) => (
        <li className="leading-relaxed marker:text-indigo-500 dark:marker:text-indigo-300">{children}</li>
    ),
    strong: ({ children }) => (
        <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
    ),
    a: ({ children, href }) => (
        <a href={href} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-300 underline">{children}</a>
    ),
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-2 my-3 rounded-r-lg text-gray-800 dark:text-gray-200">
            {children}
        </blockquote>
    ),
    code: ({ children }) => (
        <code className="bg-gray-100 dark:bg-gray-900 text-pink-700 dark:text-pink-300 px-1.5 py-0.5 rounded font-mono text-sm">
            {children}
        </code>
    ),
    pre: ({ children }) => (
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto mb-3 [&>code]:bg-transparent [&>code]:p-0">
            {children}
        </pre>
    ),
    table: ({ children }) => (
        <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm text-gray-800 dark:text-gray-200">{children}</table>
        </div>
    ),
    th: ({ children }) => (
        <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-left font-semibold">{children}</th>
    ),
    td: ({ children }) => (
        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">{children}</td>
    ),
    hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
}
function FinalResult({ result }) {
    const [quickRevision, setQuickRevision] = useState(false);
    const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'quiz'
    const [editedNotes, setEditedNotes] = useState(result.notes);
    
    const handleNoteSave = (newContent) => {
        setEditedNotes(newContent);
    };
    
    if (
        !result ||
        !result.subTopics ||
        !result.questions ||
        !result.questions.short ||
        !result.questions.long ||
        !result.revisionPoints
    ) {
        return null;
    }

    return (
        <div className='mt-6 p-3 space-y-10 bg-white dark:bg-gray-800 transition-colors duration-300'>
            {/* Info Banner */}
            {(!result.mcqs || result.mcqs.length === 0) && (
                <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm'>
                    <p className='text-yellow-800 dark:text-yellow-200 flex items-center gap-2'>
                        <span className='text-xl'>⚠️</span>
                        <span>
                            <strong>Quick Revision Mode:</strong> These notes are concise for fast review. 
                            For detailed notes (800-1200 words) with interactive quiz questions, turn OFF "Exam Revision Mode" when generating.
                        </span>
                    </p>
                </div>
            )}
            
            {/* Tab Navigation */}
            <div className='flex gap-4 border-b border-gray-300 dark:border-gray-700 mb-6'>
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-6 py-3 font-semibold transition-colors relative
                        ${activeTab === 'notes' 
                            ? 'text-indigo-600 dark:text-indigo-400 border-b-4 border-indigo-600 dark:border-indigo-400' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                    📝 Notes
                </button>
                <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-6 py-3 font-semibold transition-colors relative flex items-center gap-2
                        ${activeTab === 'quiz' 
                            ? 'text-indigo-600 dark:text-indigo-400 border-b-4 border-indigo-600 dark:border-indigo-400' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                    🧠 Practice Quiz
                    {result.mcqs && result.mcqs.length > 0 && (
                        <span className='bg-indigo-600 text-white text-xs px-2 py-1 rounded-full'>
                            {result.mcqs.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'quiz' ? (
                <QuizMode mcqs={result.mcqs || []} />
            ) : (
            <div>

            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>

                <h2 className='text-3xl font-bold
          bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300
          bg-clip-text text-transparent'>
                    📘 Generated Notes
                </h2>

                <div className='flex gap-3'>
                    <button onClick={() => setQuickRevision(!quickRevision)} className={`
              px-4 py-2 rounded-lg text-sm font-medium transition
              ${quickRevision
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900"}
            `}>  {quickRevision ? "Exit Revision Mode" : "Quick Revision (5 min)"}</button>
                    <button onClick={()=>downloadPdf(result)}
                    className='px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700'>
                        ⬇️ Download PDF
                    </button>
                </div>
            </div>


            {!quickRevision && <section>

                <SectionHeader icon="⭐" title="Sub Topics" color="indigo" />
                {
                    Object.entries(result.subTopics).map(([star, topics]) => (
                        <div key={star} className='mb-3
              '>

                            <p className='font-medium text-indigo-700 dark:text-indigo-300 mb-1'>
                                {star} Priority
                            </p>
                            <ul className='list-disc ml-6 space-y-1 text-gray-800 dark:text-gray-200'>
                                {topics.map((t, i) => (
                                    <li key={i}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                }
            </section>}


            {!quickRevision && <section>
                <SectionHeader icon="📝" title="Detailed Notes" color="purple" />
                <NoteEditor 
                    initialNotes={editedNotes} 
                    onSave={handleNoteSave} 
                    markDownComponent={markDownComponent}
                />
            </section>}


            {quickRevision &&
                <section className='rounded-xl bg-gradient-to-r from-green-100 to-green-50 dark:from-green-950/60 dark:to-gray-800 border border-green-200 dark:border-green-800 p-6'>
                    <h3 className='font-bold text-green-700 dark:text-green-300 mb-3 text-lg'>
                        ⚡ Exam Quick Revision Points
                    </h3>
                    <ul className='list-disc ml-6 space-y-1 text-gray-800 dark:text-gray-200'>
                        {result.revisionPoints.map((p, i) => (
                            <li key={i}>{p}</li>
                        ))}
                    </ul>
                </section>}


            {result.diagram?.data && <section>
                <SectionHeader icon="📊" title="Diagram" color="cyan" />

                <MermaidSetup diagram={result.diagram?.data} />
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 italic">
                    ℹ️ If you need this diagram for future reference or revision,
                    you can save it by taking a screenshot.
                </p>

            </section>}


            {result.charts?.length > 0 &&
                <section>
                    <SectionHeader icon="📈" title="Visual Charts" color="indigo" />
                    <RechartSetUp charts={result.charts} />
                    <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 italic">
                        ℹ️ If you need this Chart for future reference or revision,
                        you can save it by taking a screenshot.
                    </p>

                </section>}

            {result.charts && result.charts.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    📉 Charts are not relevant for this topic.
                </p>
            )}


            <section>
                <SectionHeader icon="❓" title="Important Questions" color="rose" />

                <p className='font-semibold text-gray-900 dark:text-gray-100'>Short Questions:</p>
                <ul className='list-disc ml-6 space-y-1 text-gray-800 dark:text-gray-200'>
                    {result.questions.short.map((q, i) => (
                        <li key={i}>{q}</li>
                    ))}
                </ul>


                <p className='font-semibold mt-4 text-gray-900 dark:text-gray-100'>Long Questions:</p>
                <ul className='list-disc ml-6 space-y-1 text-gray-800 dark:text-gray-200'>
                    {result.questions.long.map((q, i) => (
                        <li key={i}>{q}</li>
                    ))}
                </ul>
                <p className='font-semibold mt-4 text-gray-900 dark:text-gray-100'>Diagram Question:</p>
                <ul className='list-disc ml-6 text-gray-800 dark:text-gray-200'>
                    <li>{result.questions.diagram}</li>
                </ul>

            </section>

            </div>
            )}
        </div>
    )
}


function SectionHeader({ icon, title, color }) {
    const colors = {
        indigo: "from-indigo-100 to-indigo-50 text-indigo-700",
        purple: "from-purple-100 to-purple-50 text-purple-700",
        blue: "from-blue-100 to-blue-50 text-blue-700",
        green: "from-green-100 to-green-50 text-green-700",
        cyan: "from-cyan-100 to-cyan-50 text-cyan-700",
        rose: "from-rose-100 to-rose-50 text-rose-700",
    };
    return (
        <div className={`
        mb-4 px-4 py-2 rounded-lg
        bg-gradient-to-r ${colors[color]}
        font-semibold flex items-center gap-2
      `}>
            <span>{icon}</span>
            <span>{title}</span>
        </div>

    )
}

export default FinalResult
