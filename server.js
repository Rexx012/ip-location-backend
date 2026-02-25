require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const app = express();
const port = process.env.PORT || 8000;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body.requestData;

  try {
    //  Search the database for a user with this username
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    //  If the user doesn't exist, or the password doesn't match, reject them
    if (!user || user.password !== password) {
      return res.json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    //   If everything matches, send a success response!
    res.json({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
