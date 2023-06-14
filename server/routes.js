const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const cors = require("cors");

const { Student, Request } = require('./schema');

router.use(cors());
router.post('/student/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    // Check if user exists
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      // Roll number does not exist, create a new student record with the default password and empty fields
      const newStudent = new Student({
        rollNumber,
        password: 'dypatil@123',
        fullName: '',
        classValue: '',
        passedOutYear: '',
        postalAddress: '',
        email: '',
        semester: '',
        phone: '',
        date: null,
        feeReceiptNumber: '',
        amount: '',
        areYouPlaced: false,
        offerLetter: {},
        letterOfJoining: {},
        isFilled: false,
        isCompleted: false
      });

      await newStudent.save();
      res.json({ authenticated: true, created: true }); // Authentication successful and a new student record is created
    } else {
      // Roll number exists, check the password
      if (student.password === password) {
        res.json({ authenticated: true, created: false }); // Authentication successful
      } else {
        res.json({ authenticated: false }); // Authentication failed
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/getStudent', async (req, res) => {
  const { rollNumber } = req.body;
  const student = await Student.findOne({ rollNumber });
  if (!student) res.status(401).json({ message: "Student not found" })
  else res.status(200).json(student);

})

router.post('/submitform', async (req, res) => {
  try {
    const {
      rollNumber,
      fullName,
      classValue,
      passedOutYear,
      postalAddress,
      email,
      semester,
      phone,
      date,
      feeReceiptNumber,
      amount,
      areYouPlaced,
      offerLetter,
      letterOfJoining
    } = req.body;
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    student.fullName = fullName;
    student.classValue = classValue;
    student.passedOutYear = passedOutYear;
    student.postalAddress = postalAddress;
    student.email = email;
    student.semester = semester;
    student.phone = phone;
    student.date = date;
    student.feeReceiptNumber = feeReceiptNumber;
    student.amount = amount;
    student.areYouPlaced = areYouPlaced;
    student.offerLetter = offerLetter;
    student.letterOfJoining = letterOfJoining;
    student.isFilled = true;

    await student.save();

    let rq = await Request.findOne({ rollNumber });

    if (rq) {
      rq.fullName = fullName;
      rq.classValue = classValue;
      rq.semester = semester;
      rq.celabs = false;
      rq.commonlabs = false;
      rq.accounts = false;
      rq.exam = false;
      rq.library = false;
      rq.deplib = false;
      rq.store = false;
      rq.tpc = false;

      await rq.save();
    } else {
      rq = new Request({
        rollNumber,
        fullName,
        classValue,
        semester,
        areYouPlaced,
        celabs: false,
        commonlabs: false,
        accounts: false,
        exam: false,
        library: false,
        deplib: false,
        store: false,
        tpc: false
      });

      await rq.save();
    }

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/getStudentRequest' , async (req, res) => {
  const { rollNumber } = req.body;

  try {
    const request = await Request.findOne({ rollNumber });

    if (request) {
      res.status(200).json({ success: true, request });
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while retrieving the request' });
  }
});



router.post('/adminrequests', async (req, res) => {
  try {
    const { section } = req.body;

    console.log("Searching request for ", section)
    let request=[];
    // Find requests with false in the given section
    if(section!=='tpc'){
     request  = await Request.find({ [section]: false });
    }else if(section==='tpc'){
      console.log(section);
      request  = await Request.find({ [section]: false });
     for(var i=0;i<request.length;i++){
       if(request[i].areYouPlaced===true){
        const temp = await Student.findOne({rollNumber:request[i].rollNumber});
        const newrequest={
        rollNumber:request[i].rollNumber,
        fullName:request[i].fullName,
        classValue:request[i].classValue,
        semester:request[i].semester,
        areYouPlaced:request[i].areYouPlaced,
        celabs: request[i].celabs,
        commonlabs:request[i].commonlabs,
        accounts: request[i].accounts,
        exam: request[i].exam,
        library: request[i].library,
        deplib: request[i].deplib,
        store: request[i].store,
        tpc: request[i].tpc,
        offerLetter:temp.offerLetter,
        letterOfJoining:temp.letterOfJoining
        }
       request[i]=newrequest;
     }
    }
  }
    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/updateRequest', async (req, res) => {
  try {
    const { requestId, section } = req.body;

    // Find the request in the database
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }


    request[section] = true;
    const updatedRequest = await request.save();

    return res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update request' });
  }
});
module.exports = router;
