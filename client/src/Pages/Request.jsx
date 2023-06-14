import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/NavB'
import './Request.css'
const Request = () => {
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);


    useEffect(() => {
        const fetchStudentData = async () => {
            const storedRollNumber = localStorage.getItem('rollno');
            const storedPassword = localStorage.getItem('password');
            const expirationDate = new Date(localStorage.getItem('expirationDate'));

            if (storedRollNumber && storedPassword && expirationDate > new Date()) {
                try {
                    const response = await fetch('http://localhost:5000/getStudent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ rollNumber: storedRollNumber }),
                    });

                    if (response.ok) {
                        const student = await response.json();

                        // Check if stored password matches fetched student data password
                        if (storedPassword === student.password) {
                            console.log("Good")
                            if (student.isFilled) {
                                navigate('/request');
                            }
                        } else {
                            navigate('/logout');
                        }
                    } else {
                        navigate('/');
                    }
                } catch (error) {
                    console.log(error);
                    // Handle error that occurred during the request
                }
            } else {
                // Clear the stored values if expired or not present
                localStorage.removeItem('rollno');
                localStorage.removeItem('password');
                localStorage.removeItem('expirationDate');
                navigate('/');
            }
        };

        fetchStudentData();
    }, [navigate]);

    useEffect(() => {
        const storedRollNumber = localStorage.getItem('rollno');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedRollNumber && storedPassword && expirationDate > new Date()) {
            getStudentRequest(storedRollNumber);
        } else {
            // Clear the stored values if expired or not present
            localStorage.removeItem('rollno');
            localStorage.removeItem('password');
            localStorage.removeItem('expirationDate');
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStudentRequest = async (rollNumber) => {
        const response = await fetch('http://localhost:5000/getStudentRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rollNumber }),
        });

        if (response.status === 401) navigate('/');

        if (response.ok) {
            const { request } = await response.json();

            // Store the request data in the state
            setRequest(request);

            return request;
        } else {
            // Handle error case
        }
    };

    return (
        <>
            <Nav />
            {/* Display the request object */}
            {request && (
                <div className='requestpage'>
                    <div className='req'>
                        <h2 className='reqhead'>Request Details</h2>
                        <p>Roll Number: <span className='boldtext'>{request.rollNumber}</span></p>
                        <p>Full Name:<span className='boldtext'> {request.fullName}</span></p>
                        <p>Class: <span className='boldtext'>{request.classValue}</span></p>
                        <p>Semester: <span className='boldtext'>{request.semester}</span></p>
                        <p>Computer Engg. Labs: <span className={request.celabs ? 'approved boldtext' : 'pending boldtext'}>{request.celabs ? 'Approved' : 'Pending'}</span></p>
                        <p>FE Labs: <span className={request.commonlabs ? 'approved boldtext' : 'pending boldtext'}>{request.commonlabs ? 'Approved' : 'Pending'}</span></p>
                        <p>Accounts section: <span className={request.accounts ? 'approved boldtext' : 'pending boldtext'}>{request.accounts ? 'Approved' : 'Pending'}</span></p>
                        <p>Exam section: <span className={request.exam ? 'approved boldtext' : 'pending boldtext'}>{request.exam ? 'Approved' : 'Pending'}</span></p>
                        <p>Library : <span className={request.library ? 'approved boldtext' : 'pending boldtext'}>{request.library ? 'Approved' : 'Pending'}</span></p>
                        <p>Departmental Library : <span className={request.deplib ? 'approved boldtext' : 'pending boldtext'}>{request.deplib ? 'Approved' : 'Pending'}</span></p>
                        <p>Store : <span className={request.store ? 'approved boldtext' : 'pending boldtext'}>{request.store ? 'Approved' : 'Pending'}</span></p>
                        <p>Training & Placements : <span className={request.tpc ? 'approved boldtext' : 'pending boldtext'}>{request.tpc ? 'Approved' : 'Pending'}</span></p>


                        
                    </div>
                </div>
            )}
        </>
    );

};

export default Request;
