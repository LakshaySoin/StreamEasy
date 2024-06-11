import React from 'react'
import Button from './Button.js'
import './Intro.css'

function Intro() {
  return (
    <div className='intro-container'>
      <h1>Music Tailored to You</h1>
      <p>Dive into 1+ million songs!</p>
      <div className='intro-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn-large'
          link='/set-up'
        >
          Get Started
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn-large'
          link='webplayer'
        >
          Listen Now!
        </Button>
      </div>
    </div>
  )
}

export default Intro