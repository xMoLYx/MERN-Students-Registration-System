import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import { IonIcon } from '@ionic/react';
import { personOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';
import './Styles/Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: '',
        password: '',
        email: ''
    });

    // Function to handle user login
    const loginUser = async (e) => {
        e.preventDefault();
        const { username, password } = data;
        try {
            const { data } = await axios.post('/login', {
                username,
                password
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success('Login successful! Welcome!');
                setData({});
                navigate('/Dashboard');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Function to handle user registration
    const registerUser = async (e) => {
        e.preventDefault();
        const { username, email, password } = data;
        try {
            const { data } = await axios.post('/register', {
                username,
                email,
                password
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                setData({});
                toast.success('Registration was successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.reload(); // Reload the page after 2 seconds
                }, 2000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Function to handle password reset request
    const resetPassword = async (e) => {
        e.preventDefault();
        const { email } = data;
        try {
            const { data } = await axios.post('/reset-password', {
                email
            });
            if (data.success) {
                toast.success(data.success);
            } else if (data.error) {
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Function to switch between login, registration, and forgot password views
    const [activeBox, setActiveBox] = useState('login');

    useEffect(() => {
        const box = document.querySelector('.box');
        const loginBox = document.querySelector('.main_box.login');
        const registerBox = document.querySelector('.main_box.register');
        const forgotBox = document.querySelector('.main_box.forgot-password');

        if (box && loginBox && registerBox && forgotBox) {
            if (activeBox === 'login') {
                box.classList.remove('active');
                loginBox.style.transform = 'translateX(0)';
                registerBox.style.transform = 'translateX(100%)';
                forgotBox.style.transform = 'translateX(100%)';
            } else if (activeBox === 'register') {
                box.classList.add('active');
                loginBox.style.transform = 'translateX(-100%)';
                registerBox.style.transform = 'translateX(0)';
                forgotBox.style.transform = 'translateX(100%)';
            } else if (activeBox === 'forgot-password') {
                box.classList.add('active');
                loginBox.style.transform = 'translateX(-100%)';
                registerBox.style.transform = 'translateX(100%)';
                forgotBox.style.transform = 'translateX(0)';
            }
        }
    }, [activeBox]);

    // Functions to handle view switching
    const handleRegisterClick = () => {
        setActiveBox('register');
    };

    const handleLoginClick = () => {
        setActiveBox('login');
    };

    const handleForgotClick = () => {
        setActiveBox('forgot-password');
    };

    const handleBackToLogin = () => {
        setActiveBox('login');
    };

    return (
        <>
            <Banner class='header-fixed'/>
            <div className='login-page'>
                <div className="box">
                    <div className={`main_box login ${activeBox === 'login' ? 'active' : ''}`}>
                        <h2>Login</h2>
                        <form onSubmit={loginUser}>
                            <div className="input_box">
                                <span className="icon"><IonIcon icon={personOutline}/></span>
                                <input type="text" value={data.username} onChange={(e) => setData({...data, username: e.target.value})} required/>
                                <label>Username</label>
                            </div>
                            <div className="input_box">
                                <span className="icon"><IonIcon icon={lockClosedOutline}/></span>
                                <input type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} required/>
                                <label>Password</label>
                            </div>
                            <div className="forgot">
                                <a href="#" className="forgot-link" onClick={handleForgotClick}>Forgot Password?</a>
                            </div>
                            <button type="submit" className="button">Login</button>
                        </form>
                        <div className="login_register">
                            <p>Don't have an account? <a href="#" className="register-link" onClick={handleRegisterClick}>Register</a></p>
                        </div>
                    </div>

                    <div className={`main_box register ${activeBox === 'register' ? 'active' : ''}`}>
                        <h2>Registration</h2>
                        <form onSubmit={registerUser}>
                            <div className="input_box">
                                <span className="icon"><IonIcon icon={personOutline}/></span>
                                <input type="text" value={data.username} onChange={(e) => setData({...data, username: e.target.value})} required/>
                                <label>Username</label> 
                            </div>
                            <div className="input_box">
                                <span className="icon"><IonIcon icon={mailOutline}/></span>
                                <input type="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} required />
                                <label>Email</label>
                            </div>
                            <div className="input_box">
                                <span className="icon"><IonIcon icon={lockClosedOutline}/></span>
                                <input type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} required/>
                                <label>Password</label>
                            </div>
                            <div className="terms">
                                <input type="checkbox" className="checkbox" required/>I accept the terms & conditions
                            </div>
                            <button type="submit" className="button">Register</button>
                            <div className="login_register">
                                <p>Already have an account? <a href="#" className="login-link" onClick={handleLoginClick}>Login</a></p>
                            </div>
                        </form>
                    </div>

                    <div className={`main_box forgot-password ${activeBox === 'forgot-password' ? 'active' : ''}`}>
                        <h2>Forgot Password</h2>
                        <form onSubmit={resetPassword}>
                            <div className="input_box">
                                <span className="icon"><IonIcon icon={mailOutline}/></span>
                                <input type="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} required />
                                <label>Email</label>
                            </div>
                            <button type="submit" className="button">Reset Password</button>
                            <div className="login_register">
                                <p>Remembered your password? <a href="#" className="backlogin-link" onClick={handleBackToLogin}>Back to Login</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
