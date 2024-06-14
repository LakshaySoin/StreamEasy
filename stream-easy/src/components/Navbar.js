import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../logo-removebg-preview.png'

function Navbar() {
  const [click, setClick] = useState(false);
  const [link, setLink] = useState(true);

  const handleClick = () => {
    setClick(!click)
    setLink(!link)
  };

  const closeMobileMenu = () => {
    setClick(false);
    if (window.innerWidth <= 960) {
      setLink(!link);
    } else {
      setLink(true);
    }
  }

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setLink(false);
    } else {
      setLink(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
            <Link to='/' className='navbar-logo'>
                StreamEasy
                <img src={logo} alt="StreamEasy" className='logo' /> 
            </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          {link && <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/set-up'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Set Up
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/webplayer'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Web Player
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/about'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
            </li>
          </ul>}
        </div>
      </nav>
    </>
  );
}

export default Navbar