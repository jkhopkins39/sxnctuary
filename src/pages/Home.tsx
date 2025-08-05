import React, { useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';
import { useLatestReleaseImage } from '../contexts/LatestReleaseImageContext';
import LatestReleaseImageEdit from '../components/LatestReleaseImageEdit';
import emailjs from '@emailjs/browser';
import './Home.css';

const Home: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { getContent } = useContent()
  const { imageUrl } = useLatestReleaseImage()

  useEffect(() => {
    setIsLoaded(true)
    
    // Check if video should be disabled (for performance)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
    
    if (prefersReducedMotion || isMobile || isLowEndDevice) {
      setVideoEnabled(false)
      setVideoLoaded(true) // Skip loading state
    }
  }, [])

  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.log('Video failed to load, using fallback background')
    setVideoEnabled(false)
    setVideoLoaded(true) // Still set to true so we don't show loading state
  }

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled)
    if (!videoEnabled) {
      setVideoLoaded(false) // Reset loading state if re-enabling
    }
  }

  const handleCanPlayThrough = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    // Check if video has enough data buffered
    if (video.buffered.length > 0 && video.buffered.end(0) >= video.duration * 0.5) {
      setVideoLoaded(true)
    }
  }

  const handleVideoEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    // Ensure video loops by restarting it
    video.currentTime = 0
    video.play().catch(err => console.log('Video loop restart failed:', err))
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error')
      return
    }

    setNewsletterStatus('loading')

    try {
      // EmailJS configuration - you'll need to add these to your .env file
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY

      // Debug: Log environment variables (remove in production)
      console.log('EmailJS Config:', {
        serviceId: serviceId ? 'Set' : 'Not Set',
        templateId: templateId ? 'Set' : 'Not Set',
        publicKey: publicKey ? 'Set' : 'Not Set'
      })

      // Check if all required environment variables are set
      if (!serviceId || !templateId || !publicKey) {
        console.error('Missing EmailJS environment variables:', {
          serviceId: !!serviceId,
          templateId: !!templateId,
          publicKey: !!publicKey
        })
        setNewsletterStatus('error')
        setTimeout(() => setNewsletterStatus('idle'), 3000)
        return
      }

      const templateParams = {
        to_email: 'sxnctuaryy8@gmail.com',
        subscriber_email: newsletterEmail,
        message: `New newsletter subscriber: ${newsletterEmail}`,
        subscribed_at: new Date().toLocaleString()
      }

      console.log('Sending email with params:', templateParams)

      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey)
      
      console.log('EmailJS result:', result)
      
      if (result.status === 200) {
        setNewsletterStatus('success')
        setNewsletterEmail('')
        // Reset success message after 3 seconds
        setTimeout(() => setNewsletterStatus('idle'), 3000)
      } else {
        setNewsletterStatus('error')
        // Reset error message after 3 seconds
        setTimeout(() => setNewsletterStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setNewsletterStatus('error')
      // Reset error message after 3 seconds
      setTimeout(() => setNewsletterStatus('idle'), 3000)
    }
  }

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
    },
    {
      name: 'Instagram',
      icon: '/instagram.png',
      url: 'https://www.instagram.com/sxnctuaryyyy/',
      description: 'Social media platform'
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
        {/* Video Background */}
        <div className="hero-video-background">
          {videoEnabled && !videoLoaded && (
            <div className="video-loading-placeholder">
              <div className="loading-spinner"></div>
            </div>
          )}
          {videoEnabled ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/hero-background-poster.jpg"
              className="hero-video"
              onLoadedData={handleVideoLoad}
              onCanPlayThrough={handleCanPlayThrough}
              onError={handleVideoError}
              onEnded={handleVideoEnded} // Ensure looping
              style={{ opacity: videoLoaded ? 1 : 0 }}
            >
              <source src="/hero-background.mp4" type="video/mp4" />
              <source src="/hero-background.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="hero-static-background"></div>
          )}
          <div className="hero-video-overlay"></div>
          
          {/* Video Toggle Button */}
          <button 
            className="video-toggle-btn"
            onClick={toggleVideo}
            title={videoEnabled ? "Disable video (if choppy)" : "Enable video"}
          >
            {videoEnabled ? "🎬" : "🖼️"}
          </button>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">{getContent('hero-title')}</span>
            <span className="title-subtitle">{getContent('hero-subtitle')}</span>
          </h1>
          <p className="hero-description">
            {getContent('hero-description')}
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
            <h3 className="release-name">"{getContent('latest-release-name')}"</h3>
            <p className="release-description">
              {getContent('latest-release-description')}
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
                src={imageUrl} 
                alt="Latest Release Album Cover" 
                className="album-cover-image"
              />
              <div className="cover-glow"></div>
            </div>
            <LatestReleaseImageEdit />
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
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
            {newsletterStatus === 'loading' && <p className="newsletter-status loading">Loading...</p>}
            {newsletterStatus === 'success' && <p className="newsletter-status success">Subscribed!</p>}
            {newsletterStatus === 'error' && <p className="newsletter-status error">Failed to subscribe.</p>}
            
            {/* Temporary Debug Info - Remove after testing */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                <p>Debug Info:</p>
                <p>Service ID: {process.env.REACT_APP_EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Not Set'}</p>
                <p>Template ID: {process.env.REACT_APP_EMAILJS_TEMPLATE_ID ? '✅ Set' : '❌ Not Set'}</p>
                <p>Public Key: {process.env.REACT_APP_EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Not Set'}</p>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home 