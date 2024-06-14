import React from 'react'
import Card from '../Card.js'
import Song from '../Song.js'

function Webplayer() {
  return (
    <>
      <div className='side-bar'>
        <div className='playlists'>
          <Card
          
          >

          </Card>
        </div>
      </div>
      <div className='main-container'>
        <div className='playlist-info'>
          <div className='songs'>
            <Song
                
            >

            </Song>
          </div>
        </div>
        <div className='add-songs'>
          <div className='search-bar'>

          </div>
        </div>
      </div>
    </>
  )
}

export default Webplayer