import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Cart, PersonCircle } from 'react-bootstrap-icons'; // Import Bootstrap Icons
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { removecartID, removeCID, removeorderID, removeToken } from '../utils/storage';

const CustomNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        removeToken();
        removeCID();
        removecartID();
        removeorderID();
        
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/home" className="me-auto">
                    Grocery Store
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto"> {/* Align tabs to the right */}
                    <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                        <Nav.Link as={Link} to="/products">Products</Nav.Link>
                        <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
                        <Nav.Link as={Link} to="/cart">
                            <Cart size={24} /> {/* Cart icon */}
                        </Nav.Link>
                        {isAuthenticated() ? (
                            <NavDropdown
                                title={<PersonCircle size={24} />} // Profile icon with dropdown
                                id="profile-dropdown"
                                align="end" // Align dropdown to the right
                            >
                            <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/orderDetails">Orders</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link 
                                as={Link} 
                                to="/login" 
                                className="btn btn-outline-success rounded-pill px-4 py-2 ms-3" size="sm"
                            >
                                Login
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;