import React, { useEffect, useState } from 'react'
import './Songs.css'
import Duration from './Duration';

function Songs(props) {
  const songs = props.songs;
  console.log(songs);
  console.log(props);
  const playlist = props.playlist;
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  const updateCurrSong = (index) => {
    props.updateCurrSong(index);
  }

    const getSongLength = (song_name, artist) => {
      try {
          return require(`../songs/${song_name.replace(/ /g, '') + "-" + artist.replace(/ /g, '')}.mp3`);
      } catch (err) {
          return null;
      }
    }

  const handleMouseEnter = (index) => {
    setHoveredRowIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredRowIndex(null);
  };

  const setSource = (album) => {
    try {
      return require(`../album-covers/${album.replace(/ /g, '').replace('?', '').replace('!', '')}.jpg`);
    }
    catch (err) {
      return null;
    }
  }

  const addToQueue = (id) => {
      fetch('http://127.0.0.1:5000/add-to-queue', {
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
          alert('An error occured trying to get the playlist data.');
      });
  };

  return (
    <div className='song-list-container'>
        <div className='title'>
            <h1>{playlist}</h1>
        </div>
        <div className='song-list'>
          {songs.map((song, index) => (
              <div onDoubleClick={() => updateCurrSong(index)} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave} key={index} aria-rowindex={index + 1} class="song-row">
                <div className={hoveredRowIndex === index ? 'fas fa-play index' : 'index'}>
                    {hoveredRowIndex !== index && index + 1}
                </div>
                <div className='album-cover'>
                    <img src={setSource(song.album)} alt={song.album} className='album-img'></img>
                </div>
                <div className='song-name-artist'>
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