import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const POINTS_FOR_FOOD = 1;

const GameContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
});

const GameBoard = styled(Box)({
  border: '2px solid #8B5CF6',
  borderRadius: '8px',
  backgroundColor: '#F5F3FF',
  position: 'relative',
  width: GRID_SIZE * CELL_SIZE,
  height: GRID_SIZE * CELL_SIZE,
});

const Cell = styled(Box)({
  position: 'absolute',
  width: CELL_SIZE,
  height: CELL_SIZE,
  borderRadius: '4px',
});

const SnakeCell = styled(Cell)({
  backgroundColor: '#7C3AED',
  border: '1px solid #6D28D9',
});

const FoodCell = styled(Cell)({
  backgroundColor: '#F87171',
  border: '1px solid #EF4444',
});

function SnakeGame({ onGameOver }) {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    generateFood();
    setGameStarted(false);
  };

  const checkCollision = (head) => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }

    return false;
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || !gameStarted) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (checkCollision(head)) {
      setIsGameOver(true);
      onGameOver(score * POINTS_FOR_FOOD);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 1);
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, gameStarted, score, generateFood, onGameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <GameContainer>
      <Typography variant="h6" sx={{ color: '#4C1D95', mb: 2 }}>
        Score: {score}
      </Typography>
      
      <GameBoard>
        {snake.map((cell, i) => (
          <SnakeCell
            key={i}
            sx={{
              left: cell.x * CELL_SIZE,
              top: cell.y * CELL_SIZE,
              opacity: i === 0 ? 1 : 0.8 - i * 0.1,
            }}
          />
        ))}
        <FoodCell
          sx={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />
      </GameBoard>

      {!gameStarted && !isGameOver && (
        <Button
          variant="contained"
          onClick={() => setGameStarted(true)}
          sx={{
            mt: 2,
            background: 'linear-gradient(45deg, #8B5CF6 30%, #A78BFA 90%)',
            color: 'white',
          }}
        >
          Start Game
        </Button>
      )}

      {isGameOver && (
        <>
          <Typography variant="h6" color="error" sx={{ mt: 2 }}>
            Game Over! Points earned: {score * POINTS_FOR_FOOD}
          </Typography>
          <Button
            variant="contained"
            onClick={resetGame}
            sx={{
              mt: 2,
              background: 'linear-gradient(45deg, #8B5CF6 30%, #A78BFA 90%)',
              color: 'white',
            }}
          >
            Play Again
          </Button>
        </>
      )}

      <Typography variant="body2" sx={{ mt: 2, color: '#6D28D9' }}>
        Use arrow keys to control the snake
      </Typography>
    </GameContainer>
  );
}

export default SnakeGame;
