const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport'); // Load strategies
const expressSession = require("express-session")

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/orgRoutes');
const scrapeRoutes = require('./routes/scrapeRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const { connectRedis } = require('./config/redis');
const configurePassport = require('./config/passportconfig');
require('dotenv').config();

const app = express();
app.use(cors()); 

app.use(passport.initialize());
app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 172800000 },
    name: "googleauth"
  })
);
app.use(passport.session());

// passport js google auth
configurePassport({
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackURL: "http://localhost:8000/api/auth/google/callback",
  passport
})

// Middleware
app.use(express.json());

// Database
connectDB();

// Redis
connectRedis()

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/integration', integrationRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));