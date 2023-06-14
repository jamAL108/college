import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Form.css';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
const Form = (props) => {

    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [rollNumber, setRollNumber] = useState(localStorage.getItem('rollno') || '');
    const [classValue, setClassValue] = useState('');
    const [passedOutYear, setPassedOutYear] = useState('');
    const [postalAddress, setPostalAddress] = useState('');
    const [email, setEmail] = useState('');
    const [semester, setSemester] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState(new Date());
    const [feeReceiptNumber, setFeeReceiptNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const [areYouPlaced, setAreYouPlaced] = useState(false);
    const [offerLetter, setOfferLetter] = useState({name:"",myfile:""});
    const [letterOfJoining, setLetterOfJoining] = useState({name:"",myfile:""});

    useEffect(() => {
        const fetchStudentData = async () => {
            const storedRollNumber = localStorage.getItem('rollno');
            const storedPassword = localStorage.getItem('password');
            const expirationDate = new Date(localStorage.getItem('expirationDate'));

            if (storedRollNumber && storedPassword && expirationDate > new Date()) {
                setRollNumber(storedRollNumber);
                try {
                    const response = await fetch('http://localhost:5000/getStudent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ rollNumber: storedRollNumber }),
                    });
                    if (response.status === 401)
                        navigate('/logout')
                    if (response.ok) {
                        const student = await response.json();
                        if (storedPassword === student.password) {
                            console.log("Good")
                            if (student.isFilled) {
                                navigate('/request');
                            }
                        } else {
                            navigate('/logout');
                        }
                    } else {
                        navigate('/login');
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                // Clear the stored values if expired or not present
                localStorage.removeItem('rollno');
                localStorage.removeItem('password');
                localStorage.removeItem('expirationDate');
                navigate('/login');
            }
        };

        fetchStudentData();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isConfirmed) {
            try {
                const formData = {
                    rollNumber,
                    fullName,
                    classValue,
                    passedOutYear,
                    postalAddress,
                    email,
                    semester,
                    phone,
                    date: date.toISOString(),
                    feeReceiptNumber,
                    amount,
                    areYouPlaced: areYouPlaced.toString(),
                    offerLetter: offerLetter ? offerLetter : {},
                    letterOfJoining: letterOfJoining ? letterOfJoining : {},
                };
                console.log(offerLetter);
                console.log(letterOfJoining);
                const response = await fetch('http://localhost:5000/submitform', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    if (response.status === 200)
                        alert("Form submitted successfully")

                    navigate('/request')
                    // Handle success message or perform any other actions

                } else {
                    const errorResponse = await response.json();
                    console.log(errorResponse.error);
                    // Handle error response or perform any other actions
                }

            } catch (error) {
                console.log(error);
                // Handle any error that occurred during form submission
            }

        } else {
            setIsConfirmed(true);
        }
    };

    const handleEdit = () => {
        setIsConfirmed(false);
    };


    const handlejoiningletter=async(e)=>{
      const file= e.target.files[0];
      const base64 = await convertbase64(file);
      setLetterOfJoining({...letterOfJoining , myfile:base64 , name:file.name});
    }
    const handleofferletter=async(e)=>{
        console.log(e.target.files[0]);
        const file= e.target.files[0];
        const base64 = await convertbase64(file);
        setOfferLetter({...offerLetter , myfile:base64 , name:file.name});
      }
     function convertbase64(file){
          return new Promise((resolve,reject)=>{
            const filereader = new FileReader();
            filereader.readAsDataURL(file);
            filereader.onload=()=>{
                resolve(filereader.result);
            };
            filereader.onerror=(error)=>{
                reject(error);
            }
          })
     }
    return (
        <>
            <Nav />
            <div className='formpage'>
                <h2 className='form-title'>No Dues Form</h2>
                <form className="studentform" onSubmit={handleSubmit}>
                    {isConfirmed ? (
                        <>
                            <ConfirmationDetails
                                fullName={fullName}
                                rollNumber={rollNumber}
                                classValue={classValue}
                                passedOutYear={passedOutYear}
                                postalAddress={postalAddress}
                                email={email}
                                semester={semester}
                                phone={phone}
                                date={date}
                                feeReceiptNumber={feeReceiptNumber}
                                amount={amount}
                                areYouPlaced={areYouPlaced}
                                letterOfJoining={letterOfJoining}
                                offerLetter={offerLetter}
                            />
                            <div className="form-buttons">
                                <button type="button" className="form-button" onClick={handleEdit}>Edit</button>
                                <button type="submit" className="form-button submitBtn">Confirm & Submit</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <label htmlFor="rollNumber" className=".textlabel form-label">
                                Roll Number:
                                <input
                                    type="text"
                                    id="rollNumber"
                                    className="form-input"
                                    value={rollNumber}
                                    onChange={(e) => setRollNumber(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="fullName" className=".textlabel form-label">
                                Full Name:
                                <input
                                    type="text"
                                    id="fullName"
                                    className="form-input"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </label>


                            <label htmlFor="classValue" className=".textlabel form-label">
                                Class:
                                <input
                                    type="text"
                                    id="classValue"
                                    className="form-input"
                                    value={classValue}
                                    onChange={(e) => setClassValue(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="passedOutYear" className=".textlabel form-label">
                                Passed Out Year:
                                <input
                                    type="text"
                                    id="passedOutYear"
                                    className="form-input"
                                    value={passedOutYear}
                                    onChange={(e) => setPassedOutYear(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="postalAddress" className=".textlabel form-label">
                                Postal Address:
                                <input
                                    type="text"
                                    id="postalAddress"
                                    className="form-input"
                                    value={postalAddress}
                                    onChange={(e) => setPostalAddress(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="email" className=".textlabel form-label">
                                Email ID:
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="semester" className=".textlabel form-label">
                                Semester:
                                <input
                                    type="text"
                                    id="semester"
                                    className="form-input"
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="phone" className=".textlabel form-label">
                                Phone:
                                <input
                                    type="text"
                                    id="phone"
                                    className="form-input"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="date" className=".textlabel form-label">
                                Date:
                                <DatePicker
                                    id="date"
                                    className="form-input"
                                    selected={date}
                                    onChange={(date) => setDate(date)}
                                    placeholderText="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                />
                            </label>

                            <label htmlFor="feeReceiptNumber" className=".textlabel form-label">
                                Fee Receipt Number:
                                <input
                                    type="text"
                                    id="feeReceiptNumber"
                                    className="form-input"
                                    value={feeReceiptNumber}
                                    onChange={(e) => setFeeReceiptNumber(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="amount" className=".textlabel form-label">
                                Amount:
                                <input
                                    type="text"
                                    id="amount"
                                    className="form-input"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="areYouPlaced" className="placed form-label">
                                Are you placed?

                                <label className="checkbox-btn">
                                    <label htmlFor="checkbox"></label>
                                    <input
                                        type="checkbox"
                                        id="areYouPlaced"
                                        checked={areYouPlaced}
                                        required
                                        onChange={(e) => setAreYouPlaced(e.target.checked)} />

                                    <span className="checkmark"></span>
                                </label>
                            </label>

                            {areYouPlaced && (
                                <>
                                    <label htmlFor="offerLetter" className="textlabel form-label">
                                        Offer Letter:
                                        <input
                                            type="file"
                                            id="offerLetter"
                                            className="form-input"
                                            required
                                            name='myfile'
                                            accept='.jpeg , .png , .jpg , .pdf'
                                            onChange={(e) => handleofferletter(e)}
                                        />
                                    </label>

                                    <label htmlFor="letterOfJoining" className="textlabel form-label">
                                        Letter of Joining:
                                        <input
                                            type="file"
                                            id="letterOfJoining"
                                            className="form-input"
                                            required
                                            name='myfile'
                                            accept='.jpeg , .png , .jpg, .pdf'
                                            onChange={(e) => handlejoiningletter(e)}
                                        />
                                    </label>
                                </>
                            )}

                            <button type="button" className="form-button" onClick={handleSubmit}>Next</button>
                        </>
                    )}
                </form>
            </div>
        </>
    );
};

const ConfirmationDetails = (props) => {
    const {
        fullName,
        rollNumber,
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
        letterOfJoining,
    } = props;

    return (
        <div className="confirmation-details">
            <h2>Please review your details:</h2>
            <p>Full Name: <strong>{fullName}</strong></p>
            <p>Roll Number: <strong>{rollNumber}</strong></p>
            <p>Class: <strong>{classValue}</strong></p>
            <p>Passed Out Year: <strong>{passedOutYear}</strong></p>
            <p>Postal Address: <strong>{postalAddress}</strong></p>
            <p>Email ID: <strong>{email}</strong></p>
            <p>Semester: <strong>{semester}</strong></p>
            <p>Phone: <strong>{phone}</strong></p>
            <p>Date: <strong>{date.toLocaleDateString()}</strong></p>
            <p>Fee Receipt Number: <strong>{feeReceiptNumber}</strong></p>
            <p>Amount: <strong>{amount}</strong></p>
            <p>Are you placed? <strong>{areYouPlaced ? 'Yes' : 'No'}</strong></p> {/* Display the value of areYouPlaced */}
            {areYouPlaced && (
                <>
                    <p>
                        Offer Letter: <strong>{offerLetter ? offerLetter.name : ''}</strong>
                    </p>
                    <p>
                        Letter of Joining:{' '}
                        <strong>{letterOfJoining ? letterOfJoining.name : ''}</strong>
                    </p>
                </>
            )}
        </div>
    );
};

export default Form;