const express = require('express');
const router = express.Router();
const cors = require('cors');
const { resetPassword, updatePassword, registerUser, loginUser, getProfile } = require('../controllers/authController');
const { getSupervisors } = require('../controllers/teachersController');
const { getLatestStudents, getAllStudents, updateStudent, addStudent, deleteStudent} = require('../controllers/studentsController');

// Middleware for enabling CORS with credentials and setting origin
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
);

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route to get user profile
router.get('/profile', getProfile);

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

// Route to get all supervisors
router.get('/api/supervisors', getSupervisors);

// Route to get the latest 10 students
router.get('/api/students/latest', getLatestStudents);

// Route to get all students
router.get('/api/students', getAllStudents);

// Route to update a student's data
router.put('/api/students/:id', updateStudent);

router.post('/addStudent', addStudent)

router.delete('/api/students/:id', deleteStudent);

module.exports = router;
