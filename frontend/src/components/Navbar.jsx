import React from "react";
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import Button from './MenuButton';
import './Styles/Navbar.css';

const Navbar = ({ setShowGraphs, setShowTable, setIsLeftVisible }) => {
    
    const { user } = useContext(UserContext);

    const handleHomeClick = () => {
        console.log('Home clicked');
        setShowGraphs(true); // Show graphs
        setShowTable(false); // Hide table
        setIsLeftVisible(false); // Optionally hide the left section
    };

    const handleStudentClick = () => {
        console.log('Student Management clicked');
        setShowGraphs(false); // Hide graphs
        setShowTable(true); // Show table
        setIsLeftVisible(true); // Optionally show the left section
    };

    const handleTeacherClick = () => {
        console.log('Teacher clicked');
        // Implement similar logic if needed
    };

    const handleReportsClick = () => {
        console.log('Report clicked');
        // Implement similar logic if needed
    };

    const handleLogoutClick = () => {
        console.log('Logout clicked');
        // Implement logout functionality
    };

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
