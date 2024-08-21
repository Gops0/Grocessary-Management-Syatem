import React from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import AboutUs from './components/About';
import BillSuccess from './components/BillSuccess';
import Blogs from './components/Blog';
import Cart from './components/Cart';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Order from './components/Order';
import OrderDetail from './components/OrderDetail';
import ProductList from './components/ProductList';
import Profile from './components/Profile';
import Register from './components/Register';

const App = () => {
  const location = useLocation();
  
  // Hide Navbar on Login and Register pages
  const shouldShowNavbar = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/home" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orderdetails" element={<OrderDetail />} />
        <Route path="/billSuccess" element={<BillSuccess />} />

      
        <Route path='/about' element={<AboutUs/>} />
        <Route path='/blogs' element={<Blogs/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/profile' element={<Profile/>} />

        {/* Add more routes as needed */}
      </Routes>
      {shouldShowNavbar && <Footer />} {/* Adding Footer UI component */}
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
