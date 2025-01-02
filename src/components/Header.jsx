import React from 'react'
import { themes } from '../utils/themes';
import { NavLink } from 'react-router';
import {NavBar} from './index';

function Header() {

  const [selectedTheme, setSelectedTheme] = React.useState('light');
  const [isSidebarOpen,setIsSidebarOpen] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  },[selectedTheme]);

  return (
    <>
      <div className="navbar sticky top-0 right-0 z-10 bg-opacity-20 backdrop-blur-lg shadow-2xl border-b-2 border-slate-600 shadow-slate-500 flex justify-between md:px-5">
        <div  className='md:hidden'>
          <label className="btn btn-circle swap swap-rotate">
            <input checked={isSidebarOpen} onChange={()=>setIsSidebarOpen(!isSidebarOpen)} type="checkbox" />
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512">
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512">
              <polygon
                points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
        </div>
        <div className='h-auto w-[12%] min-w-28'>
          <NavLink to='/'><img src="https://res.cloudinary.com/dqznmhhtv/image/upload/v1735804555/logo_vmlvzg.png" /></NavLink>
        </div>
        <div onClick={()=>setIsSidebarOpen(!isSidebarOpen)} className={`h-screen w-5/6 absolute top-16 z-20 -left-2 bg-black bg-opacity-9 text-white backdrop:blur-sm md:hidden  ${isSidebarOpen?"":"-translate-x-full"} duration-700`}>
          < NavBar/>
        </div>
        <div className='h-12 w-1/3 hidden md:block'>
          <NavBar />
        </div>
        <div className='h-12 w-36 flex flex-col justify-between'>
          <p className='h-10 w-16 font-bold font-serif  '>Theme</p>
          <select className='text-center bg-transparent ' value={selectedTheme} onChange={(e)=>setSelectedTheme(e.target.value)}>
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}

export default Header;