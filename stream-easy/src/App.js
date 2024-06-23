import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/pages/Home'
import SetUp from './components/pages/SetUp'
import Webplayer from './components/pages/Webplayer'
import About from './components/pages/About'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/set-up' exact element={<SetUp />} />
          <Route path='/webplayer/playlist-1' exact element={<Webplayer />} />
          <Route path='/about' exact element={<About />} />
        </Routes>
      </Router>
    </>
  );
}

export default App