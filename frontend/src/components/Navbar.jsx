import React from "react";
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Button from './MenuButton';
import './Styles/Navbar.css';
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios';
import toast from "react-hot-toast";

const Navbar = ({ setShowGraphs, setShowTable, setShowTeacherTable, setIsLeftVisible, setIsStudentTableContainerVisible, setIsTeacherTableContainerVisible }) => {
    
    const { user } = useContext(UserContext);
    const navigate = useNavigate(); // Initialize navigation

    const handleHomeClick = () => {
        console.log('Home clicked');
        setShowGraphs(true); // Show graphs
        setShowTable(false); // Hide table
        setShowTeacherTable(true); // Hide teacher table
        setIsLeftVisible(false); // Optionally hide the left section
    };

    const handleStudentClick = () => {
        console.log('Student Management clicked');
        setShowGraphs(false); // Hide graphs
        setShowTable(true); // Show table
        setShowTeacherTable(false); // Hide teacher table
        setIsLeftVisible(true); // Optionally show the left section
    };

    const handleTeacherClick = () => {
        console.log('Teacher Management clicked');
        setShowGraphs(false); // Hide graphs
        setShowTable(false); // Hide student table
        setShowTeacherTable(true); // Show teacher table
        setIsLeftVisible(true); // Optionally show the left section
    };


    const handleLogoutClick = async () => {
        try {
            // Make a request to your logout endpoint
            await axios.post('/logout');
            
            // Redirect to the login page after successful logout
            navigate('/');
            toast.success("Logout successful!")
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="Navbar"> 
            {!!user && (<h2>Hi {user.username}!</h2>)}
            <nav className="navbar">
                <Button text="Home" onClick={handleHomeClick} />
                <Button text="Student Management" onClick={handleStudentClick} />
                <Button text="Teacher Management" onClick={handleTeacherClick} />
            </nav>
            <Button className='logout' text="Logout" onClick={handleLogoutClick} />
        </div>
    );
};

export default Navbar;
