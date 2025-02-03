import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tab,
  Tabs
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import StarsIcon from '@mui/icons-material/Stars';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import NumberGame from './components/NumberGame';
import SnakeGame from './components/SnakeGame';

const API_BASE_URL = 'http://localhost:5000/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background: 'linear-gradient(145deg, #ffffff 0%, #F5F3FF 100%)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25)',
  },
}));

const MessageBox = styled(Box)(({ theme }) => ({
  minHeight: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(3, 0),
  padding: theme.spacing(3),
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
  boxShadow: 'inset 0 2px 4px rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.1)',
}));

const GameButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: '15px 25px',
  fontSize: '1.1rem',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [points, setPoints] = useState(0);
  const [pointsNeeded, setPointsNeeded] = useState(15);
  const [gameOpen, setGameOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(0);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/points`);
      setPoints(response.data.points);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const fetchRandomWord = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/random-word`);
      setMessage(response.data.message);
      setPoints(response.data.points);
      setPointsNeeded(response.data.pointsNeeded);
      setError('');
    } catch (err) {
      if (err.response?.data?.error === 'Not enough points') {
        setError(`You need ${err.response.data.pointsNeeded - err.response.data.points} more points to get a new word!`);
      } else {
        setError('Failed to fetch a kind word. Please try again later!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGameOver = async (gamePoints) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/game/play`, {
        gameType: selectedGame === 0 ? 'number' : 'snake',
        points: gamePoints
      });
      setPoints(response.data.points);
      setPointsNeeded(response.data.pointsNeeded);
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const handleGameChange = (event, newValue) => {
    setSelectedGame(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <StyledPaper elevation={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #7C3AED 30%, #8B5CF6 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4,
          }}>
            Kind Words
            <FavoriteIcon sx={{ ml: 1, color: '#7C3AED' }} />
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip
              icon={<StarsIcon />}
              label={`${points} Points`}
              sx={{
                background: 'linear-gradient(45deg, #7C3AED 30%, #8B5CF6 90%)',
                color: 'white',
                fontSize: '1rem',
                padding: '20px 10px',
              }}
            />
          </Box>

          <MessageBox>
            {loading ? (
              <CircularProgress sx={{ color: '#7C3AED' }} />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Typography variant="h5" sx={{ 
                fontStyle: 'italic', 
                color: '#4C1D95',
                fontWeight: 500,
                lineHeight: 1.6,
                textShadow: '1px 1px 1px rgba(139, 92, 246, 0.1)'
              }}>
                {message || "Play games to earn points and unlock kind words!"}
              </Typography>
            )}
          </MessageBox>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={fetchRandomWord}
              startIcon={<AutorenewIcon />}
              disabled={points < pointsNeeded}
              sx={{
                background: 'linear-gradient(45deg, #8B5CF6 30%, #A78BFA 90%)',
                color: 'white',
                padding: '10px 30px',
                fontSize: '1.1rem',
                mb: 2,
                opacity: points < pointsNeeded ? 0.7 : 1,
                '&:hover': {
                  background: 'linear-gradient(45deg, #7C3AED 30%, #8B5CF6 90%)',
                },
              }}
            >
              New Kind Word ({pointsNeeded} points)
            </Button>

            <Box>
              <Button
                variant="outlined"
                onClick={() => setGameOpen(true)}
                startIcon={<SportsEsportsIcon />}
                sx={{
                  borderColor: '#8B5CF6',
                  color: '#7C3AED',
                  '&:hover': {
                    borderColor: '#7C3AED',
                    background: 'rgba(139, 92, 246, 0.1)',
                  },
                }}
              >
                Play Games
              </Button>
            </Box>
          </Box>
        </Box>
      </StyledPaper>

      <Dialog 
        open={gameOpen} 
        onClose={() => setGameOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#4C1D95' }}>
          Mini-Games
        </DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedGame} 
            onChange={handleGameChange}
            centered
            sx={{
              '& .MuiTab-root': { color: '#7C3AED' },
              '& .Mui-selected': { color: '#4C1D95' },
            }}
          >
            <Tab label="Number Guess" />
            <Tab label="Snake" />
          </Tabs>
        </Box>
        <DialogContent>
          {selectedGame === 0 ? (
            <NumberGame onGameOver={handleGameOver} />
          ) : (
            <SnakeGame onGameOver={handleGameOver} />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={() => setGameOpen(false)}
            sx={{ color: '#7C3AED' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
