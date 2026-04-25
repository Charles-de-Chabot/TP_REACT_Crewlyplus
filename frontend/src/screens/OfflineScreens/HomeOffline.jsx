import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import ScrollToTop from '../../components/UI/ScrollToTop'
import { IMAGE_URL } from '../../constants/apiConstant'
import { IMG_LOGO } from '../../constants/appConstant'

const HomeOffline = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen items-center justify-center bg-slate-950 relative overflow-y-auto hide-scrollbar py-10">
      <ScrollToTop />
      {/* Fond avec gradients subtiles bleu marine */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#020617] z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-950/30 via-transparent to-transparent z-0"></div>
      
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-4">
        <div className="w-full flex justify-center items-center mb-8 animate-fade-in-down">
          <Link to="/" className="cursor-pointer hover:scale-105 transition-transform duration-300">
            <img className="h-16 md:h-20 object-contain drop-shadow-2xl filter brightness-110" src={`${IMG_LOGO}`} alt="Crewly" />
          </Link>
        </div>
        <div className="w-full flex justify-center">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default HomeOffline