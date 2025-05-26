import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from './Pages/HomePage'
import Navbar from './components/Navbar'
function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
