import React from 'react'
import { Outlet } from 'react-router-dom'
import { IMAGE_URL } from '../../constants/apiConstant'

const HomeOffline = () => {
  return (
    <div className="flex flex-col w-screen h-screen items-center px-4 bg-black bg-opacity-50 bg-center bg-contain">
      <div className="w-full md:w-3/4 lg:w-1/2 h-screen flex flex-col justify-center items-center bg-black/80">
        <div className="w-full flex justify-center items-center py-8 rounded-lg">
          <img className="h-20 object-contain" src={`${IMAGE_URL}/logo.png`} alt="LogoCrewly" />
        </div>
        <div className="flex justify-center items-center px-4 w-full rounded-lg"></div>
        <Outlet/>
      </div>
    </div>
  )
}

export default HomeOffline