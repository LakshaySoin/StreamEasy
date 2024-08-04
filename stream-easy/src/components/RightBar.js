import React, {  useEffect, useState } from 'react'
import './RightBar.css'

const RightBar = (props) => {
    const songs = props.songs;
    const curr = props.curr;
    const playlist = props.playlist;
    const [queue, setQueue] = useState([]);
    const [manualQueue, setManualQueue] = useState([]);
    const [shuffle, setShuffle] = useState(false);
    const [currOpen, setCurrOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [openManual, setOpenManual] = useState(false);
    const [openIndex, setOpenIndex] = useState(-1);
    const [openIndexManual, setOpenIndexManual] = useState(-1);

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
            body: JSON.stringify({ shuffle: false, playlist_title: playlist.replace(/ /g, ""), index: props.index })
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
            body: JSON.stringify({ shuffle: shuffle, playlist_title: playlist.replace(/ /g, ""), index: props.index })
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

    useEffect(() => {
        setManualQueue(props.manualQueue);
    }, [props.manualQueue]);

    const setSource = (album) => {
        try {
            return require(`../album-covers/${album.replace(/ /g, '').replace('?', '').replace('!', '')}.jpg`);
        } catch (err) {
            return null;
        }
    }

    const handleOptions = (index) => {
        setOpen(prevOpen => !prevOpen);
        setOpenIndex(index);
    };

    const handleOptionsManual = (index) => {
        setOpenManual(prevOpenManual => !prevOpenManual);
        setOpenIndexManual(index);
    };

    const openCurrMenu = () => {
        setCurrOpen(!currOpen);
    };

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
            props.updateManualQueue(data);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occured trying to get the playlist data.');
        });
    };

    const clearQueue = () => {
        fetch('http://127.0.0.1:5000/clear-queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            setManualQueue([]);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occured trying to clear the queue.');
        });
    };

    const removeFromQueueManual = (index) => {
        fetch('http://127.0.0.1:5000/remove-from-queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index: index })
        })
        .then(response => response.json())
        .then(data => {
            setManualQueue(data);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occured trying to remove the song.');
        });
    };

    const removeFromQueue = (index) => {
        fetch('http://127.0.0.1:5000/remove-from-queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index: index })
        })
        .then(response => response.json())
        .then(data => {
            setQueue(data);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occured trying to remove the song.');
        });
    }

  return (
    <div id="right-bar" className='queue-container'>
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
            <div onClick={openCurrMenu} className='fas fa-ellipsis-h options'>
                {currOpen && <ul className='dropdown-menu'>
                    <li onClick={() => addToQueue(curr.id)} className='faint'>Add to Queue</li>
                </ul>}
            </div>
        </div>
        {manualQueue.length !== 0 && <div className='clear' onClick={clearQueue}>
            <p>Clear Queue</p>
        </div>}
        {manualQueue.map((song, index) => (
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
                <div onClick={() => handleOptionsManual(index)} className='fas fa-ellipsis-h options'>
                    {openManual && index === openIndexManual && <ul className='dropdown-menu'>
                        <li onClick={() => addToQueue(song.id)} className='faint'>Add to Queue</li>
                        <li onClick={() => removeFromQueueManual(index + 1)} className='faint'>Remove from Queue</li>
                    </ul>}
                </div>
            </div>
        ))}
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
                <div onClick={() => handleOptions(index)} className='fas fa-ellipsis-h options'>
                    {open && index === openIndex && <ul className='dropdown-menu'>
                        <li onClick={() => addToQueue(song.id)} className='faint'>Add to Queue</li>
                        <li onClick={() => removeFromQueue(index + 1)} className='faint'>Remove from Queue</li>
                    </ul>}
                </div>
            </div>
        ))}
    </div>
  )
}

export default RightBar