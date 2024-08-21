import React from 'react';
import { Card, Col, Container, Nav, Row } from 'react-bootstrap';
import { BoxSeam, FileText, Layers, List, PlusCircle } from 'react-bootstrap-icons'; // Import Bootstrap Icons
import { Link } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const Dashboard = () => {
    

    return (
        <>
            <AdminNavbar/>

            <Container fluid className="mt-4">
                <Row>
                    <Col md={4}>
                        <Card className="shadow-lg border-0 rounded bg-dark text-light">
                            <Card.Body>
                                <Card.Title>Actions</Card.Title>
                                <hr />
                                <Nav className="flex-column">
                                    <Nav.Link as={Link} to="/addproduct">
                                        <PlusCircle className="me-2"/> Add Product
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/productlist">
                                        <List className="me-2"/> Product List
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/categories">
                                        <Layers className="me-2"/> Manage Categories
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/addinventory">
                                        <BoxSeam className="me-2"/> Add Inventory
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/updateinventory">
                                        <FileText className="me-2"/> Inventory List
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/orderlist">
                                        <FileText className="me-2"/> Order List
                                    </Nav.Link>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={8}>
                        <Card className="shadow-sm border-0 rounded">
                            <Card.Body>
                                <Card.Title>Welcome to the Grocery Management | Admin Dashboard...!!!</Card.Title>
                                <p>This is your central hub for managing products, categories, and inventory.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Dashboard;
