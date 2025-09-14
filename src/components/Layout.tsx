'use client';

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { BackgroundProvider } from './effects/BackgroundProvider';
import ClientLayout from './ClientLayout';
import Footer from './Footer';
import Navbar from './Navbar';

// Comment out the audio player for now
// import dynamic from 'next/dynamic';
// const AudioPlayerToggle = dynamic(
//   () => import('./audio/AudioPlayerToggle'),
//   { ssr: false }
// );

interface LayoutProps {
  children: ReactNode;
}

// TacitusFM playlist definition
const tacitusPlaylist = [
  "./music/tacitus1.mp3",
  "./music/tacitus2.mp3",
  "./music/tacitus3.mp3",
  "./music/tacitus4.mp3",
  "./music/tacitus5.mp3",
  // Add more tracks as needed
];

const Layout = ({ children }: LayoutProps) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [stationIndex, setStationIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [trackTitle, setTrackTitle] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Load saved audio state from localStorage on initial render
  useEffect(() => {
    const savedVolume = localStorage.getItem('audioVolume');
    const savedIsPlaying = localStorage.getItem('audioIsPlaying');
    const savedStationIndex = localStorage.getItem('audioStationIndex');
    const savedTrackIndex = localStorage.getItem('audioTrackIndex');
    const hasInteractedBefore = localStorage.getItem('radioInteracted');
    
    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedStationIndex) setStationIndex(parseInt(savedStationIndex));
    if (savedTrackIndex) setCurrentTrackIndex(parseInt(savedTrackIndex));
    
    if (hasInteractedBefore) {
      setHasInteracted(true);
    } else {
      // Show notification for new users
      setTimeout(() => {
        setShowNotification(true);
        // Auto-hide after 20 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 20000);
      }, 5000);
    }
    
    if (savedIsPlaying === 'true') {
      // Delay starting playbook to ensure component is fully mounted
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.error("Auto-resume error:", err));
        }
      }, 1000);
    }
  }, []);
  
  
  // Save audio state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('audioVolume', volume.toString());
    localStorage.setItem('audioIsPlaying', isPlaying.toString());
    localStorage.setItem('audioStationIndex', stationIndex.toString());
    localStorage.setItem('audioTrackIndex', currentTrackIndex.toString());
  }, [volume, isPlaying, stationIndex, currentTrackIndex]);

  // Synthwave & Dark Electronic Stations
  const stations = [
    // Comment out TacitusFM for now - will use all other radios
    // { name: "TacitusFM", url: tacitusPlaylist[currentTrackIndex], isPlaylist: true },
    { name: "DarkSynth", url: "https://stream.nightride.fm/darksynth.m4a", isPlaylist: false, description: "Horror synth & cyberpunk" },
    { name: "NightrideFM", url: "https://stream.nightride.fm/nightride.m4a", isPlaylist: false, description: "Classic synthwave & outrun" },
    { name: "Nightwave Plaza", url: "https://radio.plaza.one/mp3", isPlaylist: false, description: "Lo-fi vaporwave & future funk" },
    { name: "DataWave", url: "https://stream.nightride.fm/datawave.m4a", isPlaylist: false, description: "Glitchy synthwave & IDM" },
    { name: "SpaceSynth", url: "https://stream.nightride.fm/spacesynth.m4a", isPlaylist: false, description: "Space disco & vocoder italo" },
    { name: "ChillSynth", url: "https://stream.nightride.fm/chillsynth.m4a", isPlaylist: false, description: "Chillwave & ambient synth" },
    { name: "HorrorSynth", url: "https://stream.nightride.fm/horrorsynth.m4a", isPlaylist: false, description: "Dark horror electronic" }
  ];
  
  const currentStation = stations[stationIndex];
  
  // Handle play/pause
  const togglePlay = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowNotification(false);
      localStorage.setItem('radioInteracted', 'true');
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle station change
  const changeStation = (direction: number) => {
    // Hide notification on any radio interaction
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowNotification(false);
      localStorage.setItem('radioInteracted', 'true');
    }
    
    const newIndex = (stationIndex + direction + stations.length) % stations.length;
    setStationIndex(newIndex);
    
    // TacitusFM is commented out, so no need for special handling
  };
  
  // Handle track ended (for playlist functionality)
  const handleTrackEnded = () => {
    // TacitusFM is commented out, so no special handling needed for playlists
    // Regular streams will auto-continue
  };
  
  // Initialize track title on first render
  useEffect(() => {
    // Since TacitusFM is commented out, we don't need to set track titles
    setTrackTitle("");
  }, [stationIndex, currentTrackIndex]);
  
  // Update audio src when station changes
  useEffect(() => {
    if (audioRef.current) {
      // TacitusFM is commented out, so we always use currentStation.url
      audioRef.current.src = currentStation.url;
      
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Station change error:", err));
      }
    }
  }, [stationIndex, currentStation.url, isPlaying]);
  
  // Setup event listeners for the audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Event listener for track ended
    const onEnded = () => handleTrackEnded();
    audio.addEventListener('ended', onEnded);
    
    // Cleanup
    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrackIndex, stationIndex]);
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hide notification on volume interaction
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowNotification(false);
      localStorage.setItem('radioInteracted', 'true');
    }
    
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Show tooltip less frequently by checking localStorage
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('hasSeenRadioTooltip');
    
    // Tooltip disabled to avoid conflicts with main notification
    // if (!hasSeenTooltip) {
    //   setTimeout(() => {
    //     setShowTooltip(true);
    //   }, 2000);
    //   
    //   // Hide tooltip after some time
    //   setTimeout(() => {
    //     setShowTooltip(false);
    //   }, 10000);
    //   
    //   // Save that user has seen the tooltip
    //   localStorage.setItem('hasSeenRadioTooltip', 'true');
    // }
  }, []);

  // Handle visibility change to maintain playback when tab changes or navigating
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        // If returning to the page and audio should be playing, ensure it is
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(err => console.error("Visibility resume error:", err));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);
  
  return (
    <BackgroundProvider>
      <ClientLayout>
        <Navbar />
        {children}
        <Footer />
        
        {/* Enhanced notification for first-time users */}
        {showNotification && !hasInteracted && (
          <div 
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '40px',
              width: '300px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(15, 18, 35, 0.95), rgba(25, 30, 50, 0.95))',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(58, 134, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(58, 134, 255, 0.2), 0 0 60px rgba(58, 134, 255, 0.1)',
              color: 'white',
              zIndex: 998,
              fontSize: '14px',
              animation: 'notificationSlide 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: 'translateX(0)',
              transition: 'all 0.4s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.2), rgba(115, 74, 253, 0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(58, 134, 255, 0.3)',
                boxShadow: '0 0 20px rgba(58, 134, 255, 0.3)'
              }}>
                <span style={{ 
                  fontSize: '18px',
                  filter: 'drop-shadow(0 0 8px rgba(58, 134, 255, 0.6))'
                }}>🎵</span>
              </div>
              <div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#00c6ff', 
                  fontSize: '16px',
                  letterSpacing: '0.5px',
                  marginBottom: '2px'
                }}>
                  Synthwave Radio Ready
                </div>
                <div style={{ fontSize: '12px', opacity: '0.7', color: '#a0a0a0' }}>
                  Electronic music for focus & coding
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{ 
              fontSize: '13px',
                opacity: '0.8', 
                lineHeight: '1.4',
                color: '#c8c8c8',
                paddingLeft: '52px',
                flex: 1
              }}>
                Tip: Click the radio button to enable immersive background music while browsing.
              </div>
              
              {/* Close button */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                  marginTop: '-8px'
                }}
                onClick={() => {
                  setShowNotification(false);
                  localStorage.setItem('radioInteracted', 'true');
                  setHasInteracted(true);
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.4)';
                  (e.target as HTMLElement).style.background = 'none';
                }}
              >
                ×
              </button>
            </div>
            
            {/* Elegant progress indicator */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '20px',
              right: '20px',
              height: '3px',
              background: 'rgba(58, 134, 255, 0.15)',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #3a86ff 0%, #00c6ff 50%, #7c4dff 100%)',
                borderRadius: '6px',
                animation: 'notificationProgress 20s linear',
                transformOrigin: 'left',
                boxShadow: '0 0 8px rgba(58, 134, 255, 0.4)',
                position: 'relative'
              }}>
                {/* Shimmer effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                  animation: 'progressShimmer 2s ease-in-out infinite'
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Clean tooltip for radio station info */}
        {false && showTooltip && (
          <div 
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '40px',
              width: '240px',
              padding: '14px',
              background: 'rgba(20, 20, 25, 0.94)',
              backdropFilter: 'blur(12px)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              color: 'white',
              zIndex: 998,
              fontSize: '13px',
              animation: 'fadeIn 0.3s ease-out',
              transform: 'translateX(0)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}>
              <div style={{ 
                fontWeight: '500', 
                color: '#f0f0f0', 
                fontSize: '14px',
                letterSpacing: '0.1px'
              }}>
                {currentStation.name}
              </div>
              <button
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'rgba(255,255,255,0.4)', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease'
                }}
                onClick={() => setShowTooltip(false)}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}
              >
                ✕
              </button>
            </div>
            <div style={{ 
              fontSize: '12px', 
              opacity: '0.7', 
              marginBottom: '4px',
              color: '#c0c0c0'
            }}>
              {currentStation.description}
            </div>
            <div style={{ 
              fontSize: '11px', 
              opacity: '0.5', 
              color: '#a0a0a0'
            }}>
              Use ← → to switch stations
            </div>
            <div 
              style={{
                position: 'absolute',
                right: '15px',
                bottom: '-10px',
                width: '0', 
                height: '0',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '10px solid rgba(10, 11, 14, 0.9)',
              }}
            />
          </div>
        )}
        
        {/* Enhanced radio button with hide/show functionality */}
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Animated radio waves indicators */}
          <div className="radio-waves" style={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            opacity: isPlaying ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <button 
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(5, 6, 10, 0.95)',
              border: '2px solid rgba(115, 74, 253, 0.8)',
              boxShadow: '0 0 25px rgba(49, 164, 253, 0.4), 0 0 50px rgba(115, 74, 253, 0.2)',
              color: 'rgb(115, 74, 253)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '24px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              animation: showPlayer ? 'none' : 'pulse-attention 2s infinite'
            }}
            onClick={() => {
              setShowPlayer(!showPlayer);
              setShowTooltip(false);
              // Hide notification when player is opened
              if (!showPlayer) {
                setShowNotification(false);
                if (!hasInteracted) {
                  setHasInteracted(true);
                  localStorage.setItem('radioInteracted', 'true');
                }
              }
            }}
            aria-label="Toggle audio player"
          >
            {/* Icon with animation */}
            <span style={{
              filter: 'drop-shadow(0 0 2px rgb(115, 74, 253))',
              animation: isPlaying ? 'glow 1.5s infinite alternate' : 'none',
            }}>
              {isPlaying ? '📻' : '🎧'}
            </span>
            
            {/* Status indicator */}
            {isPlaying && (
              <span style={{
                position: 'absolute',
                bottom: '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '8px',
                color: '#00dc82',
                fontWeight: 'bold',
                textShadow: '0 0 5px rgba(0, 220, 130, 0.7)'
              }}>
                LIVE
              </span>
            )}
          </button>
          
          {!showPlayer && isPlaying && (
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '0',
              backgroundColor: 'rgba(3, 4, 8, 0.96)',
              borderRadius: '10px',
              padding: '5px 8px',
              fontSize: '11px',
              whiteSpace: 'nowrap',
              color: 'rgb(115, 74, 253)',
              boxShadow: '0 0 15px rgba(49, 164, 253, 0.3), 0 0 30px rgba(115, 74, 253, 0.15)',
              border: '1px solid rgba(115, 74, 253, 0.4)',
            }}>
              {stationIndex === 0 ? `♫ ${trackTitle}` : currentStation.name}
            </div>
          )}
        </div>
        
        {/* Hidden audio element - persist across page transitions */}
        <audio
          ref={audioRef}
          style={{ display: 'none' }}
          src={currentStation.url}
          preload="auto"
        />
        
          {/* LEGENDARY NEURAL STREAM INTERFACE */}
        {showPlayer && (
          <div
            style={{
              position: 'fixed',
              bottom: '90px',
              ...(isMobile ? {
                left: '10px',
                right: '10px',
                width: 'auto',
                maxWidth: 'none',
                minWidth: '300px'
              } : {
              right: '20px',
                left: 'auto',
                width: '377px', // Golden ratio: 233*1.618≈377 (Fibonacci sequence)
                maxWidth: '377px',
                minWidth: '320px'
              }),
                padding: '0',
                background: 'linear-gradient(145deg, rgba(1, 1, 6, 0.99), rgba(3, 4, 10, 0.99))',
                backdropFilter: 'blur(25px)',
                borderRadius: '16px',
                border: '1px solid rgba(58, 134, 255, 0.25)',
                boxShadow: `
                  0 0 60px rgba(58, 134, 255, 0.25),
                  0 0 120px rgba(115, 74, 253, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.06),
                  0 30px 100px rgba(0, 0, 0, 0.8)
                `,
              color: 'white',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                animation: 'neuralActivation 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                overflow: 'hidden'
              }}
            >
              {/* HOLOGRAPHIC BACKGROUND MATRIX */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 20% 80%, rgba(58, 134, 255, 0.03) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(115, 74, 253, 0.03) 0%, transparent 50%),
                  linear-gradient(135deg, transparent 0%, rgba(0, 220, 130, 0.01) 50%, transparent 100%)
                `,
                opacity: isPlaying ? 1 : 0.3,
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none'
              }} />
              
              {/* NEURAL GRID PATTERN */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  linear-gradient(rgba(58, 134, 255, 0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(58, 134, 255, 0.02) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                opacity: 0.4,
                pointerEvents: 'none'
              }} />
              
              {/* QUANTUM HEADER */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
                padding: isMobile ? '20px 24px 14px' : '26px 42px 16px', // Golden ratio: 26*1.618≈42
                borderBottom: 'none',
                background: `
                  rgba(0, 0, 0, 0.4),
                  linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(58, 134, 255, 0.1) 38.2%, 
                    rgba(115, 74, 253, 0.1) 61.8%, 
                    transparent 100%
                  )
                `,
                backgroundBlendMode: 'multiply',
                boxShadow: 'inset 0 -1px 0 rgba(58, 134, 255, 0.15)',
                position: 'relative',
                zIndex: 2
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {/* QUANTUM STATUS INDICATOR */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                  borderRadius: '50%',
                    background: isPlaying 
                      ? 'radial-gradient(circle, #00dc82 0%, #00a86b 100%)' 
                      : 'radial-gradient(circle, #3a86ff 0%, #1e5fff 100%)',
                    boxShadow: isPlaying 
                      ? '0 0 20px rgba(0, 220, 130, 0.6), 0 0 40px rgba(0, 220, 130, 0.3)' 
                      : '0 0 20px rgba(58, 134, 255, 0.6), 0 0 40px rgba(58, 134, 255, 0.3)',
                    animation: isPlaying ? 'quantumPulse 2s ease-in-out infinite' : 'standbyGlow 3s ease-in-out infinite',
                    position: 'relative'
                  }}>
                    {/* INNER CORE */}
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      right: '2px',
                      bottom: '2px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.8)',
                      animation: isPlaying ? 'coreFlicker 1s ease-in-out infinite' : 'none'
                    }} />
              </div>
                  
                  {/* LEGENDARY TITLE */}
                  <div style={{
                    fontWeight: '700',
                    fontSize: '15px',
                    letterSpacing: '2px',
                    background: 'linear-gradient(135deg, #00c6ff 0%, #3a86ff 50%, #7c4dff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(58, 134, 255, 0.5)',
                    animation: 'holographicShimmer 3s ease-in-out infinite',
                    fontFamily: '"Orbitron", monospace'
                  }}>
                SYNTHWAVE_RADIO
              </div>
                  
                  {/* FREQUENCY BARS */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'end',
                    gap: '2px',
                    height: '16px',
                    marginLeft: '4px'
                  }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: '2px',
                          height: `${4 + i * 3}px`,
                          background: isPlaying 
                            ? 'linear-gradient(to top, #00dc82, #3a86ff)' 
                            : 'rgba(58, 134, 255, 0.3)',
                          borderRadius: '1px',
                          animation: isPlaying ? `frequencyBar${i} 0.${5 + i}s ease-in-out infinite` : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* QUANTUM CONTROLS */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* MINIMIZE PROTOCOL */}
                <button
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.1), rgba(58, 134, 255, 0.05))',
                    border: '1px solid rgba(58, 134, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#3a86ff', 
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px rgba(58, 134, 255, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => setShowPlayer(false)}
                  title="Minimize Neural Interface"
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLElement;
                    btn.style.background = 'linear-gradient(135deg, rgba(58, 134, 255, 0.2), rgba(58, 134, 255, 0.1))';
                    btn.style.boxShadow = '0 0 20px rgba(58, 134, 255, 0.4)';
                    btn.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLElement;
                    btn.style.background = 'linear-gradient(135deg, rgba(58, 134, 255, 0.1), rgba(58, 134, 255, 0.05))';
                    btn.style.boxShadow = '0 0 10px rgba(58, 134, 255, 0.2)';
                    btn.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '6px',
                    right: '6px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #3a86ff, transparent)',
                    borderRadius: '1px'
                  }} />
                </button>
                
                {/* TERMINATION PROTOCOL */}
                <button
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(220, 38, 127, 0.1), rgba(220, 38, 127, 0.05))',
                    border: '1px solid rgba(220, 38, 127, 0.3)',
                    borderRadius: '8px',
                    color: '#dc267f', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px rgba(220, 38, 127, 0.2)',
                    position: 'relative'
                  }}
                  onClick={() => {
                    setShowPlayer(false);
                    if (isPlaying) togglePlay(); // Also stop playback
                  }}
                  title="Terminate Neural Connection"
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLElement;
                    btn.style.background = 'linear-gradient(135deg, rgba(220, 38, 127, 0.2), rgba(220, 38, 127, 0.1))';
                    btn.style.boxShadow = '0 0 20px rgba(220, 38, 127, 0.4)';
                    btn.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLElement;
                    btn.style.background = 'linear-gradient(135deg, rgba(220, 38, 127, 0.1), rgba(220, 38, 127, 0.05))';
                    btn.style.boxShadow = '0 0 10px rgba(220, 38, 127, 0.2)';
                    btn.style.transform = 'scale(1)';
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* STATION SELECTOR */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '14px 20px' : '16px 26px', // Golden ratio proportions
              background: `
                rgba(0, 0, 0, 0.4),
                radial-gradient(ellipse at 38.2% 50%, rgba(58, 134, 255, 0.08) 0%, transparent 61.8%)
              `,
              backgroundBlendMode: 'multiply',
              borderTop: 'none',
              borderBottom: 'none',
              boxShadow: `
                inset 0 1px 0 rgba(58, 134, 255, 0.1),
                inset 0 -1px 0 rgba(58, 134, 255, 0.1)
              `,
              position: 'relative',
              zIndex: 2
            }}>
              {/* PREV STATION */}
              <button
                style={{
                  background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.08), rgba(58, 134, 255, 0.04))',
                  border: '1px solid rgba(58, 134, 255, 0.2)',
                  borderRadius: '10px',
                  color: '#3a86ff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 8px rgba(58, 134, 255, 0.1)',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}
                onClick={() => changeStation(-1)}
                onMouseEnter={(e) => {
                  const btn = e.target as HTMLElement;
                  btn.style.background = 'linear-gradient(135deg, rgba(58, 134, 255, 0.15), rgba(58, 134, 255, 0.08))';
                  btn.style.boxShadow = '0 0 15px rgba(58, 134, 255, 0.3)';
                  btn.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  const btn = e.target as HTMLElement;
                  btn.style.background = 'linear-gradient(135deg, rgba(58, 134, 255, 0.08), rgba(58, 134, 255, 0.04))';
                  btn.style.boxShadow = '0 0 8px rgba(58, 134, 255, 0.1)';
                  btn.style.transform = 'scale(1)';
                }}
              >
                ◀
              </button>
              
              {/* STATION DISPLAY */}
              <div style={{
                textAlign: 'center',
                flex: 1,
                margin: '0 16px'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#00c6ff',
                  marginBottom: '4px',
                  letterSpacing: '1px',
                  fontFamily: '"Orbitron", monospace'
              }}>
                {currentStation.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: '0.5px'
                }}>
                  {currentStation.description}
                </div>
              </div>
              
              {/* NEXT STATION */}
              <button
                style={{
                  background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.08), rgba(58, 134, 255, 0.04))',
                  border: '1px solid rgba(58, 134, 255, 0.2)',
                  borderRadius: '10px',
                  color: '#3a86ff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 8px rgba(58, 134, 255, 0.1)',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}
                onClick={() => changeStation(1)}
                onMouseEnter={(e) => {
                  const btn = e.target as HTMLElement;
                  btn.style.background = 'linear-gradient(135deg, rgba(58, 134, 255, 0.15), rgba(58, 134, 255, 0.08))';
                  btn.style.boxShadow = '0 0 15px rgba(58, 134, 255, 0.3)';
                  btn.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  const btn = e.target as HTMLElement;
                  btn.style.background = 'linear-gradient(135deg, rgba(58, 134, 255, 0.08), rgba(58, 134, 255, 0.04))';
                  btn.style.boxShadow = '0 0 8px rgba(58, 134, 255, 0.1)';
                  btn.style.transform = 'scale(1)';
                }}
              >
                ▶
              </button>
            </div>
            
            {/* Track title display (for TacitusFM) */}
            {/* TacitusFM is commented out for now
            {stationIndex === 0 && trackTitle && (
              <div style={{
                fontSize: '11px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                padding: '0 10px',
                marginTop: '-10px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                ♫ {trackTitle}
              </div>
            )}
            */}
            
            {/* QUANTUM PLAYBACK CONTROLS */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '28px 20px' : '39px 24px', // Golden ratio: 24*1.618≈39
              background: `
                rgba(0, 0, 0, 0.5),
                radial-gradient(circle at center, rgba(0, 220, 130, 0.03) 0%, transparent 61.8%)
              `,
              backgroundBlendMode: 'multiply',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Skip back button for TacitusFM */}
              {/* TacitusFM is commented out for now
              {stationIndex === 0 && (
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(115, 74, 253, 0.8)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '5px'
                  }}
                  onClick={() => {
                    const prevIndex = (currentTrackIndex - 1 + tacitusPlaylist.length) % tacitusPlaylist.length;
                    setCurrentTrackIndex(prevIndex);
                  }}
                >
                  ⏮
                </button>
              )}
              */}
              
              {/* MAIN QUANTUM CONTROL */}
              <button
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: isPlaying 
                    ? 'radial-gradient(circle, rgba(0, 220, 130, 0.2) 0%, rgba(0, 220, 130, 0.05) 100%)' 
                    : 'radial-gradient(circle, rgba(58, 134, 255, 0.2) 0%, rgba(58, 134, 255, 0.05) 100%)',
                  border: `2px solid ${isPlaying ? '#00dc82' : '#3a86ff'}`,
                  color: isPlaying ? '#00dc82' : '#3a86ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '24px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isPlaying 
                    ? '0 0 30px rgba(0, 220, 130, 0.4), 0 0 60px rgba(0, 220, 130, 0.2)' 
                    : '0 0 30px rgba(58, 134, 255, 0.4), 0 0 60px rgba(58, 134, 255, 0.2)',
                  position: 'relative',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}
                onClick={togglePlay}
                onMouseEnter={(e) => {
                  const btn = e.target as HTMLElement;
                  btn.style.transform = 'scale(1.1)';
                  btn.style.boxShadow = isPlaying 
                    ? '0 0 40px rgba(0, 220, 130, 0.6), 0 0 80px rgba(0, 220, 130, 0.3)' 
                    : '0 0 40px rgba(58, 134, 255, 0.6), 0 0 80px rgba(58, 134, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  const btn = e.target as HTMLElement;
                  btn.style.transform = 'scale(1)';
                  btn.style.boxShadow = isPlaying 
                    ? '0 0 30px rgba(0, 220, 130, 0.4), 0 0 60px rgba(0, 220, 130, 0.2)' 
                    : '0 0 30px rgba(58, 134, 255, 0.4), 0 0 60px rgba(58, 134, 255, 0.2)';
                }}
              >
                {/* QUANTUM CORE */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: isPlaying 
                    ? 'radial-gradient(circle, rgba(0, 220, 130, 0.1) 0%, transparent 70%)' 
                    : 'radial-gradient(circle, rgba(58, 134, 255, 0.1) 0%, transparent 70%)',
                  animation: isPlaying ? 'quantumCore 2s ease-in-out infinite' : 'none',
                  pointerEvents: 'none'
                }} />
                
                {/* PLAY/PAUSE ICON */}
                <div style={{ 
                  position: 'relative', 
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isPlaying ? (
                    // PAUSE ICON - Two vertical bars
                    <div style={{ 
                      display: 'flex', 
                      gap: '4px',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '3px',
                        height: '16px',
                        background: 'currentColor',
                        borderRadius: '1px'
                      }} />
                      <div style={{
                        width: '3px',
                        height: '16px',
                        background: 'currentColor',
                        borderRadius: '1px'
                      }} />
                    </div>
                  ) : (
                    // PLAY ICON - Triangle
                    <div style={{
                      width: 0,
                      height: 0,
                      borderLeft: '12px solid currentColor',
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      marginLeft: '2px'
                    }} />
                  )}
                </div>
              </button>
              
              {/* Skip forward button for TacitusFM */}
              {/* TacitusFM is commented out for now
              {stationIndex === 0 && (
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(115, 74, 253, 0.8)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '5px'
                  }}
                  onClick={() => {
                    const nextIndex = (currentTrackIndex + 1) % tacitusPlaylist.length;
                    setCurrentTrackIndex(nextIndex);
                  }}
                >
                  ⏭
                </button>
              )}
              */}
            </div>
            
            {/* QUANTUM VOLUME CONTROL */}
            <div style={{
              padding: '16px 26px', // Golden ratio consistency
              background: `
                rgba(0, 0, 0, 0.4),
                linear-gradient(135deg, 
                  rgba(115, 74, 253, 0.06) 0%, 
                  transparent 38.2%, 
                  rgba(58, 134, 255, 0.06) 100%
                )
              `,
              backgroundBlendMode: 'multiply',
              borderTop: 'none',
              boxShadow: 'inset 0 1px 0 rgba(58, 134, 255, 0.12)',
              position: 'relative',
              zIndex: 2
            }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '60px'
                }}>
                  <span style={{ 
                    color: '#3a86ff', 
                    fontSize: '14px',
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: '600',
                    letterSpacing: '1px'
                  }}>
                    VOL
                  </span>
                  <span style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    minWidth: '30px',
                    textAlign: 'right'
                  }}>
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                
                <div style={{ 
                  flex: 1, 
                  position: 'relative',
                  height: '8px',
                  background: 'rgba(58, 134, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  {/* VOLUME TRACK */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${volume * 100}%`,
                    background: 'linear-gradient(90deg, #3a86ff 0%, #00c6ff 100%)',
                    borderRadius: '4px',
                    boxShadow: '0 0 10px rgba(58, 134, 255, 0.4)',
                    transition: 'all 0.2s ease'
                  }} />
                  
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                      background: 'transparent',
                  outline: 'none',
                      cursor: 'pointer',
                      margin: 0,
                      padding: 0
                }}
              />
                </div>
              </div>
            </div>
            
            {/* QUANTUM STATUS TERMINAL */}
            <div style={{ 
              padding: isMobile ? '8px 14px' : '10px 16px', // Golden ratio: 16/1.618≈10
              background: `
                rgba(0, 0, 0, 0.4),
                linear-gradient(90deg, 
                  rgba(58, 134, 255, 0.04) 0%, 
                  rgba(0, 220, 130, 0.04) 38.2%, 
                  rgba(115, 74, 253, 0.04) 61.8%, 
                  rgba(58, 134, 255, 0.04) 100%
                )
              `,
              backgroundBlendMode: 'multiply',
              borderTop: 'none',
              boxShadow: 'inset 0 1px 0 rgba(58, 134, 255, 0.08)',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                {/* STATUS INDICATOR */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: '600',
                  letterSpacing: '1.5px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isPlaying ? '#00dc82' : '#3a86ff',
                    boxShadow: isPlaying 
                      ? '0 0 12px rgba(0, 220, 130, 0.8)' 
                      : '0 0 12px rgba(58, 134, 255, 0.8)',
                    animation: isPlaying ? 'statusPulse 1.5s ease-in-out infinite' : 'none'
                  }} />
                  
                  <span style={{ 
                    color: isPlaying ? '#00dc82' : '#3a86ff',
                    textShadow: isPlaying 
                      ? '0 0 10px rgba(0, 220, 130, 0.5)' 
                      : '0 0 10px rgba(58, 134, 255, 0.5)'
                  }}>
                    {isPlaying ? 'LIVE_TRANSMISSION' : 'SIGNAL_READY'}
                </span>
                </div>
              </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes pulse {
                0% { opacity: 0.6; }
                50% { opacity: 1; }
                100% { opacity: 0.6; }
              }
              
              @keyframes glow {
                0% { filter: drop-shadow(0 0 2px rgb(115, 74, 253)); }
                100% { filter: drop-shadow(0 0 8px rgb(115, 74, 253)); }
              }
              
              @keyframes scan-line {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              
              @keyframes pulse-attention {
                0% { transform: scale(1); box-shadow: 0 0 20px rgba(49, 164, 253, 0.3); }
                50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(49, 164, 253, 0.5); }
                100% { transform: scale(1); box-shadow: 0 0 20px rgba(49, 164, 253, 0.3); }
              }
              
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              @keyframes slideIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
              }
              
              .radio-waves span {
                position: absolute;
                border: 2px solid rgba(115, 74, 253, 0.3);
                border-radius: 50%;
                animation: wave 2s linear infinite;
              }
              
              .radio-waves span:nth-child(1) {
                width: 100%;
                height: 100%;
                animation-delay: 0s;
              }
              
              .radio-waves span:nth-child(2) {
                width: 80%;
                height: 80%;
                left: 10%;
                top: 10%;
                animation-delay: 0.3s;
              }
              
              .radio-waves span:nth-child(3) {
                width: 60%;
                height: 60%;
                left: 20%;
                top: 20%;
                animation-delay: 0.6s;
              }
              
              @keyframes wave {
                0% {
                  transform: scale(0.5);
                  opacity: 1;
                }
                100% {
                  transform: scale(1.2);
                  opacity: 0;
                }
              }
              
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 12px;
                height: 12px;
                background: rgb(115, 74, 253);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 8px rgba(115, 74, 253, 0.5);
              }
              
              input[type=range]::-moz-range-thumb {
                width: 12px;
                height: 12px;
                background: rgb(115, 74, 253);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 8px rgba(115, 74, 253, 0.5);
                border: none;
              }
              
              @keyframes neuralActivation {
                0% {
                  opacity: 0;
                  transform: translateY(30px) scale(0.9);
                  filter: blur(10px);
                }
                50% {
                  opacity: 0.7;
                  transform: translateY(10px) scale(0.95);
                  filter: blur(2px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                  filter: blur(0px);
                }
              }
              
              @keyframes quantumPulse {
                0%, 100% {
                  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6), 0 0 40px rgba(0, 220, 130, 0.3);
                  transform: scale(1);
                }
                50% {
                  box-shadow: 0 0 30px rgba(0, 220, 130, 0.8), 0 0 60px rgba(0, 220, 130, 0.5);
                  transform: scale(1.1);
                }
              }
              
              @keyframes standbyGlow {
                0%, 100% {
                  box-shadow: 0 0 20px rgba(58, 134, 255, 0.6), 0 0 40px rgba(58, 134, 255, 0.3);
                }
                50% {
                  box-shadow: 0 0 25px rgba(58, 134, 255, 0.7), 0 0 50px rgba(58, 134, 255, 0.4);
                }
              }
              
              @keyframes coreFlicker {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 0.3; }
              }
              
              @keyframes holographicShimmer {
                0%, 100% {
                  background-position: -200% 0;
                  text-shadow: 0 0 30px rgba(58, 134, 255, 0.5);
                }
                50% {
                  background-position: 200% 0;
                  text-shadow: 0 0 40px rgba(58, 134, 255, 0.8);
                }
              }
              
              @keyframes frequencyBar1 {
                0%, 100% { height: 4px; opacity: 0.6; }
                50% { height: 12px; opacity: 1; }
              }
              
              @keyframes frequencyBar2 {
                0%, 100% { height: 7px; opacity: 0.6; }
                50% { height: 15px; opacity: 1; }
              }
              
              @keyframes frequencyBar3 {
                0%, 100% { height: 10px; opacity: 0.6; }
                50% { height: 18px; opacity: 1; }
              }
              
              @keyframes frequencyBar4 {
                0%, 100% { height: 13px; opacity: 0.6; }
                50% { height: 20px; opacity: 1; }
              }
              
              @keyframes quantumCore {
                0%, 100% {
                  opacity: 0.1;
                  transform: translate(-50%, -50%) scale(1);
                }
                50% {
                  opacity: 0.3;
                  transform: translate(-50%, -50%) scale(1.2);
                }
              }
              
              @keyframes statusPulse {
                0%, 100% {
                  opacity: 1;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.7;
                  transform: scale(1.2);
                }
              }
              
              @keyframes notificationSlide {
                0% {
                  opacity: 0;
                  transform: translateX(100%) scale(0.8);
                  filter: blur(10px);
                }
                60% {
                  opacity: 0.8;
                  transform: translateX(-10px) scale(1.02);
                  filter: blur(2px);
                }
                100% {
                  opacity: 1;
                  transform: translateX(0) scale(1);
                  filter: blur(0);
                }
              }
              
              @keyframes notificationProgress {
                0% {
                  transform: scaleX(1);
                }
                100% {
                  transform: scaleX(0);
                }
              }
              
              @keyframes progressShimmer {
                0% {
                  transform: translateX(-100%);
                  opacity: 0;
                }
                50% {
                  opacity: 1;
                }
                100% {
                  transform: translateX(100%);
                  opacity: 0;
                }
              }
            `}} />
          </div>
        )}
      </ClientLayout>
    </BackgroundProvider>
  );
};

export default Layout; 
 