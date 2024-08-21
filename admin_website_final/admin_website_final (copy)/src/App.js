// src/App.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddInventory from './components/AddInventory';
import AddProduct from './components/AddProduct';
import Categories from './components/Categories';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProductList from './components/ProductList';
import UpdateInventory from './components/UpdateInventory';
import OrderList from './components/OrderList';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/addproduct" element={<AddProduct />} />
                <Route path="/orderlist" element={<OrderList />} /> {/* Add the new route */}

                <Route path="/productlist" element={<ProductList />} />
                <Route path="/addinventory" element={<AddInventory />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/updateinventory" element={<UpdateInventory />} />

                
            </Routes>
        </Router>
    );
};

export default App;
