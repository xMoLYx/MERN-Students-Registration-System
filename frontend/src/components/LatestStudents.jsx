import React, { useEffect, useState } from 'react';
import './styles/LatestStudents.css';

const ListOfStudentsLink = import.meta.env.VITE_API_URL;
const LatestStudents = () => {
    const [students, setStudents] = useState([]);

    const fetchLatestStudents = () => {
        fetch(`${ListOfStudentsLink}/api/students/latest`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching latest students:', error));
    };

    useEffect(() => {
        // Fetch data initially
        fetchLatestStudents();

        // Set interval to fetch data every 10 seconds
        const interval = setInterval(fetchLatestStudents, 10000); // 10000 ms = 10 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="latest-students">
            <h3>Latest Students</h3>
            <ul>
                {students.map((student, index) => (
                    <li key={index}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.5em' }}>•</span> {student.first_name} {student.last_name} <span style={{ fontWeight: 'bold' }}>•</span> Added on: {student.createdAt ? new Date(student.createdAt).toLocaleString() : 'Date not available'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LatestStudents;
