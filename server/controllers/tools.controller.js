import Notes from "../models/notes.model.js"
import UserModel from "../models/user.model.js"
import { generateGeminiResponse } from "../services/gemini.services.js"
import { buildPrompt } from "../utils/promptBuilder.js"

// YouTube Video Summarizer
export const summarizeYouTube = async (req, res) => {
    try {
        const { youtubeUrl, generateQuiz = true, userId } = req.body;

        if (!youtubeUrl) {
            return res.status(400).json({ message: "YouTube URL is required" })
        }

        // Extract video ID from URL
        let videoId;
        if (youtubeUrl.includes('youtube.com/watch?v=')) {
            videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
        } else if (youtubeUrl.includes('youtu.be/')) {
            videoId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0];
        }

        if (!videoId) {
            return res.status(400).json({ message: "Invalid YouTube URL" })
        }

        const user = userId ? await UserModel.findById(userId) : null;

        // Build prompt for YouTube summarization
        const prompt = `
You are a STRICT JSON generator for an educational video summarizer.

⚠️ VERY IMPORTANT:
- Output MUST be valid JSON
- Your response will be parsed using JSON.parse()
- Use ONLY double quotes "
- NO comments, NO trailing commas
- Escape line breaks using \\n

TASK:
Generate structured notes from this YouTube video: https://www.youtube.com/watch?v=${videoId}

Since I cannot fetch the actual transcript, generate a TEMPLATE response that explains the video summarizer feature.

CONTENT RULES:
- Create comprehensive notes structure
- Notes must be Markdown formatted with headings (##, ###)
- Include sub-topics with importance levels
- Add revision points
- Include sample questions
${generateQuiz ? '- Generate 5-10 MCQ questions' : '- Do NOT include MCQs'}

STRICT JSON FORMAT:
{
  "subTopics": {
    "⭐": ["topic1", "topic2"],
    "⭐⭐": ["topic3", "topic4"],
    "⭐⭐⭐": ["topic5", "topic6"]
  },
  "importance": "⭐⭐",
  "notes": "## Main Topic\\n\\nDetailed markdown content here...",
  "revisionPoints": ["point1", "point2", "point3"],
  "questions": {
    "short": ["q1?", "q2?"],
    "long": ["q1?", "q2?"],
    "diagram": "Describe relevant diagram"
  },
  "mcqs": ${generateQuiz ? '[{"question": "q?", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "why"}]' : '[]'},
  "diagram": {
    "type": "flowchart",
    "data": ""
  },
  "charts": []
}

NOTE: In production, this would use YouTube Transcript API to fetch actual video content.
For now, acknowledge that this is a demonstration of the feature structure.

RETURN ONLY VALID JSON.
`;

        const aiResponse = await generateGeminiResponse(prompt);

        // Save to database
        const notes = await Notes.create({
            user: user?._id,
            topic: `YouTube: ${videoId}`,
            classLevel: "N/A",
            examType: "Video Summary",
            revisionMode: false,
            includeDiagram: false,
            includeChart: false,
            content: aiResponse
        });

        if (user) {
            if (!Array.isArray(user.notes)) {
                user.notes = [];
            }
            user.notes.push(notes._id);
            await user.save();
        }

        return res.status(200).json({
            data: aiResponse,
            noteId: notes._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "YouTube summarization failed",
            message: error.message
        });
    }
}

