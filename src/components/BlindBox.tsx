import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './BlindBox.css';

const getAssetPath = (path: string) => {
    return import.meta.env.BASE_URL + path.replace(/^\//, '');
};

const BOX_IMAGE = getAssetPath('/assets/box_closed.png');

interface BlindBoxProps {
    onOpen: () => void;
}

const SHAKE_SFX_PATH = getAssetPath('/assets/music/shaking_box.wav');

const BlindBox: React.FC<BlindBoxProps> = ({ onOpen }) => {
    const [isShaking, setIsShaking] = useState(false);

    // Audio ref
    const shakeSfxRef = React.useRef<HTMLAudioElement | null>(null);

    React.useEffect(() => {
        shakeSfxRef.current = new Audio(SHAKE_SFX_PATH);
    }, []);

    const handleBoxClick = () => {
        if (isShaking) return;
        setIsShaking(true);

        // Play shake sound
        if (shakeSfxRef.current) {
            shakeSfxRef.current.currentTime = 0;
            shakeSfxRef.current.play().catch(e => console.log("Audio play failed", e));
        }

        // Shake for 1 second then open
        setTimeout(() => {
            onOpen();
        }, 1000);
    };

    const shakeVariants = {
        idle: { rotate: 0, scale: 1 },
        shaking: {
            rotate: [-5, 5, -5, 5, -5, 5, 0],
            scale: [1, 1.1, 1, 1.1, 1, 1.1, 1],
            transition: { duration: 0.5, repeat: 2 }
        }
    };

    return (
        <div className="blind-box-container">
            <p className="instruction">Tap to Open!</p>
            <motion.div
                className="blind-box"
                variants={shakeVariants}
                animate={isShaking ? 'shaking' : 'idle'}
                onClick={handleBoxClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.img
                    src={BOX_IMAGE}
                    alt="Blind Box"
                    className="box-image" />
            </motion.div>
        </div>
    );
};

export default BlindBox;
