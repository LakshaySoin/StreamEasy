import React, { useState } from 'react'
import './Form.css'
import { Link } from 'react-router-dom';

function Form() {
    const [links, setLinks] = useState('');
    const [update, setUpdate] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const linksArray = links.split('\n').filter(link => link.trim() !== '');
        fetch('http://127.0.0.1:5000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ links: linksArray })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setUpdate(true); 
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while trying to send the links. Please wait to try again.');
        });
    };

  return (
    <div className='form-background'>
        <div className='form-container'>
            {!update && <h1>Transfer Spotify Playlists</h1>}
            {!update && <form onSubmit={handleSubmit}>
                <textarea
                    type='text'
                    className='playlists'
                    placeholder={`https://spotify.com/playlist-1\nhttps://spotify.com/playlist-2\n...`}
                    value={links}
                    onChange={(e) => setLinks(e.target.value)}
                />
                <input 
                    type='submit'
                    className='curr-btn' 
                />
            </form>}
            {update && <div className='downloading-container'> 
            <h1>
                Succesful Transfer!
            </h1>
            <Link 
                to='webplayer'
                className='curr-link'
            >
                <button
                    className='curr-btn'
                >
                    Go to webplayer!
                </button>
            </Link>
            </div>}
        </div>
    </div>
  )
}

export default Form