import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleLogin = () => {
    if (!email.trim()) {
      alert('Please enter an ID');
      return;
    }
    
    // Check if there are any stored accounts
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const account = accounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      localStorage.setItem('user', JSON.stringify({ email: account.email, role: account.role }));
      navigate(account.role === 'admin' ? "/admin" : "/student");
    } else if (accounts.length === 0 && email.toLowerCase().includes('admin')) {
      // Fallback demo mode if no accounts exist
      const detectedRole = 'admin';
      localStorage.setItem('user', JSON.stringify({ email, role: detectedRole }));
      navigate("/admin");
    } else if (accounts.length === 0) {
      // Fallback demo mode if no accounts exist
      const detectedRole = 'student';
      localStorage.setItem('user', JSON.stringify({ email, role: detectedRole }));
      navigate("/student");
    } else {
      alert('Invalid email or password');
    }
  };

  const handleSignup = () => {
    if (!email.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    if (accounts.find(acc => acc.email === email)) {
      alert('Account already exists with this email');
      return;
    }

    accounts.push({ email, password, role });
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert('Account created successfully! You can now log in.');
    setIsSignup(false);
    setEmail('');
    setPassword('');
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
              
              <p style={{fontSize: '12px', color: '#666', marginTop: '20px'}}>
                <strong>Test IDs:</strong><br/>
                Type "admin" for Admin role<br/>
                Type anything else for Student role
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;