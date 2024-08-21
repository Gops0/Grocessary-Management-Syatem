import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import './Footer.css'; // Optional custom styles

function Footer() {
    return (
        <footer className="bg-dark text-white py-4" fixed="bottom">
            <Container>
                <Row>
                    {/* Company Info */}
                    <Col md={4} className="mb-3 mb-md-0">
                        <h5 className="text-uppercase">Company</h5>
                        <p>
                            We are a leading company providing exceptional services and products.
                            Our mission is to deliver high-quality solutions to our clients.
                        </p>
                    </Col>

                    {/* Quick Links */}
                    <Col md={4} className="mb-3 mb-md-0">
                        <h5 className="text-uppercase">Quick Links</h5>
                        <ListGroup variant="flush">
                            <ListGroupItem action href="/home" className="bg-dark border-0 text-white">Home</ListGroupItem>
                            <ListGroupItem action href="/about" className="bg-dark border-0 text-white">About Us</ListGroupItem>
                            <ListGroupItem action href="/products" className="bg-dark border-0 text-white">Products</ListGroupItem>
                            <ListGroupItem action href="/contact" className="bg-dark border-0 text-white">Contact Us</ListGroupItem>
                        </ListGroup>
                    </Col>

                    {/* Contact Info */}
                    <Col md={4}>
                        <h5 className="text-uppercase">Contact Us</h5>
                        <ul className="list-unstyled">
                            <li>123 Business Rd., Suite 456</li>
                            <li>Business City, BC 12345</li>
                            <li>Email: info@company.com</li>
                            <li>Phone: (123) 456-7890</li>
                        </ul>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col className="text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} | <a className='text-decoration-none text-white' >Grocery Store</a> | All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
