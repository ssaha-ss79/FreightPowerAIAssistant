import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import { initDb } from './db/init.js';

const app = express();
const port = 3001;

// --- Database Initialization ---
// This will create and seed the database if it doesn't exist.
const db = initDb();

// --- Middleware ---
app.use(cors()); // Allow requests from the frontend
app.use(express.json()); // for parsing application/json

// --- Attach DB to all requests ---
// Make the database instance available to our routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Voice-Driven Smart Logistics Assistant Backend is running!');
});

// All API routes are prefixed with /api/v1
app.use('/api/v1', apiRoutes);

// --- Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
  console.log('Database initialized and ready.');
});

// Graceful shutdown
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

