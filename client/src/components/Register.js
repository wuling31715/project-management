
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      username,
      password,
    };

    axios.post('http://localhost:5000/api/users/register', newUser)
      .then(res => {
        console.log(res.data);
        // Handle successful registration (e.g., redirect to login)
      })
      .catch(err => {
        console.log(err);
        // Handle registration error
      });
  };

  return (
    <div>
      <h3>Register</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <input type="text" required className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input type="password" required className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="submit" value="Register" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};

export default Register;
