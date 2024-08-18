import React, { useState } from 'react'
import './Songs.css'
import Duration from './Duration';

function Songs(props) {
  const songs = props.songs;
  const playlist = props.playlist;
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  const updateCurrSong = (index) => {
    props.updateCurrSong(index);
  }

  const getSongLength = (song_name, artist) => { 
    if (!song_name || !artist) {
      return null;
    }
    const songName = song_name.replace(/ /g, '').replace(/[?!]/g, '');
    const artistName = artist.replace(/ /g, '').replace(/[?!]/g, '');
    const filename = `${songName}-${artistName}.mp3`;
    const songUrl = `http://127.0.0.1:5050/songs/${filename}`;
    return songUrl;
  }

  const handleMouseEnter = (index) => {
    setHoveredRowIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredRowIndex(null);
  };

  const setSource = (album) => {
    if (!album) {
      return null;
    }
    const filename = album.replace(/ /g, '').replace(/[?!]/g, '') + '.jpg';
    const albumUrl = `http://127.0.0.1:5050/album-covers/${filename}`;
    return albumUrl;
  }

  const addToQueue = (id) => {
      fetch('http://127.0.0.1:5050/add-to-queue', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ playlist_title: playlist, id: id })
      })
      .then(response => response.json())
      .then(data => {
          props.handleManualQueue(data);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          console.log('An error occured trying to get the playlist data.');
      });
  };

  return (
    <div className='song-list-container'>
        <div className='title'>
            <h1>{playlist}</h1>
        </div>
        <div className='song-list'>
          {Array.isArray(songs) && songs.map((song, index) => (
              <div onDoubleClick={() => updateCurrSong(index)} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave} key={index} aria-rowindex={index + 1} class="song-row">
                <div className={hoveredRowIndex === index ? 'fas fa-play index' : 'index'}>
                    {hoveredRowIndex !== index && index + 1}
                </div>
                <div className='album-cover'>
                    <img src={setSource(song.album)} alt={song.album} className='album-img'></img>
                </div>
                <div className='song-name-artist-main'>
                    <p>{song.song_name}</p>
                    <p className={hoveredRowIndex !== index && 'faint'}>{song.artist}</p>
                </div>
                <div className={hoveredRowIndex !== index ? 'album-name faint' : 'album-name'}>
                    <p>{song.album}</p>
                </div>
                <div style={{'padding-right': '30px'}} className={hoveredRowIndex !== index ? 'duration faint' : 'duration'}>
                  <Duration audioPath={getSongLength(song.song_name, song.artist)} />
                </div>
                <button onClick={() => addToQueue(song.id)} className='add-queue'>
                  <i className='fas fa-plus icon'></i>
                </button>
              </div>
          ))}
        </div>
    </div>
  )
}

export default Songs