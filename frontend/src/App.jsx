import React from 'react'
import Topbar from './components/UI/topbar'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div className="relative flex">
      <div className="flex-1 flex flex-col bg-linear-to-b from-black to-[rgb(18,18,18)]">
        {/*  topbar: barre suppérieur */}
        <Topbar/>

        <div className="h-[calc(100vh-64px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-4 text-white">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App