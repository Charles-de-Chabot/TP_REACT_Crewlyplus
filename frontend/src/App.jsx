import React from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from './components/UI/topbar'
import Footer from './components/UI/footer'
import ScrollToTop from './components/UI/ScrollToTop'
import { Toaster } from 'sonner'
import { ChatProvider } from './contexts/ChatContext'
import TacticalChatDrawer from './components/Crew/Chat/TacticalChatDrawer'
import { useAuthContext } from './contexts/authContext'

const App = () => {
  const { teamId } = useAuthContext();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Toaster position="top-right" theme="dark" richColors closeButton />
      <ScrollToTop />
      
      <ChatProvider teamId={teamId}>
        <Topbar />
        
        <main className="flex-1 w-full">
          <Outlet />
        </main>

        <TacticalChatDrawer />
      </ChatProvider>

      <Footer />
    </div>
  )
}

export default App