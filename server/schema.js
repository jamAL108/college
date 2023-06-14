const mongoose = require('mongoose');

// Define the schema
const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true
    },
    classValue: {
        type: String,
        trim: true
    },
    passedOutYear: {
        type: String,
        trim: true
    },
    postalAddress: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    semester: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
    },
    feeReceiptNumber: {
        type: String,
        trim: true
    },
    amount: {
        type: String,
        trim: true
    },
    areYouPlaced: {
        type: Boolean,
    },
    offerLetter: {
        type:{}
    },
    letterOfJoining: {
        type:{}
    },
    isFilled: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        default: 'dypatil@123'
    }
});

// Define the model
const Student = mongoose.model('student', studentSchema);

const requestSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true
    },
    classValue: {
        type: String,
        trim: true
    },
    semester: {
        type: String,
        trim: true
    },
    areYouPlaced: {
        type: Boolean,
    },
    celabs: {
        type: Boolean
    },
    commonlabs:{
        type:Boolean
    },
    accounts:{
        type:Boolean,
    },
    exam:{
        type:Boolean
    },
    library: {
        type: Boolean
    },
    deplib: {
        type: Boolean
    },
    store: {
        type: Boolean
    },
    tpc: {
        type: Boolean
    }
})
const Request = mongoose.model('request', requestSchema);

module.exports = { Student, Request };
