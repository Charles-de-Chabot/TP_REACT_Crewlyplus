// App.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from './components/UI/topbar'
import Footer from './components/UI/footer'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Topbar />
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default App