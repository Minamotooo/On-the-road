// SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css"; // Import the SignUp.css file

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          firstname: first_name,
          lastname: last_name,
        }),
      });
  
      if (response.ok) {
        console.log("User registered successfully");
        navigate(`/user/${username}`);
      } else {
        const errorMessage = await response.text();
        setError(`Error signing up: ${errorMessage || response.statusText}`);
      }
    } catch (error) {
      setError(`Error signing up: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Sign Up</h2>
      <form className="form">
        <label className="label">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
        </label>
        <br />
        <label className="label">
          First Name:
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            className="input"
          />
        </label>
        <br />
        <label className="label">
          Last Name:
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            className="input"
          />
        </label>
        <br />
        <label className="label">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </label>
        <br />
        <label className="label">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </label>
        <br />
        <button
          type="button"
          onClick={handleSignUp}
          disabled={loading}
          className="button"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
      <p className="link">
        Already have an account?{" "}
        <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
