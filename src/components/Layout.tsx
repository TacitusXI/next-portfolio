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
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Load saved audio state from localStorage on initial render
  useEffect(() => {
    const savedVolume = localStorage.getItem('audioVolume');
    const savedIsPlaying = localStorage.getItem('audioIsPlaying');
    const savedStationIndex = localStorage.getItem('audioStationIndex');
    const savedTrackIndex = localStorage.getItem('audioTrackIndex');
    
    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedStationIndex) setStationIndex(parseInt(savedStationIndex));
    if (savedTrackIndex) setCurrentTrackIndex(parseInt(savedTrackIndex));
    if (savedIsPlaying === 'true') {
      // Delay starting playback to ensure component is fully mounted
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

  // Cyberpunk radio stations
  const stations = [
    { name: "TacitusFM", url: tacitusPlaylist[currentTrackIndex], isPlaylist: true },
    { name: "NightrideFM", url: "https://stream.nightride.fm/nightride.m4a", isPlaylist: false },
    { name: "DarkSynth", url: "https://stream.nightride.fm/darksynth.m4a", isPlaylist: false },
    { name: "ChillSynth", url: "https://stream.nightride.fm/chillsynth.m4a", isPlaylist: false },
    { name: "Synthwave Plaza", url: "https://radio.plaza.one/mp3", isPlaylist: false }
  ];
  
  const currentStation = stations[stationIndex];
  
  // Handle play/pause
  const togglePlay = () => {
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
    const newIndex = (stationIndex + direction + stations.length) % stations.length;
    setStationIndex(newIndex);
    
    // Reset track index when switching away from TacitusFM
    if (stationIndex === 0 && newIndex !== 0) {
      setCurrentTrackIndex(0);
    }
  };
  
  // Handle track ended (for playlist functionality)
  const handleTrackEnded = () => {
    // Only handle auto-advance for TacitusFM playlist
    if (stationIndex === 0) {
      const nextTrackIndex = (currentTrackIndex + 1) % tacitusPlaylist.length;
      setCurrentTrackIndex(nextTrackIndex);
      
      // Extract track name from file path for display
      const trackPath = tacitusPlaylist[nextTrackIndex];
      const fileName = trackPath.split('/').pop() || "";
      const trackName = fileName.replace('.mp3', '').replace(/([a-z])([A-Z])/g, '$1 $2');
      setTrackTitle(trackName);
    }
  };
  
  // Initialize track title on first render
  useEffect(() => {
    if (stationIndex === 0) {
      const trackPath = tacitusPlaylist[currentTrackIndex];
      const fileName = trackPath.split('/').pop() || "";
      const trackName = fileName.replace('.mp3', '').replace(/([a-z])([A-Z])/g, '$1 $2');
      setTrackTitle(trackName);
    } else {
      setTrackTitle("");
    }
  }, [stationIndex, currentTrackIndex]);
  
  // Update audio src when station or track changes
  useEffect(() => {
    if (audioRef.current) {
      // Set the correct URL based on whether it's TacitusFM or other stations
      const url = stationIndex === 0 ? tacitusPlaylist[currentTrackIndex] : currentStation.url;
      audioRef.current.src = url;
      
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Station change error:", err));
      }
    }
  }, [stationIndex, currentTrackIndex, currentStation.url, isPlaying]);
  
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
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Show tooltip less frequently by checking localStorage
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('hasSeenRadioTooltip');
    
    if (!hasSeenTooltip) {
      setTimeout(() => {
        setShowTooltip(true);
      }, 2000);
      
      // Hide tooltip after some time
      setTimeout(() => {
        setShowTooltip(false);
      }, 10000);
      
      // Save that user has seen the tooltip
      localStorage.setItem('hasSeenRadioTooltip', 'true');
    }
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
        
        {/* Radio tooltip notification */}
        {showTooltip && (
          <div 
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '40px',
              width: '230px',
              padding: '15px',
              backgroundColor: 'rgba(10, 11, 14, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(115, 74, 253, 0.3)',
              borderLeft: '3px solid rgb(115, 74, 253)',
              boxShadow: '0 5px 20px rgba(49, 164, 253, 0.2)',
              color: 'white',
              zIndex: 998,
              fontSize: '13px',
              animation: 'fadeIn 0.5s ease-out',
              transform: 'translateX(0)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px',
            }}>
              <span style={{ 
                fontWeight: 'bold', 
                color: 'rgb(115, 74, 253)',
                fontSize: '14px',
              }}>TIP:</span>
              <button
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'rgba(255,255,255,0.5)', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '0',
                }}
                onClick={() => setShowTooltip(false)}
              >
                ✕
              </button>
            </div>
            Check out the Synthwave Radio for immersive background music while browsing!
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
              backgroundColor: 'rgba(10, 11, 14, 0.9)',
              border: '2px solid rgba(115, 74, 253, 0.7)',
              boxShadow: '0 0 20px rgba(49, 164, 253, 0.3)',
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
            }}
            aria-label="Toggle audio player"
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(115, 74, 253, 0.8), transparent)',
              animation: 'scan-line 2s linear infinite',
              opacity: 0.7,
            }}></div>
            
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
              backgroundColor: 'rgba(10, 11, 14, 0.9)',
              borderRadius: '10px',
              padding: '5px 8px',
              fontSize: '11px',
              whiteSpace: 'nowrap',
              color: 'rgb(115, 74, 253)',
              boxShadow: '0 0 10px rgba(49, 164, 253, 0.2)',
              border: '1px solid rgba(115, 74, 253, 0.3)',
            }}>
              {stationIndex === 0 ? `♫ ${trackTitle}` : currentStation.name}
            </div>
          )}
        </div>
        
        {/* Hidden audio element - persist across page transitions */}
        <audio
          ref={audioRef}
          style={{ display: 'none' }}
          src={stationIndex === 0 ? tacitusPlaylist[currentTrackIndex] : currentStation.url}
          preload="auto"
        />
        
        {/* Enhanced cyberpunk audio player */}
        {showPlayer && (
          <div
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              width: '320px',
              padding: '18px',
              backgroundColor: 'rgba(10, 11, 14, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(115, 74, 253, 0.3)',
              borderLeft: '3px solid rgb(115, 74, 253)',
              boxShadow: '0 5px 20px rgba(49, 164, 253, 0.2)',
              color: 'white',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              fontFamily: 'monospace',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid rgba(115, 74, 253, 0.2)',
              paddingBottom: '10px'
            }}>
              <div style={{ 
                fontWeight: 'bold', 
                color: 'rgb(115, 74, 253)',
                fontSize: '14px',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isPlaying ? '#00dc82' : '#f17eb8',
                  boxShadow: isPlaying ? '0 0 5px #00dc82' : '0 0 5px #f17eb8',
                  animation: isPlaying ? 'pulse 1.5s infinite' : 'none'
                }}></span>
                SYNTHWAVE_RADIO
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Hide/Minimize button */}
                <button
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'rgb(49, 164, 253)', 
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    width: '20px',
                    height: '20px'
                  }}
                  onClick={() => setShowPlayer(false)}
                  title="Minimize player (continue playing)"
                >
                  <span style={{ 
                    position: 'absolute',
                    bottom: '5px',
                    left: '3px',
                    right: '3px',
                    height: '2px',
                    background: 'rgb(49, 164, 253)'
                  }}></span>
                </button>
                
                {/* Close button */}
                <button
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'rgb(115, 74, 253)', 
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => {
                    setShowPlayer(false);
                    if (isPlaying) togglePlay(); // Also stop playback
                  }}
                  title="Close player and stop music"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Station info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '5px 0',
            }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onClick={() => changeStation(-1)}
              >
                ◀
              </button>
              
              <div style={{
                textAlign: 'center',
                fontSize: '14px',
                color: 'rgb(49, 164, 253)'
              }}>
                {currentStation.name}
              </div>
              
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onClick={() => changeStation(1)}
              >
                ▶
              </button>
            </div>
            
            {/* Track title display (for TacitusFM) */}
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
            
            {/* Custom player controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px'
            }}>
              {/* Skip back button for TacitusFM */}
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
              
              <button
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: isPlaying ? 'rgba(0, 220, 130, 0.2)' : 'rgba(115, 74, 253, 0.2)',
                  border: `1px solid ${isPlaying ? 'rgba(0, 220, 130, 0.6)' : 'rgba(115, 74, 253, 0.6)'}`,
                  color: isPlaying ? '#00dc82' : 'rgb(115, 74, 253)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'all 0.2s ease'
                }}
                onClick={togglePlay}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>
              
              {/* Skip forward button for TacitusFM */}
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
            </div>
            
            {/* Volume control */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '5px'
            }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>VOL</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  flex: 1,
                  height: '4px',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  background: 'rgba(115, 74, 253, 0.3)',
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>
            
            {/* Status display */}
            <div style={{ 
              fontSize: '10px', 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '1px'
            }}>
              {isPlaying ? (
                <span style={{ color: '#00dc82' }}>● LIVE TRANSMISSION</span>
              ) : (
                <span>SIGNAL READY</span>
              )}
              {stationIndex === 0 && (
                <span style={{ marginLeft: '5px', fontSize: '9px' }}>
                  [{currentTrackIndex + 1}/{tacitusPlaylist.length}]
                </span>
              )}
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
            `}} />
          </div>
        )}
      </ClientLayout>
    </BackgroundProvider>
  );
};

export default Layout; 
 