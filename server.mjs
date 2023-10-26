
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

import { ZtmSession } from './api/warsaw-wtp-api.js';
const ztmSession = new ZtmSession('98d4a59a-0237-4480-9842-6811337ea267');

// Define an endpoint for fetching bus locations
app.post('/getBusLocation', async (req, res) => {
  try {
      const { busNumber } = req.body;
      const locations = await ztmSession.getBusesLocation(busNumber);

      res.json(locations);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`\x1b[32mServer is running on port ${port}\x1b[0m`);
});