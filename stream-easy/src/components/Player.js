// import React, { useEffect, useState } from 'react'
import React from 'react'
import './Player.css'
import Songs from './Songs'
import LeftBar from './LeftBar'

function Player() {
  return (
      <div className='main-container'>
        <LeftBar />
        <Songs />
        <div className='song-player'>

        </div>
      </div>
  )
}

export default Player