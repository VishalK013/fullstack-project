import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./Pages/HomePage"
import Navbar from './components/Navbar'
import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import theme from "./Theme"
import SignUpPage from "./Pages/SignUpPage"
import LoginPage from "./Pages/LoginPage"
import AdminPage from "./Pages/AdminPage"
function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path="/signup" element={<SignUpPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/admin" element={<AdminPage />}></Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
