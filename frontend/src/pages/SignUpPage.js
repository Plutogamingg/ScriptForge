import React, { useState } from 'react';
import API_BASE_URL from '../hoc/url';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

const toggleLoginDropdown = () => setShowLogin(!showLogin);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    console.log('Logging in with:', loginEmail, loginPassword);
  
    fetch('${API_BASE_URL}/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Login successful:', data);
      // Here, save the login token to local storage, state, or context for session management
    })
    .catch((error) => {
      console.error('Error during login:', error);
    });
  };
  

  const checkPasswordStrength = (password) => {
    setPassword(password);
    if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length >= 8 && /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
      setPasswordStrength('strong');
    } else if (/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return; // Prevent submission if passwords do not match
    }

    checkPasswordStrength(password);

    if (passwordStrength === 'weak') {
      console.error('Password is too weak');
      return; // Prevent submission if the password is weak
    }

    fetch('${API_BASE_URL}/api/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok during signup');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // Assume `data` includes some token or means to authenticate the user
      loginNewUser(email, password);  // Log in the user right after registration
    })
    .catch((error) => {
      console.error('Error during signup:', error);
    });
  };
  const loginNewUser = (email, password) => {
    fetch('http://localhost:8000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to log in immediately after registration');
      }
      return response.json();
    })
    .then(data => {
      console.log('Logged in successfully:', data);
      // Here, save the login token to local storage, state, or context for session management
    })
    .catch(error => {
      console.error('Error during automatic login:', error);
    });
  };

  return (
    <>
      {/* Header with Gradient */}
      <header
        className="p-5"
        style={{
          background: "linear-gradient(135deg, #0F0F28 100%, #050506 0%)",
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <a href="#" className="text-white text-lg">Page1</a>
            <a href="#" className="text-white text-lg">Page2</a>
            <a href="#" className="text-white text-lg">Page3</a>
            <a href="#" className="text-white text-lg">Page4</a>
          </div>
          <a href="#" onClick={toggleLoginDropdown} className="text-orange-custom-400 text-lg">LOGIN</a>
          {showLogin && (
            <form className="absolute right-0 top-20 bg-black p-4 rounded-lg" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="form-input bg-transparent border-b-2 border-green-500 text-white w-full mb-2 focus:outline-none focus:border-green-600"
                placeholder="Email"
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="form-input bg-transparent border-b-2 border-green-500 text-white w-full mb-2 focus:outline-none focus:border-green-600"
                placeholder="Password"
              />
              <button type="submit" className="w-full text-white font-bold py-2 px-4 rounded bg-orange-500 hover:bg-orange-600 focus:outline-none focus:shadow-outline">
                Login
              </button>
            </form>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen" style={{
        background: "linear-gradient(135deg, #0F0F28 40%, #050506 60%)",
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Sign Up Section */}
        <div className="w-full max-w-lg px-6 py-12 text-center">
          <h2 className="text-5xl font-bold text-white mb-6"> <span style= {{color: '#FFA32C'}} >SIGN </span><span style= {{color: '#0BF1B7'}}>UP</span></h2>
          {/* Other content */}
        </div>
        {/* The rest of your content */}
      
        {/* Sign Up Section */}
        <div className="w-full bg-off-white py-6">
        <div className="text-center">
  <h2 className="text-3xl text-orange-400 font-bold">BENEFITS OF SIGNING UP</h2>
  <p className="mt-4 mb-8 max-w-lg mx-auto text-black 300">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  <button className="bg-orange-400 p-2 rounded-full inline-flex items-center justify-center" style={{ width: '75x', height: '50px' }}>
    <span className="text-black text-3xl">↓</span>
  </button>
</div>
</div>

<form className="w-full max-w-lg bg-black p-8 bg-transparent flex justify-center flex-wrap" onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input mb-6 bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" />
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-input mb-6 bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-input mb-6 bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input mb-6 bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input mb-6 bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" />
          <button type="submit" className="w-full text-black font-bold py-3 px-4 rounded-full bg-orange-500 hover:bg-orange-600 focus:outline-none focus:shadow-outline">
            SIGN UP
          </button>
        </form>
      </main>
    </>
  );
    }


