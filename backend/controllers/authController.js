const User = require('../modules/user');
const {hashPassword, comparePassword} = require('../helpers/auth');
const jwt = require('jsonwebtoken');


const test = (req, res) => {
    res.json('test is working')
}

//register
const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        //check if username was entered
        if(!username) {
            return res.json({
                error: 'Username is required'
            })
        }
        //password check
        if(!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        }
        //check email
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
        //create user in db
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

//login
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
    test,
    registerUser,
    loginUser,
    getProfile
}