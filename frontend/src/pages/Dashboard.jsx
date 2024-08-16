import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import StudentsByFoS from '../components/StudentsByFoS';
import StudentsByYoS from '../components/StudentsByYoS';
import SupervisorList from '../components/SupervisorList';
import LatestStudents from '../components/LatestStudents'
import StudentTable from '../components/StudentTable';
import './Styles/Dashboard.css';

export default function Dashboard() {
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [showGraphs, setShowGraphs] = useState(true);
  const [showTable, setShowTable] = useState(false);

  const [availableFilters, setAvailableFilters] = useState({
    years: [],
    groups: [],
    fieldsOfStudy: []
  });

  const [filters, setFilters] = useState({
    ID: '',
    firstName: '',
    lastName: '',
    year: '',
    group: '',
    fieldOfStudy: ''
  });

  const handleHomeClick = () => {
    setShowGraphs(true);
    setShowTable(false);
    setIsLeftVisible(false);
  };

  const handleManagementClick = () => {
    setShowGraphs(false);
    setShowTable(true);
    setIsLeftVisible(true);
  };

  return (
    <>
      <Banner class="header"/>
      <div className='Dashboard'>
        <Navbar 
          onHomeClick={handleHomeClick} 
          onStudentClick={handleManagementClick} 
        />
        <div className='content'>
          <div className={`left ${isLeftVisible ? 'visible' : 'transparent'}`}>
            {showGraphs && (
              <>
                <div className='graph1'>
                  <StudentsByFoS />
                </div>
                <div className='graph2'>
                  <StudentsByYoS />
                </div>
              </>
            )}
            {showTable && (
              <StudentTable
                filters={filters}
                availableFilters={availableFilters}
                setAvailableFilters={setAvailableFilters}
              />
            )}
          </div>
          <div className='right'>
            <div className='graph3'>
              <SupervisorList />
              <LatestStudents />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
