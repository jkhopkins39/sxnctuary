import React, { useEffect, useState } from 'react'
import './Home.css'

const Home: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const musicPlatforms = [
    {
      name: 'Bandcamp',
      icon: '/bandcamp.png',
      url: 'https://sxnctuary.bandcamp.com/',
      description: 'Digital music platform'
    },
    {
      name: 'Spotify',
      icon: '/spotify.png',
      url: 'https://open.spotify.com/artist/1ZNcRJM6QUWh7NKGb5gSOO?si=neXPjBamS5qRhtTMtfBQ1Q',
      description: 'Streaming service'
    },
    {
      name: 'Apple Music',
      icon: '/apple music.png',
      url: 'https://music.apple.com/us/artist/sxnctuary/1700935901',
      description: 'Apple\'s music platform'
    },
    {
      name: 'YouTube',
      icon: '/youtube.png',
      url: 'https://youtube.com/@sxnctuaryy?si=or1m-nHNmSL3kshT',
      description: 'Video platform'
    },
    {
      name: 'SoundCloud',
      icon: '/soundcloud.svg',
      url: 'https://on.soundcloud.com/RfbTZpcu3fy8dGWLqe',
      description: 'Audio sharing platform'
    }
  ]

  return (
    <div className={`home ${isLoaded ? 'loaded' : ''}`}>
      {/* Matrix Background Effect */}
      <div className="matrix-bg">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="matrix-column"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j} style={{ opacity: Math.random() }}>
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">SXNCTUARY</span>
            <span className="title-subtitle">Electronic Music</span>
          </h1>
          <p className="hero-description">
            Pushing the boundaries of electronic music with futuristic soundscapes, 
            innovative production techniques, and cutting-edge technology.
          </p>
          <div className="hero-buttons">
            <a href="#music" className="btn btn-primary">
              Listen Now
            </a>
            <a href="/merch" className="btn btn-secondary">
              Get Merch
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-element">
            <div className="rotating-cd">
              <img 
                src="/IMG_3222.jpg" 
                alt="SXNCTUARY CD" 
                className="cd-image"
              />
            </div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
        </div>
      </section>

      {/* Music Platforms Section */}
      <section id="music" className="music-section">
        <div className="section-header">
          <h2 className="section-title">Listen & Connect</h2>
          <p className="section-subtitle">
            Experience SXNCTUARY across all major music platforms
          </p>
        </div>

        <div className="platforms-grid">
          {musicPlatforms.map((platform, index) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`platform-card slide-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="platform-icon">
                <img 
                  src={platform.icon} 
                  alt={`${platform.name} icon`}
                  className="platform-icon-image"
                />
              </div>
              <h3 className="platform-name">{platform.name}</h3>
              <p className="platform-description">{platform.description}</p>
              <div className="platform-glow"></div>
            </a>
          ))}
        </div>
      </section>

      {/* Latest Release Section */}
      <section className="latest-release">
        <div className="release-content">
          <div className="release-info">
            <h2 className="release-title">Latest Release</h2>
            <h3 className="release-name">"RUNNERS"</h3>
            <p className="release-description">
              My latest drum'n'bass track
            </p>
            <div className="release-stats">
              <div className="stat">
                <span className="stat-number">1</span>
                <span className="stat-label">Track</span>
              </div>
              <div className="stat">
                <span className="stat-number">2:21</span>
                <span className="stat-label">Duration</span>
              </div>
              <div className="stat">
                <span className="stat-number">2025</span>
                <span className="stat-label">Released</span>
              </div>
            </div>
          </div>
          <div className="release-visual">
            <div className="album-cover">
              <img 
                src="/IMG_3220.jpg" 
                alt="RUNNERS Album Cover" 
                className="album-cover-image"
              />
              <div className="cover-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Stay Connected</h2>
          <p className="newsletter-description">
            Get notified about new releases, exclusive content, and upcoming shows.
          </p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              required
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home 