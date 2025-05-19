import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { syncDatabase } from './config/database.js';
import './models/associations.js';  // Import associations to ensure they're set up

dotenv.config();

const app = express();

// Configure CORS for credentials
app.use(cors({
  origin: [
    'https://frontend-notes-febrian-dot-g-09-450802.uc.r.appspot.com',
    'http://localhost:3000',
    null 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// Use routes
app.use(routes);

// Sync database before starting server
syncDatabase().then(() => {
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});