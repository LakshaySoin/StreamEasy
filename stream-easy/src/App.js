import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/pages/Home'
import SetUp from './components/pages/SetUp'
import WebPlayer from './components/pages/WebPlayer'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/set-up' exact element={<SetUp />} />
          <Route path='/webplayer' exact element={<WebPlayer />} />
        </Routes>
      </Router>
    </>
  );
}

export default App