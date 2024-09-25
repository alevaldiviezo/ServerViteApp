require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import mongoose
const session = require('express-session');
const passport = require('passport');
const User = require('./models/User');
const initializePassport = require('./passport-config');
const Service = require('./models/Service'); // Import the Service model
const path = require('path'); // Import path module

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET, // Use SESSION_SECRET from .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // Set cookie options
}));
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
// app.use(cors());
app.use(cors({
    // origin: 'http://localhost:5173', // Replace with your React app's URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// MongoDB connection
const mongoURI = 
                process.env.MONGO_URI; // Use MONGO_URI from .env
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Initialize Passport
initializePassport(passport);






// Sample route
app.get('/api', (req, res) => {
    return res.json({ message: 'Welcome to the API!' });
})
// Sample route to get services
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find();
        return res.json(services);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Registration route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({ username, email });
        await User.register(newUser, password); // Use passport-local-mongoose to register
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Logged in successfully', user: req.user });
});

// Authentication check route
app.get('/api/authenticated', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ authenticated: true, user: req.user });
    }
    res.json({ authenticated: false });
});

// Logout route
app.post('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
    // res.json({ message: 'Logged out successfully' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './client/build'))); // Adjust the path to your build directory

// // The "catchall" handler: for any request that doesn't match one above, send back the React app.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build', 'index.html')); // Adjust the path to your build directory
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});