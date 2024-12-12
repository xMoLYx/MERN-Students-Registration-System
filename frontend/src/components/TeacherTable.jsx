import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/TeacherTable.css';
import ReactPaginate from 'react-paginate';
import Button from './MenuButton';
import ConfirmDialog from './ConfirmDialog';
import { toast } from 'react-hot-toast';
import { IonIcon } from '@ionic/react';
import { pencilOutline, trashOutline } from 'ionicons/icons';

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    ID: '',
    firstName: '',
    lastName: '',
    department: '',
    title: '',
    yearOfEmployment: ''
  });
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    title: '',
    yearOfEmployment: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    departments: [],
    titles: [],
    yearsOfEmployment: []
});
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const teachersPerPage = 21;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/api/teachers');
        const teacherData = response.data;

        const uniqueYears = [...new Set(teacherData.map(teacher => teacher.year_of_employment))].sort((a, b) => a - b);
        const uniqueDepartments = [...new Set(teacherData.map(teacher => teacher.department))].sort();
        const uniqueTitles = [...new Set(teacherData.map(teacher => teacher.title))].sort();

        setTeachers(teacherData);
        setAvailableFilters({
          yearsOfEmployment: uniqueYears || [],
          departments: uniqueDepartments || [],
          titles: uniqueTitles || []
        });
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  const filteredTeachers = teachers.filter(teacher =>
    (!filters.ID || teacher.ID.toString().includes(filters.ID)) &&
    (!filters.firstName || teacher.first_name.toLowerCase().includes(filters.firstName.toLowerCase())) &&
    (!filters.lastName || teacher.last_name.toLowerCase().includes(filters.lastName.toLowerCase())) &&
    (!filters.department || teacher.department === filters.department) &&
    (!filters.title || teacher.title === filters.title) &&
    (!filters.yearOfEmployment || teacher.year_of_employment === Number(filters.yearOfEmployment))
  );

  const offset = currentPage * teachersPerPage;
  const currentTeachers = filteredTeachers.slice(offset, offset + teachersPerPage);
  const pageCount = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchClick = () => {
    setShowTable(true);
    setShowAdd(false);
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleCloseModal = () => {
    setConfirmDelete(false);
    setConfirmAction(() => () => {
      setSelectedTeacher(null);
      toast.error('Edit Cancelled');
    });
    setShowConfirm(true);
  };

  const handleSaveChanges = async (updatedTeacher) => {
    setConfirmDelete(false);
    setConfirmAction(() => async () => {
      try {
        await axios.put(`/api/teachers/${updatedTeacher._id}`, updatedTeacher);
        setTeachers(prevTeachers =>
          prevTeachers.map(teacher =>
            teacher._id === updatedTeacher._id ? updatedTeacher : teacher
          )
        );
        setSelectedTeacher(null);
        toast.success('Saving Successful');
      } catch (error) {
        toast.error('Error saving teacher data');
      }
    });
    setShowConfirm(true);
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

  const addTeacher = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phoneNumber, department, title, yearOfEmployment } = data;
    try {
      const response = await axios.post('/addTeacher', {
        firstName,
        lastName,
        email,
        phoneNumber,
        department,
        title,
        yearOfEmployment
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          department: '',
          title: '',
          yearOfEmployment: ''
        });
        toast.success('Successfully added a new teacher!');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while adding the teacher.');
    }
  };

  const confirmDeleteTeacher = (teacherId) => {
    setConfirmDelete(true);
    setShowConfirm(true);
    setConfirmAction(() => async () => {
      try {
        await axios.delete(`/api/teachers/${teacherId}`);
        setTeachers(teachers.filter(teacher => teacher._id !== teacherId));
        toast.success('Teacher deleted successfully');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast.error('Failed to delete teacher');
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
      email: '',
      phoneNumber: '',
      department: '',
      title: '',
      yearOfEmployment: ''
    });
  };

  const handleResetFilters = () => {
    setFilters({
      ID: '',
      firstName: '',
      lastName: '',
      department: '',
      title: '',
      yearOfEmployment: ''
    });
  };

  return (
    <div className='teacher-container'>
      <label className='title'>Teacher Management</label>
      <div className='TeachersMenu'>
        <Button text="Add New Teacher" onClick={handleAddClick} />
        <Button text="Search Teachers" onClick={handleSearchClick} />
      </div>
      <div className={`AddTeacherContainer ${showAdd ? 'show' : ''}`}>
        <form onSubmit={addTeacher}>
            <label className='TeacherData'>
                First Name:
                <input 
                    type="text" 
                    value={data.firstName} 
                    onChange={(e) => setData({ ...data, firstName: e.target.value })} 
                    required 
                />
            </label>
            <label className='TeacherData'>
                Last Name:
                <input 
                    type="text" 
                    value={data.lastName} 
                    onChange={(e) => setData({ ...data, lastName: e.target.value })} 
                    required 
                />
            </label>
            <label className='TeacherData'>
                Email:
                <input 
                    type="email" 
                    value={data.email} 
                    onChange={(e) => setData({ ...data, email: e.target.value })} 
                    required 
                />
            </label>
            <label className='TeacherData'>
                Phone Number:
                <input 
                    type="text" 
                    value={data.phoneNumber} 
                    onChange={(e) => setData({ ...data, phoneNumber: e.target.value })} 
                    required 
                />
            </label>
            <label className='TeacherData'>
                Department:
                <select
                    name="department"
                    value={data.department}
                    onChange={(e) => setData({ ...data, department: e.target.value })}
                    required
                >
                    <option value="">Choose a Department</option>
                    {availableFilters.departments.map((department, index) => (
                        <option key={index} value={department}>{department}</option>
                    ))}
                </select>
            </label>
            <label className='TeacherData'>
                Title:
                <select
                    name="title"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    required
                >
                    <option value="">Choose a Title</option>
                    {availableFilters.titles.map((title, index) => (
                        <option key={index} value={title}>{title}</option>
                    ))}
                </select>
            </label>
            <label className='TeacherData'>
                Year of Employment:
                <input 
                    type="number" 
                    value={data.yearOfEmployment} 
                    onChange={(e) => setData({ ...data, yearOfEmployment: e.target.value })} 
                    required 
                />
            </label>
            <div className='buttons'>
                <Button text='Cancel' onClick={handleCancelAdd}/>
                <Button text='Confirm' type="submit" />
            </div>
        </form>
      </div>

      <div className={`TeacherTableContainer ${showTable ? 'show' : ''}`}>
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
            name="department"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
            <option value="">All Departments</option>
            {availableFilters.departments.map((department, index) => (
                <option key={index} value={department}>{department}</option>
            ))}
        </select>
        <select
            name="title"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        >
            <option value="">All Titles</option>
            {availableFilters.titles.map((title, index) => (
                <option key={index} value={title}>{title}</option>
            ))}
        </select>
        <select
            name="yearOfEmployment"
            value={filters.yearOfEmployment}
            onChange={(e) => setFilters({ ...filters, yearOfEmployment: e.target.value })}
        >
            <option value="">All Years</option>
            {availableFilters.yearsOfEmployment.map((year, index) => (
                <option key={index} value={year}>{year}</option>
            ))}
        </select>
      </div>

        <table className="teacher-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Title</th>
              <th>Year of Employment</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.map(teacher => (
              <tr key={teacher._id}>
                <td>{teacher.ID}</td>
                <td>{teacher.first_name}</td>
                <td>{teacher.last_name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.department}</td>
                <td>{teacher.title}</td>
                <td>{teacher.year_of_employment}</td>
                <td>
                  <button className='Action' onClick={() => handleEditClick(teacher)}>
                    <IonIcon icon={pencilOutline} />
                  </button>
                </td>
                <td>
                  <button className='Action' onClick={() => confirmDeleteTeacher(teacher._id)}>
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

      {selectedTeacher && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Teacher Data</h3>
            <label>
              First Name:
              <input
                type="text"
                value={selectedTeacher.first_name}
                onChange={(e) => setSelectedTeacher({ ...selectedTeacher, first_name: e.target.value })}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={selectedTeacher.last_name}
                onChange={(e) => setSelectedTeacher({ ...selectedTeacher, last_name: e.target.value })}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={selectedTeacher.email}
                onChange={(e) => setSelectedTeacher({ ...selectedTeacher, email: e.target.value })}
              />
            </label>
            <label>
              Department:
              <input
                type="text"
                value={selectedTeacher.department}
                onChange={(e) => setSelectedTeacher({ ...selectedTeacher, department: e.target.value })}
              />
            </label>
            <label>
              Title:
              <input
                type="text"
                value={selectedTeacher.title}
                onChange={(e) => setSelectedTeacher({ ...selectedTeacher, title: e.target.value })}
              />
            </label>
            <label>
              Year of Employment:
              <input
                type="number"
                value={selectedTeacher.year_of_employment}
                onChange={(e) => setSelectedTeacher({ ...selectedTeacher, year_of_employment: e.target.value })}
              />
            </label>
            <div className="modal-actions">
              <Button onClick={handleCloseModal} text='Cancel' />
              <Button onClick={() => handleSaveChanges(selectedTeacher)} text='Update' />
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog
          title={confirmDelete ? "Confirm Delete" : "Confirm Action"}
          message={confirmDelete ? "Are you sure you want to delete this teacher?" : "Are you sure you want to proceed?"}
          onConfirm={handleConfirm} // Execute the action on confirmation
          onCancel={handleCancelDelete} // Show toast error on cancel
        />
      )}
    </div>
  );
};

export default TeacherTable;
