import React from 'react';
import './Styles/MenuButton.css';

const Button = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className="MenuButton">
            {text}
        </button>
    );
};

export default Button;
