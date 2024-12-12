import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import the useParams hook
import { toast } from 'react-hot-toast';
import './styles/ResetPassword.css';

const ResetPassword = () => {
    const { token } = useParams(); // Extract the token from the URL
    const navigate = useNavigate(); // Initialize the navigate function using useNavigate hook
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const { password, confirmPassword } = formData;

    // Function to handle password reset
    const resetPassword = async (e) => {
        e.preventDefault();
        try {
            // Check if passwords match
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
            // Send a request to update the password
            const response = await axios.post('/update-password', {
                token: token, // Include the token in the request
                newPassword: password
            });
            console.log(response.data);
            toast.success('Password change was successful! Redirecting to login...');
            // Redirect to login page after successful password reset
            setTimeout(() => {
                navigate('/');
            }, 2000) 
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className='container'>
            <div className="box">
                <div className="main_box">
                    <h2>Reset Password</h2>
                    <form onSubmit={resetPassword}>
                        <div className="input_box">
                            <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                            {/* Input field for password */}
                            <input type="password" value={password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                            <label>Password</label>
                        </div>
                        <div className="input_box">
                            <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                            {/* Input field for confirming password */}
                            <input type="password" value={confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                            <label>Confirm Password</label>
                        </div>
                        {/* Button to submit password reset form */}
                        <button type="submit" className="button">Reset Password</button>
                        <div className="login_register">
                            {/* Link to navigate back to login page */}
                            <p>Remembered your password? <a href="#" className="backlogin-link" onClick={() => navigate('/')}>Back to Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
