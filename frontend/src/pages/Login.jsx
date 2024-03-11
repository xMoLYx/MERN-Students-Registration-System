import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        username: '',
        password: '',
    })

    const loginUser = async (e) => {
        e.preventDefault()
        const {username, password} = data
        try {
            const {data} = await axios.post('/', {
                username,
                password
            });
            if(data.error) {
                toast.error(data.error)
            } else {
                toast.success('Login successful! Welcome!')
                setData({})
                navigate('/home')
            }
        } catch (error) {
            
        }
    }

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
                    <div className="login_register">
                        <p>Don't have an account? <a href="#" className="register-link">Register</a></p>
                    </div>
                </form>
            </div>
      </div>
    )
}
