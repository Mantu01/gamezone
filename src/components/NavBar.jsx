import React from 'react'
import { NavLink } from 'react-router'

function NavBar() {
  return (
    <>
      <div className='h-[100%] w-full flex md:justify-around gap-10 pt-10 md:pt-0 items-center text-3xl md:text-xl font-bold md:font-medium flex-col md:flex-row'>
        <NavLink to='/' className={({isActive})=>`${isActive?"text-green-600 border-green-600 border-b-4":" hover:text-orange-600"}`}>Home</NavLink>
        <NavLink to='/games' className={({isActive})=>`${isActive?"text-green-600 border-green-600 border-b-4":" hover:text-orange-600"}`}>Games</NavLink>
        <NavLink to='/help' className={({isActive})=>`${isActive?"text-green-600 border-green-600 border-b-4":" hover:text-orange-600"}`}>Help</NavLink>
        <NavLink to='/about' className={({isActive})=>`${isActive?"text-green-600 border-green-600 border-b-4":" hover:text-orange-600"}`}>About</NavLink>
      </div>
    </>
  )
}

export default NavBar;