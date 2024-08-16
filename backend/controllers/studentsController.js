const Student = require('../modules/students'); // Upewnij się, że ścieżka do modelu jest poprawna

const getLatestStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 }).limit(10);
        res.json(students);  // Zwracamy dane w formacie JSON
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find(); // Pobiera wszystkich studentów z bazy
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateStudent = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addStudent = async (req, res) => {
    try {
        const maxIDStudent = await Student.findOne().sort({ ID: -1 }).exec();
        const newID = maxIDStudent ? maxIDStudent.ID + 1 : 1;
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
        const exist = await Student.findOne({ Email });
        if (exist) return res.json({ error: 'Email is already taken' });
        const phoneExists = await Student.findOne({ phone_number: phoneNumber });
        if (phoneExists) return res.json({ error: 'Phone Number is already taken' });

        // Tworzenie nowego studenta
        const student = await Student.create({
            ID: newID,
            first_name: firstName,
            last_name: lastName,
            Email,
            phone_number: phoneNumber,
            field_of_study: fieldOfStudy,
            group,
            year
        });

        return res.json(student);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getLatestStudents,
    getAllStudents,
    updateStudent,
    addStudent,
    deleteStudent,
};
