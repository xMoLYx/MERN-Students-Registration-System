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

module.exports = {
    getSupervisors,
    // inne funkcje kontrolera, jeśli istnieją
};
