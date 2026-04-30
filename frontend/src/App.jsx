import React from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from './components/UI/topbar'
import Footer from './components/UI/footer'
import ScrollToTop from './components/UI/ScrollToTop'
import { Toaster } from 'sonner'
import { ChatProvider } from './contexts/ChatContext'
import TacticalChatDrawer from './components/Crew/Chat/TacticalChatDrawer'
import { useAuthContext } from './contexts/authContext'
import PageLoader from './components/Loader/PageLoader'

const App = () => {
  const { teamId, roleLabel } = useAuthContext()
  const isPremium = roleLabel !== 'ROLE_USER';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Toaster position="top-right" theme="dark" richColors closeButton />
      <ScrollToTop />
      
      <ChatProvider teamId={teamId}>
        <Topbar />
        
        <main className="flex-1 w-full">
          <React.Suspense fallback={<PageLoader />}>
            <Outlet />
          </React.Suspense>
        </main>

        {isPremium && <TacticalChatDrawer />}
      </ChatProvider>

      <Footer />
    </div>
  )
}

export default App