// Voice to Text Transcriber
export const transcribeVoice = async (req, res) => {
    try {
        const { classLevel, subject, generateQuiz } = req.body;
        const userId = req.body.userId;

        if (!req.file) {
            return res.status(400).json({ message: "Audio file is required" })
        }

        const user = userId ? await UserModel.findById(userId) : null;

        // In production, this would use a speech-to-text API like:
        // - Google Speech-to-Text
        // - OpenAI Whisper
        // - AssemblyAI
        
        const prompt = `
You are a STRICT JSON generator for a lecture transcription system.

⚠️ VERY IMPORTANT:
- Output MUST be valid JSON
- Use ONLY double quotes "
- NO comments, NO trailing commas

TASK:
Generate structured notes from a recorded lecture.

SUBJECT: ${subject || "General"}
CLASS LEVEL: ${classLevel || "Not specified"}
GENERATE QUIZ: ${generateQuiz}

Since actual audio transcription requires additional APIs, generate a TEMPLATE that shows:
1. How transcribed content would be structured
2. Main concepts organized by importance
3. Revision points from the lecture
4. Questions based on lecture content
${generateQuiz === 'true' ? '5. Interactive quiz questions' : ''}

CONTENT RULES:
- Create detailed lecture notes (800+ words)
- Use Markdown formatting with headings
- Include examples and explanations
- Add practical applications

STRICT JSON FORMAT:
{
  "subTopics": {
    "⭐": [],
    "⭐⭐": [],
    "⭐⭐⭐": []
  },
  "importance": "⭐⭐",
  "notes": "## Lecture Notes\\n\\nTranscribed content...",
  "revisionPoints": [],
  "questions": {
    "short": [],
    "long": [],
    "diagram": ""
  },
  "mcqs": ${generateQuiz === 'true' ? '[]' : '[]'},
  "diagram": {
    "type": "flowchart",
    "data": ""
  },
  "charts": []
}

NOTE: In production, this would use Speech-to-Text API to transcribe actual audio.

RETURN ONLY VALID JSON.
`;

        const aiResponse = await generateGeminiResponse(prompt);

        const notes = await Notes.create({
            user: user?._id,
            topic: `Voice Recording: ${subject || 'Lecture'}`,
            classLevel: classLevel || "N/A",
            examType: "Transcribed Lecture",
            revisionMode: false,
            includeDiagram: false,
            includeChart: false,
            content: aiResponse
        });

        if (user) {
            if (!Array.isArray(user.notes)) {
                user.notes = [];
            }
            user.notes.push(notes._id);
            await user.save();
        }

        return res.status(200).json({
            data: aiResponse,
            noteId: notes._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Voice transcription failed",
            message: error.message
        });
    }
}

// Formula Sheet Generator
export const generateFormulaSheet = async (req, res) => {
    try {
        const { subject, chapters, classLevel, examType, userId } = req.body;

        if (!subject) {
            return res.status(400).json({ message: "Subject is required" })
        }

        const user = userId ? await UserModel.findById(userId) : null;

        const prompt = `
You are a STRICT JSON generator for a formula sheet creator.

⚠️ VERY IMPORTANT:
- Output MUST be valid JSON
- Use ONLY double quotes "
- NO comments, NO trailing commas

TASK:
Generate a comprehensive formula sheet.

SUBJECT: ${subject}
CHAPTERS: ${chapters || "All major topics"}
CLASS LEVEL: ${classLevel || "Not specified"}
EXAM TYPE: ${examType || "General"}

REQUIREMENTS:
1. List ALL important formulas for the subject
2. Organize by chapters/topics
3. Include:
   - Formula name
   - Mathematical expression
   - Variable definitions
   - Units (if applicable)
   - When to use it
4. Format in clear Markdown

FORMULA FORMAT EXAMPLE:
## Chapter Name

### Formula 1: Formula Name
- **Expression**: \\( F = ma \\)
- **Where**: 
  - F = Force (Newton)
  - m = Mass (kg)
  - a = Acceleration (m/s²)
- **Use**: Calculate force when mass and acceleration are known

STRICT JSON FORMAT:
{
  "subject": "${subject}",
  "classLevel": "${classLevel || ''}",
  "examType": "${examType || ''}",
  "formulas": "## Main Content\\n\\n### Formulas organized by chapter..."
}

Generate AT LEAST 15-20 formulas organized by topics.
Make it comprehensive and exam-ready.

RETURN ONLY VALID JSON.
`;

        const aiResponse = await generateGeminiResponse(prompt);

        const notes = await Notes.create({
            user: user?._id,
            topic: `Formula Sheet: ${subject}`,
            classLevel: classLevel || "N/A",
            examType: examType || "General",
            revisionMode: false,
            includeDiagram: false,
            includeChart: false,
            content: { 
                formulas: aiResponse.formulas || "No formulas generated",
                subject: aiResponse.subject,
                classLevel: aiResponse.classLevel,
                examType: aiResponse.examType
            }
        });

        if (user) {
            if (!Array.isArray(user.notes)) {
                user.notes = [];
            }
            user.notes.push(notes._id);
            await user.save();
        }

        return res.status(200).json({
            data: aiResponse,
            noteId: notes._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Formula sheet generation failed",
            message: error.message
        });
    }
}
