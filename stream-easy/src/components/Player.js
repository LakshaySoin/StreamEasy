import React, { useEffect, useState } from 'react'
import './Player.css'

function Player() {
  const [items, setItems] = useState([])
  
  useEffect(() => { 
    fetch("http://127.0.0.1:5000/webplayer/playlist-1")
      .then(response => response.json())
          .then(data => setItems(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

  return (
      <div className='main-container'>
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
          </div>
          {/* <Card
          
          >

          </Card> */}
        </div>
      </div>
        {/* <div className='add-songs'>
          <div className='search-bar'>

          </div>
        </div> */}
        <div className='playlist-info'>
            <h1>{items.playlist_name}</h1>
          <div className='songs'>
            <ul>
              {items.map(item => (
                <li> 
                  <h2>{item.song_name}</h2>
                  <p>{item.artist}</p>
                  <p>{item.album}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='song-player'>

        </div>
      </div>
  )
}

export default Player