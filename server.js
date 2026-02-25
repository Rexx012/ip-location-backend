// 1. Safely load dotenv ONLY when testing locally
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = process.env.PORT || 8000;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/api/login', async (req, res) => {
  const requestData = req.body.requestData || req.body;
  const { email, password } = requestData;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user || user.password !== password) {
      return res.json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    res.json({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

module.exports = app;
