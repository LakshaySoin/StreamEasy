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
  const [skipForward, setSkipForward] = useState(false);
  const [skipBackward, setSkipBackward] = useState(false);
  const [queue, setQueue] = useState([]);
  const [manualQueue, setManualQueue] = useState([]);
  const [playlist, setPlaylist] = useState("");

  const handleSkipForward = (skipForward) => {
    setSkipForward(skipForward);
  };

  const handleSkipBackward = (skipBackward) => {
    setSkipBackward(skipBackward);
  };

  useEffect(() => {
    // basically make the data have boolean value to either set the manual queue or the regular queue, change the jsonify basically
      if (songs.length === 0) {
        return;
      }
      if (manualQueue.length === 0) {
        fetch('http://127.0.0.1:5000/skip-song-forward', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const newIndex = data.index;
            setCurr(newIndex);
            setData(data.song);
            setQueue(data.queue);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occured trying to skip to the next song.');
        });
      } else {
        fetch('http://127.0.0.1:5000/skip-song-forward-manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const newIndex = data.index;
            setCurr(newIndex);
            setData(data.song);
            setManualQueue(data.queue);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occured trying to skip to the next song.');
        });
      }
  }, [skipForward]);

  useEffect(() => {
      if (songs.length === 0) {
        return;
      }
      if (manualQueue.length === 0) {
        fetch('http://127.0.0.1:5000/skip-song-backward', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const newIndex = data.index;
            setCurr(newIndex);
            setData(data.song);
            setQueue(data.queue);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occured trying to skip to the next song.');
        });
      } else {
        fetch('http://127.0.0.1:5000/skip-song-backward-manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const newIndex = data.index;
            setCurr(newIndex);
            setData(data.song);
            setQueue(data.queue);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occured trying to skip to the next song.');
        });
      }
  }, [skipBackward]);

  useEffect(() => {
      fetch('http://127.0.0.1:5000/webplayer', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ playlist_title: playlist })
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
  }, [playlist]);

  useEffect(() => {
      fetch('http://127.0.0.1:5000/shuffle', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ shuffle: false, playlist_title: playlist, index: 0 })
      })
      .then(response => response.json())
      .then(data => {
          setQueue(data);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          alert('An error occured trying to get the playlist data.');
      });
  }, [playlist]);

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
      return require(`../album-covers/${album.replace(/ /g, '').replace('?', '').replace('!', '')}.jpg`);
    }
    catch (err) {
      return null;
    }
  }

  const updateCurrPlaylist = (curr_playlist) => {
    setPlaylist(curr_playlist.replace(/ /g, ""));
  }

  const handleManualQueue = (newQueue) => {
    setManualQueue(newQueue);
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
          setManualQueue(data);
          console.log('Success:', data);
      })
      .catch((error) => {
          console.error('Error:', error);
          alert('An error occured trying to get the playlist data.');
      });
  };


  const playlistTitle = songs.length > 0 ? songs[0].playlist_title : '';

  return (
    <div className="main-container">
      <LeftBar updateCurrPlaylist={updateCurrPlaylist} />
      <div className='song-list-container'>
          <div className='title'>
              <h1>{playlistTitle}</h1>
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
      <RightBar songs={songs} index={num} curr={data} skip={skipForward} queue={queue} manualQueue={manualQueue} playlist={playlist} updateManualQueue={handleManualQueue} />
      <SongBar song={data} index={curr} start={play} length={songs.length} updateSongForward={handleSkipForward} updateSongBackward={handleSkipBackward} />
    </div>
  )
}

export default Songs