import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/StudentTable.css';
import ReactPaginate from 'react-paginate';
import Button from './MenuButton';
import ConfirmDialog from './ConfirmDialog';
import { toast } from 'react-hot-toast';
import { IonIcon } from '@ionic/react';
import { pencilOutline, trashOutline } from 'ionicons/icons';

const StudentTable = () => {
    const [students, setStudents] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState({
        ID: '',
        firstName: '',
        lastName: '',
        year: '',
        group: '',
        fieldOfStudy: ''
    });
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        Email: '',
        phoneNumber: '',
        fieldOfStudy: '',
        year: '',
        group: ''
    });
    const [availableFilters, setAvailableFilters] = useState({
        fieldsOfStudy: [],
        years: [],
        groups: []
    });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const studentsPerPage = 21;

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('/api/students');
                const studentData = response.data;

                const uniqueYears = [...new Set(studentData.map(student => student.year))].sort((a, b) => a - b);
                const uniqueGroups = [...new Set(studentData.map(student => student.group))].sort();
                const uniqueFieldsOfStudy = [...new Set(studentData.map(student => student.field_of_study))].sort();

                setStudents(studentData);
                setAvailableFilters({
                    years: uniqueYears || [],
                    groups: uniqueGroups || [],
                    fieldsOfStudy: uniqueFieldsOfStudy || []
                });
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        setCurrentPage(0);
    }, [filters]);

    const filteredStudents = students.filter(student =>
        (!filters.ID || student.ID.toString().includes(filters.ID)) &&
        (!filters.firstName || student.first_name.toLowerCase().includes(filters.firstName.toLowerCase())) &&
        (!filters.lastName || student.last_name.toLowerCase().includes(filters.lastName.toLowerCase())) &&
        (!filters.year || student.year === Number(filters.year)) &&
        (!filters.group || student.group === filters.group) &&
        (!filters.fieldOfStudy || student.field_of_study === filters.fieldOfStudy)
    );

    const offset = currentPage * studentsPerPage;
    const currentStudents = filteredStudents.slice(offset, offset + studentsPerPage);
    const pageCount = Math.ceil(filteredStudents.length / studentsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    
    const handleSearchClick = () => {
      setShowTable(true);
      setShowAdd(false);
    };

    const handleEditClick = (student) => {
      setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setConfirmDelete(false);
    setConfirmAction(() => () => {
      setSelectedStudent(null);
      toast.error('Edit Cancelled');
    });
    setShowConfirm(true);
  };

  const handleSaveChanges = async () => {
    if (selectedStudent) {
        try {
            const response = await axios.put(`/api/students/${selectedStudent._id}`, selectedStudent);
            setStudents(students.map(student =>
                student._id === selectedStudent._id ? response.data : student
            ));
            setSelectedStudent(null);
            toast.success('Student updated successfully');
        } catch (error) {
            console.error('Error updating student:', error);
            toast.error('Failed to update student');
          }
      }
  };

  const handleConfirm = () => {
    if (confirmAction) confirmAction();
    setShowConfirm(false);
};

  const handleAddClick = () => {
      setShowTable(false);
      setTimeout(() => {
          setShowAdd(true);
      }, 500);
  };

  const addStudent = async (e) => {
    e.preventDefault();
    const { firstName, lastName, Email, phoneNumber, fieldOfStudy, year, group } = data;
    try {
        const response = await axios.post('/addStudent', {
            firstName,
            lastName,
            Email,
            phoneNumber,
            fieldOfStudy,
            year,
            group
        });
        if (response.data.error) {
            toast.error(response.data.error);
        } else {
            setData({
                firstName: '',
                lastName: '',
                Email: '',
                phoneNumber: '',
                fieldOfStudy: '',
                year: '',
                group: ''
            });
            toast.success('Successfully added a new student!');
            setShowAdd(false);
            setStudents([...students, response.data]);
        }
    } catch (error) {
        console.log(error);
        toast.error('An error occurred while adding the student.');
    }
  };

  const confirmDeleteStudent = (studentId) => {
    setConfirmDelete(true);
    setShowConfirm(true);
    setConfirmAction(() => async () => {
        try {
            await axios.delete(`/api/students/${studentId}`);
            setStudents(students.filter(student => student._id !== studentId));
            toast.success('Student deleted successfully');
        } catch (error) {
            console.error('Error deleting student:', error);
            toast.error('Failed to delete student');
        } finally {
            setShowConfirm(false);
          }
      });
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setShowConfirm(false);
    toast.error('Delete action canceled');
  };

  const handleCancelAdd = () => {
      setData({
          firstName: '',
          lastName: '',
          Email: '',
          phoneNumber: '',
          fieldOfStudy: '',
          year: '',
          group: ''
      });
      setShowAdd(false);
  };

  const handleResetFilters = () => {
    setFilters({
        ID: '',
        firstName: '',
        lastName: '',
        year: '',
        group: '',
        fieldOfStudy: ''
    });
  };

    return (
        <div className='student-container'>
            <label className='title'>Student Management</label>
            <div className='StudentsMenu'>
                <Button text="Add New Student" onClick={handleAddClick} />
                <Button text="Search Students" onClick={handleSearchClick} />
            </div>
            <div className={`AddStudentContainer ${showAdd ? 'show' : ''}`}>
                <form onSubmit={addStudent}>
                    <label className='StudentData'>
                        First Name:
                        <input 
                            type="text" 
                            value={data.firstName} 
                            onChange={(e) => setData({ ...data, firstName: e.target.value })} 
                            required 
                        />
                    </label>
                    <label className='StudentData'>
                        Last Name:
                        <input 
                            type="text" 
                            value={data.lastName} 
                            onChange={(e) => setData({ ...data, lastName: e.target.value })} 
                            required 
                        />
                    </label>
                    <label className='StudentData'>
                        Email:
                        <input 
                            type="email" 
                            value={data.Email} 
                            onChange={(e) => setData({ ...data, Email: e.target.value })} 
                            required 
                        />
                    </label>
                    <label className='StudentData'>
                        Phone Number:
                        <input 
                            type="text" 
                            value={data.phoneNumber} 
                            onChange={(e) => setData({ ...data, phoneNumber: e.target.value })} 
                            required 
                        />
                    </label>
                    <label className='StudentData'>
                        Field of Study:
                        <select
                            name="fieldOfStudy"
                            value={data.fieldOfStudy}
                            onChange={(e) => setData({ ...data, fieldOfStudy: e.target.value })}
                            required
                        >
                            <option value="">Choose a Field of Study</option>
                            {availableFilters.fieldsOfStudy.map((field, index) => (
                                <option key={index} value={field}>{field}</option>
                            ))}
                        </select>
                    </label>
                    <label className='StudentData'>
                        Year of Study:
                        <select
                            name="year"
                            value={data.year}
                            onChange={(e) => setData({ ...data, year: e.target.value })}
                            required
                        >
                            <option value="">Choose a Year</option>
                            {availableFilters.years.map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            ))}
                        </select>
                    </label>
                    <label className='StudentData'>
                        Group:
                        <select
                            name="group"
                            value={data.group}
                            onChange={(e) => setData({ ...data, group: e.target.value })}
                            required
                        >
                            <option value="">Choose a Group</option>
                            {availableFilters.groups.map((group, index) => (
                                <option key={index} value={group}>{group}</option>
                            ))}
                        </select>
                    </label>
                    <div className='buttons'>
                        <Button text='Cancel' onClick={handleCancelAdd}/>
                        <Button text='Confirm' type="submit" />
                    </div>
                </form>
            </div>

            <div className={`StudentTableContainer ${showTable ? 'show' : ''}`}>
                <div className="filter-container">
                    <button className='ResetFilters' onClick={handleResetFilters}>
                        Reset Filters
                    </button>
                    <input
                        type="text"
                        name="ID"
                        placeholder="Search by ID..."
                        value={filters.ID}
                        onChange={(e) => setFilters({ ...filters, ID: e.target.value })}
                    />
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Search by first name..."
                        value={filters.firstName}
                        onChange={(e) => setFilters({ ...filters, firstName: e.target.value })}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Search by last name..."
                        value={filters.lastName}
                        onChange={(e) => setFilters({ ...filters, lastName: e.target.value })}
                    />
                    <select
                        name="fieldOfStudy"
                        value={filters.fieldOfStudy}
                        onChange={(e) => setFilters({ ...filters, fieldOfStudy: e.target.value })}
                    >
                        <option value="">All Fields of Study</option>
                        {availableFilters.fieldsOfStudy.map((field, index) => (
                            <option key={index} value={field}>{field}</option>
                        ))}
                    </select>
                    <select
                        name="year"
                        value={filters.year}
                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    >
                        <option value="">All Years</option>
                        {availableFilters.years.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                    <select
                        name="group"
                        value={filters.group}
                        onChange={(e) => setFilters({ ...filters, group: e.target.value })}
                    >
                        <option value="">All Groups</option>
                        {availableFilters.groups.map((group, index) => (
                            <option key={index} value={group}>{group}</option>
                        ))}
                    </select>
                </div>

                <table className="student-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Field of Study</th>
                            <th>Year</th>
                            <th>Group</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map(student => (
                            <tr key={student._id}>
                                <td>{student.ID}</td>
                                <td>{student.first_name}</td>
                                <td>{student.last_name}</td>
                                <td>{student.Email}</td>
                                <td>{student.field_of_study}</td>
                                <td>{student.year}</td>
                                <td>{student.group}</td>
                                <td>
                                    <button className='Action' onClick={() => handleEditClick(student)}>
                                        <IonIcon icon={pencilOutline} />
                                    </button>
                                </td>
                                <td>
                                    <button className='Action' onClick={() => confirmDeleteStudent(student._id)}>
                                        <IonIcon icon={trashOutline} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
            </div>

            {selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Student Data</h3>
            <label>
              First Name:
              <input
                type="text"
                value={selectedStudent.first_name}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, first_name: e.target.value })}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={selectedStudent.last_name}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, last_name: e.target.value })}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={selectedStudent.Email}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, Email: e.target.value })}
              />
            </label>
            <label>
              Field of Study:
              <input
                type="text"
                value={selectedStudent.field_of_study}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, field_of_study: e.target.value })}
              />
            </label>
            <label>
              Year:
              <input
                type="number"
                value={selectedStudent.year}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, year: e.target.value })}
              />
            </label>
            <label>
              Group:
              <input
                type="text"
                value={selectedStudent.group}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, group: e.target.value })}
              />
            </label>
            <div className="modal-actions">
              <Button onClick={handleCloseModal} text='Cancel' />
              <Button onClick={() => handleSaveChanges(selectedStudent)} text='Update' />
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog
          title={confirmDelete ? "Confirm Delete" : "Confirm Action"}
          message={confirmDelete ? "Are you sure you want to delete this student?" : "Are you sure you want to proceed?"}
          onConfirm={handleConfirm} // Execute the action on confirmation
          onCancel={handleCancelDelete} // Show toast error on cancel
        />
      )}
    </div>
    );
};

export default StudentTable;
