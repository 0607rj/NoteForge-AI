import axios from "axios"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice"

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(serverUrl + "/api/user/currentuser" , {withCredentials:true})
        
        dispatch(setUserData(result.data))
    } catch (error) {
        console.log(error)
    }
}

export const generateNotes = async (payload) => {
    try {
        const result = await axios.post(serverUrl+ "/api/notes/generate-notes" , payload , {withCredentials:true})
        console.log(result.data)
        return result.data

    } catch (error) {
        console.log(error)
    }
}

export const downloadPdf = async (result) => {
    try {
        const response = await axios.post(serverUrl+ "/api/pdf/generate-pdf" , {result} , {
            responseType:"blob" , withCredentials:true
        })

        const blob = new Blob([response.data], {
      type: "application/pdf"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ExamNotesAI.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
    } catch (error) {
         throw new Error("PDF download failed");

    }
}

export const summarizeYouTube = async (payload) => {
    try {
        const result = await axios.post(serverUrl+ "/api/tools/youtube-summarize" , payload , {withCredentials:true})
        return result.data
    } catch (error) {
        throw error
    }
}

export const transcribeVoice = async (formData) => {
    try {
        const result = await axios.post(serverUrl+ "/api/tools/voice-transcribe" , formData , {
            withCredentials:true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return result.data
    } catch (error) {
        throw error
    }
}

export const generateFormulaSheet = async (payload) => {
    try {
        const result = await axios.post(serverUrl+ "/api/tools/formula-sheet" , payload , {withCredentials:true})
        return result.data
    } catch (error) {
        throw error
    }
}