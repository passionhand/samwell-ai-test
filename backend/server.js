const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const mockTags = [
  'forest',
  'mountain',
  'river',
  'beach',
  'sky',
  'cloud',
  'tree',
  'sun'
];

const UNSPLASH_ACCESS_KEY = 'C-cv9utBYgU4KFsevh5RcL519PF1J45qtwDKjdiMHAE';

app.get('/images', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/random?query=nature&count=10&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching images' });
    console.log('Error fetching images');
  }
});

app.post('/analyze', (req, res) => {
  const { imageUrl } = req.body;

  const generatedTags = [];
  const numberOfTags = Math.floor(Math.random() * 3) + 3;

  const availableTags = [...mockTags];

  for (let i = 0; i < numberOfTags && availableTags.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableTags.length);
    generatedTags.push(availableTags[randomIndex]);
    availableTags.splice(randomIndex, 1);
  }
  res.json({ tags: generatedTags });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
