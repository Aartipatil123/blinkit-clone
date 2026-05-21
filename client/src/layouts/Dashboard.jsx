import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)
  console.log("Uset dashboard",user)


  return (
    <section className='bg-white min-h-screen'>
      <div className='container mx-auto p-3 grid lg:grid-cols-[250px,1fr] gap-4'>

        {/* Left Side - User Menu */}
        <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto h-[calc(100vh-96px)] hidden lg:block border-r'>
          <UserMenu />
        </div>

        {/* Right Side - Main Content */}
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <Outlet />
        </div>

      </div>
    </section>
  )
}

export default Dashboard