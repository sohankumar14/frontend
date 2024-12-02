import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import LoginPopup from './components/LoginPopup/LoginPopup';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';

const App = () => {
  const [showLogin, setShowLogin] = useState(false); // For displaying the login popup
  const [isLoggedIn, setIsLoggedIn] = useState(false); // For tracking login state
  const [user, setUser] = useState(null); // To store logged-in user data
  const navigate = useNavigate(); // For navigating programmatically

  // Check local storage for login state when the app loads
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowLogin(false);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from localStorage
    navigate('/'); // Navigate to home after logout
  };

  return (
    <>
      {showLogin && !isLoggedIn && (
        <LoginPopup setShowLogin={setShowLogin} handleLogin={handleLogin} />
      )}

      <div className="app">
        <Navbar
          setShowLogin={setShowLogin}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Protected Routes - Only show these if the user is logged in */}
          <Route 
            path="/order" 
            element={isLoggedIn ? <PlaceOrder /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/my-orders" 
            element={isLoggedIn ? <MyOrders /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;
