import React, { useEffect, useState } from 'react'
import './Songs.css'
import SongBar from './SongBar';
import RightBar from './RightBar';
import LeftBar from './LeftBar';
import Duration from './Duration';

function Songs() {
  const [songs, setSongs] = useState([]);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const [data, setData] = useState([]);
  const [num, setNum] = useState(0);
  const [curr, setCurr] = useState(-1);
  const [play, setPlay] = useState(false);
  const [skip, setSkip] = useState(false);
  const [queue, setQueue] = useState([]);

  const handleSkip = (skip) => {
    setSkip(skip);
  };

  useEffect(() => {
      console.log(songs[0]);
      if (songs.length === 0) {
        return;
      }
      fetch('http://127.0.0.1:5000/skip-song', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => {
          const newIndex = data.index;
          setCurr(newIndex);
          setData(songs[newIndex]);
          setQueue(data.queue);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          alert('An error occured trying to skip to the next song.');
      });
  }, [skip]);

  useEffect(() => {
      if (songs.playlist_title === null) {
          return;
      }
      fetch('http://127.0.0.1:5000/webplayer', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ playlist_title: songs.playlist_title })
      })
      .then(response => response.json())
      .then(data => {
          setSongs(data);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          alert('An error occured trying to get the playlist data.');
      });
  }, [songs.playlist_title]);

  const updateCurrSong = (index) => {
      setNum(index);
      setCurr(index);
      setData(songs[index]);
      setPlay(prevPlay => !prevPlay);
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
      return require(`../album-covers/${album.replace(/ /g, '')}.jpg`);
    }
    catch (err) {
      return null;
    }
  }

  const playlistTitle = songs.length > 0 ? songs[0].playlist_title : '';

  return (
    <div className="main-container">
      <LeftBar />
      <div className='song-list-container'>
          <div className='title'>
              <h1>{playlistTitle}</h1>
          </div>
          <div className='song-list'>
            {songs.map((song, index) => (
                <div onClick={() => updateCurrSong(index)} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave} key={index} aria-rowindex={index + 1} class="song-row">
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
                  <div className={hoveredRowIndex !== index ? 'duration faint' : 'duration'}>
                    <Duration audioPath={getSongLength(song.song_name, song.artist)} />
                  </div>
                </div>
            ))}
          </div>
      </div>
      <RightBar songs={songs} index={num} curr={data} skip={skip} queue={queue} />
      <SongBar song={data} index={curr} start={play} length={songs.length} updateSong={handleSkip} />
    </div>
  )
}

export default Songs