require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const KindWord = require('./models/KindWord');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Initial kind words for seeding the database
const initialKindWords = [
  "Every day is a new opportunity to shine!",
  "You make the world a better place just by being you!",
  "Your potential is limitless!",
  "You're stronger than you know!",
  "Your smile brightens everyone's day!",
  "You've got this! Keep pushing forward!",
  "Every small step counts towards your goals!",
  "Your determination is inspiring!",
  "Success is in your future!",
  "You're making progress every day!",
  "It's okay to take things one day at a time.",
  "You're doing the best you can, and that's enough.",
  "Every storm passes eventually.",
  "You're never alone in this journey.",
  "Your feelings are valid and important.",
  "You inspire others more than you realize!",
  "Your kindness makes a difference!",
  "You're capable of amazing things!",
  "Your presence is a gift to those around you!",
  "You have a beautiful heart!"
];

// Constants for the game
const POINTS_NEEDED_FOR_WORD = 15;
const POINTS_PER_GAME = {
  number: 2,
  snake: 1  // 1 point per food eaten
};
//test2
// Seed the database if empty
async function seedDatabase() {
  try {
    const count = await KindWord.countDocuments();
    if (count === 0) {
      const words = initialKindWords.map(message => ({ message }));
      await KindWord.insertMany(words);
      console.log('Database seeded successfully');
    }

    // Create default user if none exists
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({ points: 10 }); // Start with 10 points
      console.log('Default user created');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Call seedDatabase when the app starts
seedDatabase();

// Get user points
app.get('/api/user/points', async (req, res) => {
  try {
    const user = await User.findOne();
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching points' });
  }
});

// Mini-game endpoint
app.post('/api/game/play', async (req, res) => {
  try {
    const user = await User.findOne();
    const { gameType, points } = req.body;

    if (points > 0) {
      user.points += points;
      user.lastGamePlayed = new Date();
      await user.save();
    }

    res.json({ 
      points: user.points,
      pointsNeeded: POINTS_NEEDED_FOR_WORD
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating points' });
  }
});

// Get random kind word (now requires points)
app.post('/api/random-word', async (req, res) => {
  try {
    const user = await User.findOne();

    if (user.points < POINTS_NEEDED_FOR_WORD) {
      return res.status(403).json({ 
        error: 'Not enough points',
        points: user.points,
        pointsNeeded: POINTS_NEEDED_FOR_WORD
      });
    }

    const count = await KindWord.countDocuments();
    const random = Math.floor(Math.random() * count);
    const word = await KindWord.findOne().skip(random);
    
    // Deduct points
    user.points -= POINTS_NEEDED_FOR_WORD;
    await user.save();

    res.json({ 
      message: word.message,
      points: user.points,
      pointsNeeded: POINTS_NEEDED_FOR_WORD
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching random word' });
  }
});

// Add new kind word
app.post('/api/words', async (req, res) => {
  try {
    const { message } = req.body;
    const newWord = new KindWord({ message });
    await newWord.save();
    res.status(201).json(newWord);
  } catch (error) {
    res.status(500).json({ error: 'Error adding new word' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
