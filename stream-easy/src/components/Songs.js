import React, { useEffect, useState } from 'react'
import './Songs.css'

function Songs() {
  const [songs, setSongs] = useState([])
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const [play, setPlay] = useState(false);
  
  useEffect(() => { 
    fetch("http://127.0.0.1:5000/webplayer/playlist-1")
        .then(response => response.json())
        .then(data => setSongs(data))
        .catch(error => console.error('Error fetching data:', error));
      }, []
    );

  const handleMouseEnter = (index) => {
    setHoveredRowIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredRowIndex(null);
  };

  const playSong = (song) => {
        fetch('http://127.0.0.1:5000/webplayer/playlist-1/song-1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ songName: song })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setPlay(true); 
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while trying to send the links. Please wait to try again.');
        });
  };

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
    <div className='song-list-container'>
        <div className='title'>
            <h1>{playlistTitle}</h1>
        </div>
        <div className='song-list'>
        {songs.map((song, index) => (
            <div onClick={playSong(song.song_name)} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave} key={song.id} aria-rowindex={index + 1} class="song-row">
            <div class={hoveredRowIndex === index ? 'fas fa-play index' : 'index'}>
                {hoveredRowIndex !== index && index + 1}
            </div>
            <div class='album-cover'>
                <img src={setSource(song.album)} alt={song.album} className='album-img'></img>
            </div>
            <div class='song-name-artist'>
                <p>{song.song_name}</p>
                <p className={hoveredRowIndex !== index && 'faint'}>{song.artist}</p>
            </div>
            <div class={hoveredRowIndex !== index ? 'album-name faint' : 'album-name'}>
                <p>{song.album}</p>
            </div>
            </div>
        ))}
        </div>
        <div class='song-player'>

        </div>
    </div>
  )
}

export default Songs