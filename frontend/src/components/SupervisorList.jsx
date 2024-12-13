import React, { useEffect, useState } from 'react';
import './styles/SupervisorList.css';

const SupervisorList = () => {
    const [supervisors, setSupervisors] = useState([]);

    useEffect(() => {
        fetch('${import.meta.env.VITE_API_URL}/api/supervisors')
            .then(response => response.json())
            .then(data => setSupervisors(data))
            .catch(error => console.error('Error fetching supervisors:', error));
    }, []);


    const getDepartmentClass = (department) => {
        switch (department) {
            case 'Biology':
                return 'dot-biology';
            case 'Chemistry':
                return 'dot-chemistry';
            case 'Computer Science':
                return 'dot-computer-science';
            case 'Mathematics':
                return 'dot-mathematics';
            case 'Physics':
                return 'dot-physics';
            case 'Economics':
                return 'dot-economics';
            default:
                return '';
        }
    };

    return (
        <div className='supervisors-container'>
            <h3>Department Supervisors</h3>
            {supervisors.map((supervisor, index) => (
                <div key={index} className="supervisor-item">
                    <span className={`dot ${getDepartmentClass(supervisor.supervised_department)}`}></span>
                    <strong>{supervisor.supervised_department}</strong> - {supervisor.supervisor_info}
                </div>
            ))}
        </div>
    );
};

export default SupervisorList;
