import React, { useEffect, useState } from 'react'
import './Player.css'

function Player() {
  const [songs, setSongs] = useState([])
  
  useEffect(() => { 
    fetch("http://127.0.0.1:5000/webplayer/playlist-1")
      .then(response => response.json())
          .then(data => setSongs(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

  const setSource = (album) => {
    try {
      return require(`../album-covers/${album.replace(/ /g, '')}.jpg`);
    }
    catch (err) {
      return null;
    }
  }

  const playlistTitle = songs.length > 0 ? songs[0].playlist_title : '';

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
        <div className="song-list-container">
          <table>
            <thead>
              <tr>
                <th>{playlistTitle}</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={song.id} aria-rowindex={index + 1}>
                  <td>{index + 1}</td>
                  <img src={setSource(song.album)} alt={song.album} className='album-img'></img>
                  <td>{song.song_name}</td>
                  <td>{song.artist}</td>
                  <td>{song.album}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='song-player'>

        </div>
      </div>
  )
}

export default Player