const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
// Import the User model
const User = require('./database'); // Adjust the path according to your folder structure

// Initialize express
const app = express();
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for cross-origin requests

// MongoDB Connection (replace with your own MongoDB URL if needed)
mongoose.connect('mongodb://localhost:27017/login', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// JWT Secret key
const JWT_SECRET = 'mysecretkey'; // Change this to a more secure key

// **Sign Up Route** - For registering new users
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save(); // Save user in the database

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// **Sign In Route** - For authenticating existing users
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token, message: 'Logged in successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Start the server on port 5000 (or any other port you choose)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
