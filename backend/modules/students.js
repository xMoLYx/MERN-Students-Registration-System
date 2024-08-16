const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    ID: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    field_of_study: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema, 'Students');

module.exports = Student;
