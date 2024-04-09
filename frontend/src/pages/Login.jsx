import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const loginUser = async (e) => {
        e.preventDefault();
        const { username, password } = data;
        try {
            const { data } = await axios.post('/', {
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

    useEffect(() => {
        const box = document.querySelector('.box');
        const gotoLogin = document.querySelector('.login-link');
        const gotoRegister = document.querySelector('.register-link');

        const handleRegisterClick = () => {
            box.classList.add('active');
        };

        const handleLoginClick = () => {
            box.classList.remove('active');
        };

        gotoRegister.addEventListener('click', handleRegisterClick);
        gotoLogin.addEventListener('click', handleLoginClick);

        return () => {
            gotoRegister.removeEventListener('click', handleRegisterClick);
            gotoLogin.removeEventListener('click', handleLoginClick);
        };
    }, []);

    return (
        <div className="box">
            <div className="main_box login">
                <h2>Login</h2>
                <form onSubmit={loginUser}>
                    <div className="input_box">
                    <span className="icon"><ion-icon name="person-outline"></ion-icon></span>
                    <input type="text" value={data.username} onChange={(e) => setData({...data, username: e.target.value})}/>
                    <label>Username</label>
                </div>
                <div className="input_box">
                    <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                    <input type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
                    <label>Password</label>
                </div>
                <div className="forgot">
                    <a href="#">Forgot Password?</a>
                </div>
                <button type="submit" className="button">Login</button>
                </form>
                <div className="login_register">
                    <p>Don't have an account? <a href="#" className="register-link">Register</a></p>
                </div>
            </div>
            <div className="main_box register">
                <h2>Registration</h2>
                <form onSubmit={registerUser}>
                    <div className="input_box">
                        <span className="icon"><ion-icon name="person-outline"></ion-icon></span>
                        <input type='text' value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
                        <label>Username</label>
                    </div>
                    <div className="input_box">
                        <span className="icon"><ion-icon name="mail-outline"></ion-icon></span>
                        <input type='email' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                        <label>Email</label>
                    </div>
                    <div className="input_box">
                        <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                        <input type='password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                        <label>Password</label>
                    </div>
                    <div className="terms">
                        <input type="checkbox" className="checkbox" required/>I accept the terms & conditions
                    </div>
                    <button type="submit" className="button">Register</button>
                    <div className="login_register">
                        <p>Already have an account? <a href="#" className="login-link">Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
