import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlindBox from './components/BlindBox';
import CharacterCard from './components/CharacterCard';
import './App.css';

// Asset paths
const BG_IMAGE = '/assets/bg_christmas.png';
const CHARACTERS = [
  { id: 'molly', name: 'Molly', image: '/assets/char_molly.png', desc: 'The pouting painter!' },
  { id: 'dimoo', name: 'Dimoo', image: '/assets/char_dimoo.png', desc: 'Dreaming in the clouds.' },
  { id: 'labubu', name: 'Labubu', image: '/assets/char_labubu.png', desc: 'Mischievous but cute!' },
  { id: 'skullpanda', name: 'Skullpanda', image: '/assets/char_skullpanda.png', desc: 'Cool and futuristic style.' },
];

// Audio paths
const BGM_PATH = '/assets/music/background.mp3';
const CLICK_SFX_PATH = '/assets/music/button_click.wav';
const REVEAL_SFX_PATH = '/assets/music/character_reveal.wav';

function App() {
  const [stage, setStage] = useState<'intro' | 'unboxing' | 'revealed'>('intro');
  const [character, setCharacter] = useState(CHARACTERS[0]);

  // Audio refs
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const clickSfxRef = useRef<HTMLAudioElement | null>(null);
  const revealSfxRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    bgmRef.current = new Audio(BGM_PATH);
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.3; // Lower volume for BGM

    clickSfxRef.current = new Audio(CLICK_SFX_PATH);
    revealSfxRef.current = new Audio(REVEAL_SFX_PATH);

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  const playClick = () => {
    if (clickSfxRef.current) {
      clickSfxRef.current.currentTime = 0;
      clickSfxRef.current.play().catch(e => console.log("Audio play failed", e));
    }
  };

  const playReveal = () => {
    if (revealSfxRef.current) {
      revealSfxRef.current.currentTime = 0;
      revealSfxRef.current.play().catch(e => console.log("Audio play failed", e));
    }
  };

  const startUnboxing = () => {
    playClick();

    // Try to start BGM if not playing (user interaction required)
    if (bgmRef.current && bgmRef.current.paused) {
      bgmRef.current.play().catch(e => console.log("BGM play failed", e));
    }

    setStage('unboxing');
    // Randomly select a character
    const randomChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    setCharacter(randomChar);
  };

  const onBoxOpen = () => {
    playReveal();
    setStage('revealed');
  };

  const reset = () => {
    playClick();
    setStage('intro');
  };

  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (bgmRef.current) {
      bgmRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${BG_IMAGE})` }}>
      <button
        className="mute-btn"
        onClick={toggleMute}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            className="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="title">Pop Mart<br />Christmas</h1>
            <button className="start-btn" onClick={startUnboxing}>Open Box</button>
          </motion.div>
        )}

        {stage === 'unboxing' && (
          <BlindBox key="box" onOpen={onBoxOpen} />
        )}

        {stage === 'revealed' && (
          <CharacterCard key="card" character={character} onReset={reset} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
