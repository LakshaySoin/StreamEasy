import React, { useEffect, useState } from 'react'
import './RightBar.css'

function RightBar(props) {
    const songs = props.songs;
    const curr = props.curr;
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        if (songs.playlist_title === null) {
            return;
        }
        console.log(songs.playlist_title);
        fetch('http://127.0.0.1:5000/webplayer/playlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playlist_title: songs.playlist_title })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occured trying to get the playlist data.');
        });
    }, [songs.playlist_title]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/webplayer/queue")
            .then(response => response.json())
            .then(data => setQueue(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const setSource = (album) => {
        try {
            return require(`../album-covers/${album.replace(/ /g, '')}.jpg`);
        } catch (err) {
            return null;
        }
    }

    // const queueSetUp = () => {
    //     fetch('http://127.0.0.1:5000/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ links: linksArray })
    //     })
    // }

  return (
    <div className='queue-container'>
        <p>Now Playing</p>
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
        <p>Next from: {curr.playlist_title}</p>
        {songs.map((song, index) => (
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