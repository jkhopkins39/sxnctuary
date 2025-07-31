import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminProvider } from './contexts/AdminContext'
import { ContentProvider } from './contexts/ContentContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Merch from './pages/Merch'
import ContentManager from './components/ContentManager'
import './styles/App.css'

function App() {
  return (
    <AdminProvider>
      <ContentProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/merch" element={<Merch />} />
            </Routes>
          </main>
          <Footer />
          <ContentManager />
        </div>
      </ContentProvider>
    </AdminProvider>
  )
}

export default App 