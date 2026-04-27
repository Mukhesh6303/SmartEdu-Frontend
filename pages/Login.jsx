import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleLogin = async () => {
    if (!email.trim()) {
      alert('Please enter an ID');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/accounts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        // Still keep basic user info in local storage for frontend routing logic (like layouts)
        localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role }));
        navigate(data.role === 'admin' ? "/admin" : "/student");
      } else {
        alert('Invalid email or password. Are you registered via the backend?');
      }
    } catch (err) {
      alert('Error connecting to backend: ' + err.message);
    }
  };

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/accounts/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // We ensure we send email, password, and role to match Account entity
        body: JSON.stringify({ email, password, role })
      });

      if (response.ok) {
        alert('Account created successfully! You can now log in.');
        setIsSignup(false);
        setEmail('');
        setPassword('');
      } else {
        alert('Account already exists with this email');
      }
    } catch (err) {
      alert('Error connecting to backend: ' + err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome to SmartEdu</h2>
          <p>Course Management System</p>
        </div>

        <div className="login-form">
          {isSignup ? (
            <>
              <input 
                type="text" 
                placeholder="Email or ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="role-select"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>

              <button className="login-btn" onClick={handleSignup}>Create Account</button>

              <p className="toggle-auth">
                Already have an account? 
                <button 
                  className="toggle-link" 
                  onClick={() => {
                    setIsSignup(false);
                    setEmail('');
                    setPassword('');
                  }}
                >
                  Log in
                </button>
              </p>
            </>
          ) : (
            <>
              <input 
                type="text" 
                placeholder="Student / Admin ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="login-btn" onClick={handleLogin}>Log in</button>

              <p className="forgot-password">
                Forgot password?
              </p>

              <p className="toggle-auth">
                Don't have an account? 
                <button 
                  className="toggle-link" 
                  onClick={() => {
                    setIsSignup(true);
                    setEmail('');
                    setPassword('');
                    setRole('student');
                  }}
                >
                  Create new account
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;