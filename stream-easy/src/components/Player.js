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
        <div className='side-bar'>
        <h1>Playlists</h1>
        {/* <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn-large'
          link='/set-up'
        >

        </Button> */}
        <div className='playlist-cards'>
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