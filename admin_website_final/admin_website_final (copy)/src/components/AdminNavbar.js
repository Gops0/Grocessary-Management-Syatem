import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Navbar bg="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard" className="mx-auto text-light">Admin Dashboard</Navbar.Brand>
                <Button variant="danger" onClick={handleLogout} className="rounded-pill">
                    Logout
                </Button>
            </Container>
        </Navbar>
    );
};

export default AdminNavbar;
