// SignIn.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css"; // Import your external CSS file

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        console.log("User signed in successfully");
        const userData = await response.json();

        if (userData && userData.user) {
          const username = userData.user.username;
          navigate(`/user/${username}`);
        } else {
          setError('Error signing in: Invalid user data');
        }
      } else {
        const errorMessage = await response.text();
        setError(`Error signing in: ${errorMessage || response.statusText}`);
      }
    } catch (error) {
      setError(`Error signing in: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Sign In</h2>
      <form className="form">
        <label className="label">
          Email:
          <input
            className="input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label className="label">
          Password:
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button className="button" type="button" onClick={handleSignIn}>
          Sign In
        </button>
      </form>
      <p className="link">
        Don't have an account?{" "}
        <Link to="/signup">Create an account. SignUp</Link>
      </p>
    </div>
  );
};

export default SignIn;
