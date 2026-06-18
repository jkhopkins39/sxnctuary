import React from 'react'
import { useAdmin } from '../contexts/AdminContext'
import { useContent } from '../contexts/ContentContext'
import './Footer.css'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const { isAdmin, logout } = useAdmin()
  const { getContent } = useContent()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">SXNCTUARY</h3>
            <p className="footer-description">
              expression.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Connect</h4>
            <div className="social-links">
              <a 
                href="https://sxnctuary.bandcamp.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-icon">
                  <img src="/bandcamp.png" alt="Bandcamp" className="social-icon-image" />
                </span>
                <span className="social-text">Bandcamp</span>
              </a>
              <a 
                href="https://open.spotify.com/artist/1ZNcRJM6QUWh7NKGb5gSOO?si=neXPjBamS5qRhtTMtfBQ1Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-icon">
                  <img src="/spotify.png" alt="Spotify" className="social-icon-image" />
                </span>
                <span className="social-text">Spotify</span>
              </a>
              <a 
                href="https://music.apple.com/us/artist/sxnctuary/1700935901" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-icon">
                  <img src="/apple music.png" alt="Apple Music" className="social-icon-image" />
                </span>
                <span className="social-text">Apple Music</span>
              </a>
              <a 
                href="https://youtube.com/@sxnctuaryy?si=or1m-nHNmSL3kshT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-icon">
                  <img src="/youtube.png" alt="YouTube" className="social-icon-image" />
                </span>
                <span className="social-text">YouTube</span>
              </a>
              <a 
                href="https://on.soundcloud.com/RfbTZpcu3fy8dGWLqe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-icon">
                  <img src="/soundcloud.svg" alt="SoundCloud" className="social-icon-image" />
                </span>
                <span className="social-text">SoundCloud</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-line"></div>
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} SXNCTUARY. All rights reserved. | 
              <span className="footer-credits"> Designed with 💚 and code</span>
            </p>
            {isAdmin ? (
              <button
                onClick={logout}
                className="admin-logout-btn"
              >
                Admin Logout
              </button>
            ) : (
              <button
                onClick={() => { window.location.href = 'https://hoppytech.com/portal' }}
                className="admin-login-btn"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
      
    </footer>
  )
}

export default Footer 