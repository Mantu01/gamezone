import React from 'react'
import { NavLink } from 'react-router';

function Home() {
  return (
    <>
      <>
        <div className='h-[90vh] w-full p-5 flex flex-col items-center'>
          <h1 className="text-2xl md:text-4xl font-bold mb-8">Welcome to the Game Zone!</h1>
          <div className='h-[75%] md:h-[90%] w-full md:w-[70%] grid grid-cols-1 md:grid-cols-2 shadow-2xl shadow-black'>
            <div className='flex flex-col items-center pt-10 gap-1'>
              <img className='h-32 w-32 md:h-60 md:w-60 rounded-full border-2 border-black' src="https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg" />
              <p>Mantu Kumar</p>
            </div>
            <div className='flex flex-col items-center gap-5'>
              <label className="swap">
                <input type="checkbox" />
                <svg
                  className="swap-on fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24">
                  <path
                    d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                </svg>
                <svg
                  className="swap-off fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24">
                  <path
                    d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
                </svg>
              </label>
              
            </div>
          </div>
        </div>
      </>
    </>
  )
}

export default Home;