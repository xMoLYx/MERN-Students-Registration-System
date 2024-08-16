import React from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import Button from './MenuButton';
import './Styles/Navbar.css';

const Navbar = ({ onHomeClick, onStudentClick, onTeacherClick, onReportsClick, onLogoutClick }) => {

    const handleHomeClick = () => {
        console.log('Home clicked');
        onHomeClick(); // Call the prop function to show graphs and hide the table
    };

    const handleStudentClick = () => {
        console.log('Student Management clicked');
        onStudentClick(); // Call the prop function to show the table and hide the graphs
    };

    const handleTeacherClick = () => {
        console.log('Teacher clicked');
        onTeacherClick(); // Optional: Implement similar logic for teacher management
    };

    const handleReportsClick = () => {
        console.log('Report clicked');
        onReportsClick(); // Optional: Implement similar logic for reports
    };

    const handleLogoutClick = () => {
        console.log('Logout clicked');
        onLogoutClick(); // Optional: Implement logout functionality
    };

    const { user } = useContext(UserContext);

    return (
        <div className="Navbar"> 
            {!!user && (<h2>Hi {user.username}!</h2>)}
            <nav className="navbar">
                <Button text="Home" onClick={handleHomeClick} />
                <Button text="Student Management" onClick={handleStudentClick} />
                <Button text="Teacher Management" onClick={handleTeacherClick} />
                <Button text="Reports" onClick={handleReportsClick} />
            </nav>
            <Button className='logout' text="Logout" onClick={handleLogoutClick} />
        </div>
    );
};

export default Navbar;
