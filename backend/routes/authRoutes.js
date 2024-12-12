const express = require('express');
const router = express.Router();
const cors = require('cors');
const { resetPassword, updatePassword, registerUser, loginUser, getProfile, logoutUser } = require('../controllers/authController');
const { getSupervisors, getAllTeachers, updateTeacher, addTeacher, deleteTeacher } = require('../controllers/teachersController');
const { getLatestStudents, getAllStudents, updateStudent, addStudent, deleteStudent} = require('../controllers/studentsController');

// Middleware for enabling CORS with credentials and setting origin
router.use(
    cors({
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        origin: ['http://localhost:4173', 'http://localhost:5173']
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

// Route for user logout
router.post('/logout', logoutUser);

// Route to get all supervisors
router.get('/api/supervisors', getSupervisors);

// Route to get the latest 10 students
router.get('/api/students/latest', getLatestStudents);

// Route to get all students
router.get('/api/students', getAllStudents);

// Route to update a student's data
router.put('/api/students/:id', updateStudent);

// Route to add a student
router.post('/addStudent', addStudent)

// Route to delete a student
router.delete('/api/students/:id', deleteStudent);

// Route to get all teachers
router.get('/api/Teachers', getAllTeachers);

// Route to update a teacher's data
router.put('/api/teachers/:id', updateTeacher);

// Route to add a teacher
router.post('/addTeacher', addTeacher)

// Route to delete a teacher
router.delete('/api/teachers/:id', deleteTeacher);

module.exports = router;
