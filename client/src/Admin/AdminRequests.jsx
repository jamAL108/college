import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminRequests.css';
import NavAdmin from './NavAdmin';

const AdminRequests = () => {
    const navigate = useNavigate();
    const [section, setSection] = useState('');
    const [requests, setRequests] = useState([]);
    useEffect(()=>{
      if(requests.length!==0){
          if(section==='tpc'){
             console.log(requests);
          }
      }
    },[requests])
    useEffect(() => {
        const storedID = localStorage.getItem('id');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedID && storedPassword && expirationDate > new Date()) {
            if ((storedID === "celabs@rait" && storedPassword === "rait@celabs") ||
                (storedID === "commonlabs@rait" && storedPassword === "rait@commonlabs") ||
                (storedID === "accounts@rait" && storedPassword === "rait@accounts") ||
                (storedID === "exam@rait" && storedPassword === "rait@exam") ||
                (storedID === "library@rait" && storedPassword === "rait@library") ||
                (storedID === "store@rait" && storedPassword === "rait@store") ||
                (storedID === "deplib@rait" && storedPassword === "rait@deplib") ||
                (storedID === "tpc@rait" && storedPassword === "rait@tpc")) {
            } else {
                localStorage.removeItem('rollno');
                localStorage.removeItem('password');
                localStorage.removeItem('expirationDate');

                navigate('/admin/login');
            }
        }

        Verify();
        //eslint-disable-next-line
    }, []);

    const Verify = () => {
        const storedID = localStorage.getItem('id');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedID && storedPassword && expirationDate > new Date()) {
            // Continue with the logged-in user flow
        } else {
            // Clear the stored values if expired or not present
            localStorage.removeItem('rollno');
            localStorage.removeItem('password');
            localStorage.removeItem('expirationDate');

            navigate('/admin/login');
        }
    };

    useEffect(() => {
        const id = localStorage.getItem('id');
        let parts = id.split('@');
        let x = parts[0];

        setSection(x);
    }, []);

    useEffect(() => {
        if (section) {
            fetchRequests();
        }
        //eslint-disable-next-line
    }, [section]);

    const fetchRequests = () => {
        fetch('http://localhost:5000/adminrequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ section }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Store the requests in the state
                setRequests(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleApprove = (requestId) => {
        console.log("Making approval req for section:", section);
        // Update the request with the given ID and set the value to false
        const requestBody = {
            requestId: requestId,
            section: section, // or you can use `section` variable here
        };

        // Send the updated request data to the backend
        fetch('http://localhost:5000/updateRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                fetchRequests(); // Fetch requests after successful update
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <>
            <NavAdmin />
            <div className='AR'>
                <div className='adminrequestpage'>
                    <h2>{section.toUpperCase()} Requests</h2>
                    {requests.length > 0 ? requests.map((request) => (
                        <div key={request._id} className='card'>
                            <p>Roll Number: {request.rollNumber}</p>
                            <p>Full Name: {request.fullName}</p>
                            <p>Class: {request.classValue}</p>
                            <p>Semester: {request.semester}</p>
                            {section==='tpc' && request.areYouPlaced===true && (
                                <>
                                <img src={request.offerLetter.myfile} alt='offerLetter' />
                                <img src={request.letterOfJoining.myfile} alt='letterofjoining' />
                                </>
                            )}
                            <button onClick={() => handleApprove(request._id)}>Approve</button>
                        </div>
                    )) : <h3>No pending requests for {section}</h3>}
                </div>
            </div>
        </>
    );
};

export default AdminRequests;
