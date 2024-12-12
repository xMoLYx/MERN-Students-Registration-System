import React from 'react';
import './Styles/StudentsByFoS.css';


const StudentsByFoS = () => {
    const chartLink = import.meta.env.VITE_STUDENTS_BY_FOS;

    return (
            <iframe className='StudentsByFoS' src={chartLink}></iframe>
    );
};

export default StudentsByFoS;