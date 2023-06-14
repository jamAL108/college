import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Form from './Pages/Form'
import Logout from './Pages/Logout';
import Request from './Pages/Request';
import "./App.css"
import AdminLogin from './Admin/AdminLogin';
import AdminRequests from './Admin/AdminRequests';
import AdminLogout from './Admin/AdminLogout';

function App() {
  return (
    <>
      <Routes>
        <Route exact path='/login' element={<Login/>} />
        <Route exact path='/form' element={<Form/>} />
        <Route exact path='/request' element={<Request/>}/>
        <Route exact path='/logout' element={<Logout/>} />
        <Route exact path='/admin/login' element={<AdminLogin/>} />
        <Route exact path='/adminrequests' element={<AdminRequests/>} />
        <Route exact path='/admin/logout' element={<AdminLogout/>} />
      </Routes>
    </>
  );
}

export default App;