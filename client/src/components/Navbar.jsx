import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import logo from "../assets/logo.png"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { IoMoon, IoSunny } from "react-icons/io5"

function Navbar() {
    const { userData } = useSelector((state) => state.user)
    const [showProfile,setShowProfile] = useState(false)
    const { isDark, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSignOut = async () => {
        try {
            await axios.get(serverUrl+ "/api/auth/logout" , {withCredentials:true})
            dispatch(setUserData(null))
            navigate("/auth")
            
            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className='relative z-20 mx-6 mt-6
        rounded-2xl
        bg-gradient-to-br from-black/90 via-black/80 to-black/90
        backdrop-blur-2xl
        border border-white/10
        shadow-[0_22px_55px_rgba(0,0,0,0.75)]
        flex items-center justify-between px-8 py-4'>

            <div className='flex items-center gap-3'>
                <img src={logo} alt="examnotes" className='w-9 h-9' />
                <span className='text-lg hidden md:block font-semibold text-white'>
                    ExamNotes <span className='text-gray-400'>AI</span>
                </span>
            </div>

            <div className='flex items-center gap-6 relative'>
                 {/* Dark Mode Toggle */}
                 <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center justify-center
                    w-10 h-10 rounded-full
                    bg-white/10
                    border border-white/20
                    text-white text-xl
                    hover:bg-white/20
                    transition-colors'>
                    {isDark ? <IoSunny /> : <IoMoon />}
                </motion.button>

                 <div className='relative'>

                    <motion.div
                    onClick={()=>{setShowProfile(!showProfile)}}
                     whileHover={{scale:1.1}}
                    whileTap={{scale:0.97}}
                     className='flex items-center justify-center gap-1
                px-4 py-2 rounded-full
                bg-white/10
                border border-white/20
                text-white text-sm
                shadow-md
                cursor-pointer'>
                    <span className='text-lg'>{userData?.name.slice(0,1).toUpperCase()}</span>
                   

                    </motion.div>
                    <AnimatePresence>
                    
                    {showProfile && 
                  
                    <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 10, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                    className='absolute right-0 mt-4 w-52
                    rounded-2xl
                    bg-black/90 backdrop-blur-xl
                    border border-white/10
                    shadow-[0_25px_60px_rgba(0,0,0,0.7)]
                    p-4 text-white'>

                       <MenuItem text="History" onClick={()=>{setShowProfile(false);navigate("/history")}}/>
                       <div className="h-px bg-white/10 mx-3" />
                       <MenuItem text="sign out" red  onClick={handleSignOut}/>
                       



                    </motion.div>
                    }</AnimatePresence>

                    
                </div>
            </div>


        </motion.div>
    )
}

function MenuItem ({onClick , text , red}){
    return(
        <div
        onClick={onClick} className={`
        w-full text-left px-5 py-3 text-sm
        transition-colors rounded-lg
        ${
          red
            ? "text-red-400 hover:bg-red-500/10"
            : "text-gray-200 hover:bg-white/10"
        }
      `}>
        {text}

        </div>
    )
}


export default Navbar
