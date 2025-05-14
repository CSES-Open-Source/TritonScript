require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/note');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.options('*', cors()); // Allow preflight requests

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use((req, res, next) => {
  console.log("Headers:", req.headers);
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/notes', require('./routes/note'));

// Connect to database
const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5015;

if (!CONNECTION_URL) {
  console.error('Database connection URL is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(CONNECTION_URL)
  .then(() => {
    console.log('Connected to database');
    app.listen(PORT, () => {
      console.log(`Listening for requests on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
