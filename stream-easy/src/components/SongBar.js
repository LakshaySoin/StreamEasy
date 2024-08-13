import React, { useRef, useState, useEffect } from 'react'
import './SongBar.css'
import Duration from './Duration';

function SongBar(props) {
  const song = props.song;
  const [play, setPlay] = useState(false);
  const [time, setTime] = useState(0);
  const [index, setIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [skipForward, setSkipForward] = useState(true);
  const [skipBackward, setSkipBackward] = useState(true);
  const audioPlayer = useRef(null);

  useEffect(() => {
    if (props.index !== index) {
      setTime(0);
      if (audioPlayer.current) {
        setPlay(true);
      }
    }
    setIndex(props.index);
  }, [props.index, index]);

  useEffect(() => {
    let interval = null;

    if (play && props.start !== null) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [play, props.start]);

  const setSource = (album) => {
      try {
          return require(`../album-covers/${album.replace(/ /g, '').replace('?', '').replace('!', '')}.jpg`);
      } catch (err) {
          return null;
      }
  }

  const setSong = (song_name, artist) => {
      try {
          return require(`../songs/${song_name.replace(/ /g, '').replace('?', '').replace('!', '') + "-" + artist.replace(/ /g, '').replace('?', '').replace('!', '')}.mp3`);
      } catch (err) {
          return null;
      }
  }

  const handlePlayClick = () => {
    if (song.song_name != null) {
      setPlay(!play);
    }
  }

  const handleKeyDown = (event) => {
    if (event.code === 'Space' && song.song_name != null) {
      event.preventDefault();
      setPlay(!play);
    }
  };

  useEffect(() => {
    console.log(audioPlayer.current);
    if (audioPlayer.current) {
      if (props.start) {
        audioPlayer.current.play();
        setPlay(true);
      } else {
        audioPlayer.current.pause();
        setPlay(false);
      }
    }
  }, [props.start]);

  useEffect(() => {
    if (audioPlayer.current) {
      if (play) {
        audioPlayer.current.play();
      } else {
        audioPlayer.current.pause();
      }
    }
  }, [play]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, );

  useEffect(() => {
    const songLength = document.getElementById("duration");
    if (songLength !== null) {
      const duration = setProgressWidth(songLength.textContent);
      const width = (time / duration) * 100;
      if (duration !== time) {
        setProgress(width);
      } else {
        setTime(0);
        setPlay(false);
        document.getElementById("skipForward").click();
        // skip forward to next song
      }
    }
  }, [time]);

  const setProgressWidth = (length) => {
    const duration = +(length.charAt(0) * 60) + +(length.substring(2, length.length));
    return duration;
  };

  const skipSongForward = () => {
    setPlay(false);
    setSkipForward(!skipForward);
    props.updateSongForward(skipForward);
  }

  const skipSongBackward = () => {
    setPlay(false);
    setSkipBackward(!skipBackward);
    props.updateSongBackward(skipBackward);
  }

    return (
      <>
        <div className='song-player'>
          <div className='song-bar-info'>
            <div className='album-cover-bottom'>
              <img src={setSource(song.album)} alt={song.album} className='album-img-bottom' />
            </div>
            <div className='song-name-artist-bottom song-bar'>
              <p>{song.song_name}</p>
              <p className='faint' style={{cursor: 'auto', opacity: '0.7'}}>{song.artist}</p>
            </div>
          </div>
          <div className='controls'>
            <div className='play-start'>
              <div id="skipBackward" onClick={skipSongBackward} className='fas fa-backward faint gap'></div>
              <div onClick={handlePlayClick} className={play ? 'fas fa-pause faint gap' : 'fas fa-play faint gap'}>
                <audio ref={audioPlayer} key={props.index}>
                  <source src={setSong(song.song_name, song.artist)} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            <div id="skipForward" onClick={skipSongForward} className='fas fa-forward faint gap'></div>
            </div>
            <div className='progress-container'>
              <p>{Math.floor(time / 60)}:{Math.floor(time % 60).toString().padStart(2, '0')}</p>
              <div className='progress-bar'>
                <div className='progress' style={{width: progress + '%'}}></div>
              </div>
              <div id='duration'>
                <Duration audioPath={setSong(song.song_name, song.artist)} />
              </div>
          </div>
          </div>
          <div className='misc'>
          </div>
        </div>
      </>
    );
  }
  
  export default SongBar;