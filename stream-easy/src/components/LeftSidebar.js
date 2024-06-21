import React from 'react'
import Card from './Card.js'
import './LeftSidebar.css'
import Button from './Button.js'

function LeftSidebar() {
  return (
      <div className='side-bar'>
        <h1>Playlists</h1>
        {/* <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn-large'
          link='/set-up'
        >

        </Button> */}
        <div className='playlists'>
          <Card
          
          >

          </Card>
        </div>
      </div>
  )
}

export default LeftSidebar