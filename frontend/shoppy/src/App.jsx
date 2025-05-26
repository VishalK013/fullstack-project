import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from './Pages/HomePage'
import Navbar from './components/Navbar'
import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import theme from "./Theme"
function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />}></Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
