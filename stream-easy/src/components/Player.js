import React from 'react'
import Song from './Song.js'
import './Player.css'

function Player() {
  return (
      <div className='main-container'>
        <div className='add-songs'>
          <div className='search-bar'>

          </div>
        </div>
        <div className='playlist-info'>
          <div className='songs'>
            <Song
                
            >

            </Song>
          </div>
        </div>
        <div className='song-player'>

        </div>
      </div>
  )
}

export default Player