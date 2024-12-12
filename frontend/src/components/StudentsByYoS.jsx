import React from 'react';
import './styles/StudentsByYoS.css';

const StudentsByYoS = () => {
    const chartLink = import.meta.env.VITE_STUDENTS_BY_YOS;

    return (
            <iframe className='StudentsByYoS' src={chartLink} ></iframe>

    );
};

export default StudentsByYoS;
