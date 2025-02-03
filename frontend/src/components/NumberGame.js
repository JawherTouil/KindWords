import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const GameButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: '15px 25px',
  fontSize: '1.1rem',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

function NumberGame({ onGameOver }) {
  const [targetNumber, setTargetNumber] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const POINTS_FOR_WIN = 2;

  const startGame = () => {
    setTargetNumber(Math.floor(Math.random() * 10) + 1);
    setAttempts(0);
    setGameStarted(true);
  };

  const makeGuess = (guess) => {
    setAttempts(prev => prev + 1);
    
    if (guess === targetNumber) {
      // Player won
      setGameStarted(false);
      onGameOver(POINTS_FOR_WIN);
    } else if (attempts >= 2) {
      // Game over after 3 attempts
      setGameStarted(false);
      onGameOver(0);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      {!gameStarted && !targetNumber && (
        <>
          <Typography variant="h6" sx={{ mb: 2, color: '#4C1D95' }}>
            Guess the Number
          </Typography>
          <Button
            variant="contained"
            onClick={startGame}
            sx={{
              background: 'linear-gradient(45deg, #8B5CF6 30%, #A78BFA 90%)',
              color: 'white',
              mb: 2,
            }}
          >
            Start Game
          </Button>
        </>
      )}

      {gameStarted && (
        <>
          <Typography sx={{ mb: 2 }}>
            Attempts left: {3 - attempts}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <GameButton
                key={num}
                variant="contained"
                onClick={() => makeGuess(num)}
                sx={{
                  background: 'linear-gradient(45deg, #8B5CF6 30%, #A78BFA 90%)',
                  color: 'white',
                }}
              >
                {num}
              </GameButton>
            ))}
          </Box>
        </>
      )}

      {!gameStarted && targetNumber && (
        <Typography variant="h6" sx={{ mt: 2, color: '#4C1D95' }}>
          {targetNumber === parseInt(attempts) ? 
            `Congratulations! You won ${POINTS_FOR_WIN} points!` : 
            'Better luck next time!'}
        </Typography>
      )}
    </Box>
  );
}

export default NumberGame;
