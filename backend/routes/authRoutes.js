const express = require('express');
const router = express.Router();
const cors = require('cors');
const {resetPassword, updatePassword, registerUser, loginUser, getProfile} = require('../controllers/authController');

// Middleware for enabling CORS with credentials and setting origin
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

// Route for user registration
router.post('/register', registerUser)

// Route for user login
router.post('/', loginUser)

// Route to get user profile
router.get('/profile', getProfile)

// Route to update user password
router.post('/update-password', updatePassword);

// Route to request password reset
router.post('/reset-password', resetPassword);

// Route to handle password reset with token
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    // Render the password reset page and pass the token as part of the template
    res.render('reset_password', { token }); 
});

module.exports = router;
