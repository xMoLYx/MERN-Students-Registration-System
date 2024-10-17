import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import StudentsByFoS from '../components/StudentsByFoS';
import StudentsByYoS from '../components/StudentsByYoS';
import SupervisorList from '../components/SupervisorList';
import LatestStudents from '../components/LatestStudents';
import StudentTable from '../components/StudentTable';
import TeacherTable from '../components/TeacherTable';
import './Styles/Dashboard.css';

export default function Dashboard() {
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [showGraphs, setShowGraphs] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [showTeacherTable, setShowTeacherTable] = useState(false);

  return (
    <>
      <Banner className="header" />
      <div className='Dashboard'>
        <Navbar 
          setShowGraphs={setShowGraphs} 
          setShowTable={setShowTable} 
          setShowTeacherTable={setShowTeacherTable}
          setIsLeftVisible={setIsLeftVisible} 
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
              <StudentTable />
            )}
            {showTeacherTable && (
              <TeacherTable />
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
