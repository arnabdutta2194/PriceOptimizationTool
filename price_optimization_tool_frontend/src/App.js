import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // For handling routes
import Navbar from './components/Navbar'; // Navbar component
import Dashboard from './pages/Dashboard'; // Dashboard page
import CreateAndManageProducts from './pages/CreateAndManageProduct'; // Page for managing products
import PricingOptimization from './pages/PricingOptimization'; // Pricing optimization page
import LoginRegisterScreen from './Auth/LoginScreen'; // Login and registration screen
import './App.css'; // Custom styles for the app
import notification from './store/NotificationStore'; // MobX store for notifications
import PrivateRoute from './PrivateRoute'; // Route protection for authenticated users
import CustomSnackbar from './CustomNotification'; // Snackbar for notifications

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Persistent navigation bar */}
      <CustomSnackbar message={notification} /> {/* Snackbar for showing notifications */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Dashboard page={"landing"} />} /> {/* Landing page */}
        <Route path="/login" element={<LoginRegisterScreen actionType={"login"} />} /> {/* Login screen */}
        <Route path="/register" element={<LoginRegisterScreen actionType={"register"} />} /> {/* Registration screen */}

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={<PrivateRoute element={Dashboard} page="main" />} 
        /> {/* Main dashboard */}
        <Route 
          path="/products" 
          element={<PrivateRoute element={CreateAndManageProducts} />} 
        /> {/* Product management */}
        <Route 
          path="/pricing" 
          element={<PrivateRoute element={PricingOptimization} />} 
        /> {/* Pricing optimization */}
      </Routes>
    </Router>
  );
};

export default App;
