import React, { useEffect, useState } from 'react'
import LeftBar from './LeftBar'
import Songs from './Songs'
import RightBar from './RightBar'
import SongBar from './SongBar'

function WebPlayer() {
  const [songs, setSongs] = useState([]);
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
          console.log("baby i need u");
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

  // const setSource = (album) => {
  //   try {
  //     return require(`../album-covers/${album.replace(/ /g, '').replace('?', '').replace('!', '')}.jpg`);
  //   }
  //   catch (err) {
  //     return null;
  //   }
  // }

  const updateCurrPlaylist = (curr_playlist) => {
    setPlaylist(curr_playlist.replace(/ /g, ""));
  }

  const handleManualQueue = (newQueue) => {
    setManualQueue(newQueue);
  }

  return (
    <div className="main-container">
      <LeftBar updateCurrPlaylist={updateCurrPlaylist} />
      <Songs songs={songs} playlist={playlist} handleManualQueue={handleManualQueue} updateCurrSong={updateCurrSong} />
      <RightBar songs={songs} index={num} curr={data} skip={skipForward} queue={queue} manualQueue={manualQueue} playlist={playlist} updateManualQueue={handleManualQueue} />
      <SongBar song={data} index={curr} start={play} length={songs.length} updateSongForward={handleSkipForward} updateSongBackward={handleSkipBackward} />
    </div>
  )
}

export default WebPlayer