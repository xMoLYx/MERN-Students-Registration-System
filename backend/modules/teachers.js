const mongoose = require('mongoose');
const { Schema } = mongoose;

const teacherSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    year_of_employment: {
        type: Number,
        required: true,
    },
    is_supervisor: {
        type: Boolean,
        default: false,
    },
    supervised_department: {
        type: String,
        required: function() { return this.is_supervisor; }  // only required if is_supervisor is true
    }
});

const Teacher = mongoose.model('Teacher', teacherSchema, 'Teachers');

module.exports = Teacher;
