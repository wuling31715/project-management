
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    const user = {
      username,
      password,
    };

    axios.post('http://localhost:5000/api/users/login', user)
      .then(res => {
        console.log(res.data);
        // Handle successful login (e.g., store token, redirect)
      })
      .catch(err => {
        console.log(err);
        // Handle login error
      });
  };

  return (
    <div>
      <h3>Login</h3>
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
          <input type="submit" value="Login" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};

export default Login;
