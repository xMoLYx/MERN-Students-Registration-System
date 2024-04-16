const User = require('../modules/user');
const {hashPassword, comparePassword} = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config;

// Function to register a new user
const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        // Check if username was entered
        if(!username) {
            return res.json({
                error: 'Username is required'
            })
        }
        // Check password length
        if(!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        }
        // Check email existence
        const exist = await User.findOne({email});
        if(exist) {
            return res.json({
                error: 'Email is already taken'
            })
        }
        if(!email) {
            return res.json({
                error: 'Email is required'
            })
        }
        const hashedPassword = await hashPassword(password);
        // Create user in the database
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })
        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}

// Function to log in a user
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;

        // Check if user exists in the database
        const user = await User.findOne({username});
        if (!user) {
            return res.json({
                error: 'No User found'
            });
        }

        // Check if password matches
        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign({username: user.username, id: user._id, email: user.email}, process.env.JWG_SECRET, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json(user)
            })
        } else {
            // If password doesn't match, send an error response
            return res.json({
                error: 'Incorrect Password'
            });
        }
    } catch (error) {
        console.log(error);
        // Handle any unexpected errors
        return res.status(500).json({
            error: 'Internal Server Error'
        }); 
    }
}

// Function to send password reset email
const sendPasswordResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SERVER,
        port: process.env.PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'Password reset',
        text: `Click this link to reset your password: http://localhost:5173/reset-password/${token}`
    };

    await transporter.sendMail(mailOptions);
}

// Function to reset user password
const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists in the database
        const user = await User.findOne({ email });
        const token = user._id
        if (!user) {
            return res.json({
                error: 'No user found with this email address'
            });
        }

        // Send password reset email with token-containing link
        await sendPasswordResetEmail(email, token);

        return res.json({
            success: 'Password reset email has been sent',
            token: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

// Function to update user password
const updatePassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {

        const hashedPassword = await hashPassword(newPassword);
        const user = await User.findOneAndUpdate({ _id: token }, { password: hashedPassword }, { new: true });

        if (!user) {
            // If user not found, return error
            return res.status(404).json({ error: 'User not found' });
        }

        // Return success response after password update
        return res.json({ success: 'Password updated successfully' });
    } catch (error) {
        // Handle errors if any
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get user profile
const getProfile = (req, res) => {
    const {token} = req.cookies
    if(token) {
        jwt.verify(token, process.env.JWG_SECRET, {}, (err, user) => {
            if(err) throw err;
            res.json(user)
        })
    } else {
        res.json(null)
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    resetPassword,
    updatePassword
}
