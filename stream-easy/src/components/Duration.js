import React, { useState, useEffect } from 'react';

const Duration = ({ audioPath }) => {
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    const audio = new Audio(audioPath);

    // Event listener to update duration once the metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      audio.removeEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
    };
  }, [audioPath]);

  return (
    <div>
      {duration !== null ? 
        <p>
            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
        </p> : <p>0:00</p>}
    </div>
  );
};

export default Duration;