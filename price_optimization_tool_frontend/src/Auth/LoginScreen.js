import sessionStore from "../store/SessionStore"; // Import session store for managing login state
import React, { useState } from "react"; // Import React and useState hook for managing form states
import "./LoginScreen.css"; // Import CSS styles for the login screen
import LoginIcon from "@mui/icons-material/Login"; // Import Login icon from Material UI
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation between routes
import ConstData from "../config.json"; // Import configuration data (e.g., backend URL)
import notification from "../store/NotificationStore"; // Import notification store to show messages

// LoginRegisterScreen component handles both login and registration functionality
const LoginRegisterScreen = ({ actionType }) => {
  // State hooks for form fields: email, userType, username, and password
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("supplier");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to validate form inputs before submission
  const validateForm = () => {
    // Check if username and password are provided for registration or login
    if ((actionType === "register" && !username) || !password) {
      notification.addNotification({
        open: true,
        message: "Username and Password are required!"
      })
      return false;
    }

    // Validate email format using a regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notification.addNotification({
        open: true,
        message: "Invalid email format!"
      })
      return false;
    }

    // Additional password validation for registration (e.g., must have number and special character)
    if (actionType === "register") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        notification.addNotification({
          open: true,
          message: "Password must be at least 8 characters long, include a number, and a special character."
        })
        return false;
      }
    }
    return true; // Return true if all validations pass
  };

  // Function to handle form submission for login or registration
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!validateForm()) return; // Only proceed if form validation passes

    try {
      if (actionType === "login") {
        // Handle login action
        await fetch(`${ConstData.backendUrl}/accounts/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: password,
          })
        }).then(async (res) => {
          var response = await res.json();
          if (response.detail) {
            notification.addNotification({
              open: true,
              message: response.detail
            })
          } else {
            sessionStore.login(response); // Store the login session
            notification.addNotification({
              open: true,
              message: "Login Successful!"
            })
            navigate("/dashboard"); // Navigate to the dashboard upon successful login
          }
        })
      } else if (actionType === "register") {
        // Handle registration action
        await fetch(`${ConstData.backendUrl}/accounts/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            username,
            password,
            role: userType, // Set user role (supplier, buyer, admin)
          })
        }).then(async (res) => {
          var response = await res.json();
          notification.addNotification({
            open: true,
            message: "Registration success. To activate your account, please verify your email id!"
          })
        }).catch((err) => {
          notification.addNotification({
            open: true,
            message: `Error registering user: ${err}`
          })
        }).finally(() => {
          navigate("/login"); // Navigate to login page after registration
        })
      }
    } catch (error) {
      // Handle any error that occurs during login or registration
      notification.addNotification({
        open: true,
        message: `Error ${actionType === "login" ? "logging in" : "registering"}: ${error.response?.data?.message || error.message}`
      })
    }
  };

  return (
    <>
      {/* Main container for the login/register screen */}
      <div className="App-header">
        <div className="login-screen">
          {/* Header section with login icon and action type (login/register) */}
          <div className="login-header">
            <LoginIcon fontSize="large" style={{ margin: "15px 10px 10px" }} />
            <h1>{actionType === "login" ? "Login" : "Register User"}</h1>
          </div>
          {/* Form section for user input */}
          <div className="login-form">
            <form onSubmit={handleSubmit}> {/* Handle form submission */}
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                />
              </div>
              {/* Conditionally render user type and username fields for registration */}
              {actionType === "register" && (
                <>
                  <div className="form-group">
                    <label>User Type:</label>
                    <select
                      className="form-control"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)} // Update user type state
                    >
                      <option value="supplier">Supplier</option>
                      <option value="buyer">Buyer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Username:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} // Update username state
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                />
              </div>
              {/* Submit button text based on action type (Login/Register) */}
              <button className="btn-login">
                {actionType === "login" ? "Login" : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegisterScreen; // Export the component to be used elsewhere in the app
