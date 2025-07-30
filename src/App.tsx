import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Merch from './pages/Merch'
import './styles/App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merch" element={<Merch />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App 