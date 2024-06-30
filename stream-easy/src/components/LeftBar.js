import React from 'react'
import './LeftBar.css'

function LeftBar() {
  return (
    <div className='left-side-bar'>
      <div className='top-left-side-bar'>
        <button className='expand-playlists'>
          <i className='fas fa-book-open icon' />
          <h1>Playlists</h1>
        </button>
        <button className='add-playlists'>
          <i className="fas fa-plus icon" />
        </button>
      <div className='playlist-cards'>
        {/* put the card info of the playlists */}
      </div>
    </div>
  </div>
  )
}

export default LeftBar