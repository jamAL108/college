import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
const AdminLogout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const storedRollNumber = localStorage.getItem('rollno');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedRollNumber && storedPassword && expirationDate > new Date()) {
            localStorage.removeItem('id');
            localStorage.removeItem('password');
            localStorage.removeItem('expirationDate');

            navigate('/admin/login');
        } else {
            // Clear the stored values if expired or not present
            localStorage.removeItem('rollno');
            localStorage.removeItem('password');
            localStorage.removeItem('expirationDate');

            navigate('/admin/login');
        }
        // eslint-disable-next-line 
    }, []);

    return <>
    </>
}

export default AdminLogout