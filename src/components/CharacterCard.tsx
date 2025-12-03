import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import './CharacterCard.css';

interface Character {
    id: string;
    name: string;
    image: string;
    desc: string;
}

interface CharacterCardProps {
    character: Character;
    onReset: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onReset }) => {
    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#D42426', '#146B3A', '#FFD700']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#D42426', '#146B3A', '#FFD700']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    return (
        <motion.div
            className="card-container"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
        >
            <div className="card">
                <div className="card-glow"></div>
                <img src={character.image} alt={character.name} className="character-image" />
                <h2 className="character-name">{character.name}</h2>
                <p className="character-desc">{character.desc}</p>
                <button className="reset-btn" onClick={onReset}>Open Another</button>
            </div>
        </motion.div>
    );
};

export default CharacterCard;
