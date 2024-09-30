import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoute from './routes/authRoute'; // Keep if you want registration
import userRoutes from './routes/userRoutes'; // You may remove this if not needed
import contentRoutes from './routes/contentRoutes';

dotenv.config(); // Load environment variables from .env file
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3001',  // Allow localhost during development
    'https://44tagtalks.vercel.app',  // Allow the deployed frontend
    'https://44tagtalks-server.vercel.app'  // Allow the deployed server
  ],
  credentials: true,  // Allow credentials (e.g., cookies)
  methods: ['GET', 'POST', 'PUT',],  // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
}));



// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

// Use the routes
app.use('/api/auth', authRoute); // Keep if you want registration
app.use("/api/users", userRoutes); // You may remove this if not needed
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/api/posts', contentRoutes);

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Start the server
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
};

start().catch((error) => {
  console.error('Error starting server:', error);
});