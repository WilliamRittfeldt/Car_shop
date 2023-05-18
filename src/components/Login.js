import React, { useState } from 'react';
import {registerUser, getUserByName} from '../Api';
import {useNavigate} from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useState({ name: '', password: '' });
  const [loginForm, setLoginForm] = useState({ name: '', password: '' });

  const handleRegisterChange = e => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = e => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

   //Används vid onSubmit när man ska registrera ny användare
  const handleRegisterSubmit = async e => {
    e.preventDefault();
    try {
      console.log(registerForm);
      await registerUser(registerForm);
      navigate(`/profile/${registerForm.name}`);
      setRegisterForm({ name: '', password: '' });
    } catch (err) {
      console.error(err);
    }
  };

  //Används vid onSubmit när man ska logga in
  const handleLoginSubmit = async e => {
    e.preventDefault();
    try {
      let response = await getUserByName(loginForm.name);
      console.log(response);
      if (response.username == loginForm.name && response.password === loginForm.password) {
        navigate(`/profile/${loginForm.name}`);
      } else {
        alert('Incorrect username or password');
      }
      setLoginForm({ name: '', password: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-3">
              <label htmlFor="registerName" className="form-label">Name</label>
              <input type="text" name="name" value={registerForm.name} onChange={handleRegisterChange} className="form-control" id="registerName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="registerPassword" className="form-label">Password</label>
              <input type="password" name="password" value={registerForm.password} onChange={handleRegisterChange} className="form-control" id="registerPassword" required />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </div>
        <div className="col">
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label htmlFor="loginName" className="form-label">Name</label>
              <input type="text" name="name" value={loginForm.name} onChange={handleLoginChange} className="form-control" id="loginName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <input type="password" name="password" value={loginForm.password} onChange={handleLoginChange} className="form-control" id="loginPassword" required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );

}

export default Login;