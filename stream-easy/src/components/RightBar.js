import React, {  useEffect, useState } from 'react'
import './RightBar.css'

const RightBar = (props) => {
    const songs = props.songs;
    const curr = props.curr;
    const [queue, setQueue] = useState([]);
    const [shuffle, setShuffle] = useState(false);

    const shufflePlaylist = () => {
        setShuffle(!shuffle);
    };

    useEffect(() => {
        if (songs.playlist_title === null) {
            return;
        }
        fetch('http://127.0.0.1:5000/shuffle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ shuffle: false, playlist_title: songs.playlist_title, index: props.index })
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
    }, [songs.playlist_title, props.index]);

    useEffect(() => {
        if (songs.playlist_title === null) {
            return;
        }
        fetch('http://127.0.0.1:5000/shuffle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ shuffle: shuffle, playlist_title: songs.playlist_title, index: props.index })
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
    }, [shuffle]);

    useEffect(() => {
        setQueue(props.queue);
    }, [props.queue]);

    const setSource = (album) => {
        try {
            return require(`../album-covers/${album.replace(/ /g, '')}.jpg`);
        } catch (err) {
            return null;
        }
    }

  return (
    <div className='queue-container'>
        <p className='queue-text'>Now Playing</p>
        <div className='queue-row'>
            <div className='song-info'>
                <div className='album-cover'>
                    <img src={setSource(curr.album)} alt={curr.album} className='album-img'></img>
                </div>
                <div className='song-name-artist'>
                    <p>{curr.song_name}</p>
                    <p className='faint'>{curr.artist}</p>
                </div>
            </div>
            <div className='fas fa-ellipsis-h options faint'></div>
        </div>
        <div className='shuffle-playlist'>
            <p className='queue-text'>Next from: {curr.playlist_title}</p>
            <div onClick={shufflePlaylist} className={shuffle ? 'fas fa-random faint clicked shuffle-button' : 'fas fa-random faint shuffle-button'}></div>
        </div>
        {queue.map((song, index) => (
            <div key={song.id} aria-rowindex={index + 1} class="queue-row">
                <div className='song-info'>
                    <div className='album-cover'>
                        <img src={setSource(song.album)} alt={song.album} className='album-img'></img>
                    </div>
                    <div className='song-name-artist'>
                        <p>{song.song_name}</p>
                        <p className='faint'>{song.artist}</p>
                    </div>
                </div>
                <div className='fas fa-ellipsis-h options faint'></div>
            </div>
        ))}
    </div>
  )
}

export default RightBar