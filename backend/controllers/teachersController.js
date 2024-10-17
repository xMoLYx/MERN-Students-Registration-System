const Teacher = require('../modules/teachers'); // Import modelu Teacher

// Funkcja do pobierania opiekunów kierunków
const getSupervisors = async (req, res) => {
    try {
        // Znajdź wszystkich nauczycieli, którzy są opiekunami
        const supervisors = await Teacher.find({ is_supervisor: true });

        // Mapowanie wyników do odpowiedniego formatu
        const formattedSupervisors = supervisors.map(supervisor => {
            return {
                supervised_department: supervisor.supervised_department,
                supervisor_info: `${supervisor.title} ${supervisor.first_name} ${supervisor.last_name}`
            };
        });

        // Zwracamy sformatowane dane
        res.json(formattedSupervisors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateTeacher = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.json(updatedTeacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addTeacher = async (req, res) => {
    try {
        const maxIDTeacher = await Teacher.findOne().sort({ ID: -1 }).exec();
        const newID = maxIDTeacher ? maxIDTeacher.ID + 1 : 1;
        const { firstName, lastName, Email, phoneNumber, fieldOfStudy, year, group } = req.body;

        // Walidacja danych wejściowych
        if (!firstName) {
            return res.json({ error: 'First Name is required' });
        }
        if (!lastName) {
            return res.json({ error: 'Last Name is required' });
        }
        if (!Email) {
            return res.json({ error: 'Email is required' });
        }
        if (!phoneNumber) {
            return res.json({ error: 'Phone Number is required' });
        }
        if (!fieldOfStudy) {
            return res.json({ error: 'Field of Study is required' });
        }
        if (!year) {
            return res.json({ error: 'Year of study is required' });
        }
        if (!group) {
            return res.json({ error: 'Group is required' });
        }

        // Sprawdzenie, czy email już istnieje
        const exist = await Teacher.findOne({ Email });
        if (exist) return res.json({ error: 'Email is already taken' });
        const phoneExists = await Teacher.findOne({ phone_number: phoneNumber });
        if (phoneExists) return res.json({ error: 'Phone Number is already taken' });

        // Tworzenie nowego nauczyciela
        const Teacher = await Teacher.create({
            ID: newID,
            first_name: firstName,
            last_name: lastName,
            Email,
            phone_number: phoneNumber,
            field_of_study: fieldOfStudy,
            group,
            year
        });

        return res.json(teacher);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getSupervisors,
    getAllTeachers,
    updateTeacher,
    addTeacher,
    deleteTeacher,
};
