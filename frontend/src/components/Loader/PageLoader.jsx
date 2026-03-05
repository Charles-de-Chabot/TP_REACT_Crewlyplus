import React from 'react'
import { BounceLoader } from 'react-spinners'

const PageLoader = () => {
  return (
    <div className='bg-black flex flex-col items-center justify-center h-screen'>
        <BounceLoader
        size={80}
        color="rgba(30,215,96,1)"
        />
        
    </div>
  )
}

export default PageLoader