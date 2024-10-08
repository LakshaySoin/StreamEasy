import React, { useEffect, useState } from 'react'
import './LeftBar.css'

function LeftBar(props) {
  const [playlists, setPlaylists] = useState([]);

  const setSource = (album) => {
    let album_name = album.album;
    console.log(album_name);
    try {
        const filename = album_name.replace(/ /g, '').replace(/[?!]/g, '') + '.jpg';
        const albumUrl = `http://127.0.0.1:5050/album-covers/${filename}`;
        return albumUrl;
    } catch (err) {
        return null;
    }
  }

  useEffect(() => {
      fetch('http://127.0.0.1:5050/get-playlists', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(data => {
          setPlaylists(data);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          console.log('An error occured trying to get the playlist cards.');
      });
  }, []);

  const changePlaylist = (playlist_name) => {
    console.log(playlist_name);
    props.updateCurrPlaylist(playlist_name);
  }

  return (
    <>
      <div className='left-side-bar'>
        <div className='top-left-side-bar'>
          <button className='expand-playlists'>
            <i className='fas fa-book-open icon' />
            <h1>Playlists</h1>
          </button>
          {/* <button className='add-playlists'>
            <i className="fas fa-plus icon" />
          </button> */}
        </div>
          {Array.isArray(playlists) && playlists.length !== 0 && playlists.map((playlist, index) => (
            <div key={index} className='playlist-cards'>
              <div onClick={() => changePlaylist(playlist.name)} aria-rowindex={index + 1} className="card-row">
                <div className='card-image'>
                    {playlist.albums.map((album)  => (
                      <img src={setSource(album)} alt={album} className='playlist-image'></img>
                    ))}
                </div>
                <div className='card-name'>
                  <p>{playlist.name}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default LeftBar