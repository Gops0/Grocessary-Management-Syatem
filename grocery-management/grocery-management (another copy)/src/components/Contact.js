import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

function Contact() {
    return (
        <Container className="my-5">
            <Row>
                {/* Contact Form */}
                <Col md={6}>
                    <h1 className="text-center mb-4">Contact Us</h1>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your name" />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter your email" />
                        </Form.Group>
                        <Form.Group controlId="formSubject" className="mt-3">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control type="text" placeholder="Subject" />
                        </Form.Group>
                        <Form.Group controlId="formMessage" className="mt-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control as="textarea" rows={5} placeholder="Your message" />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Send Message
                        </Button>
                    </Form>
                </Col>
                
                {/* Contact Details and Map */}
                <Col md={6}>
                    <h1 className="text-center mb-4">Our Location</h1>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Our Office</Card.Title>
                            <Card.Text>
                                123 Business Rd.<br />
                                Suite 456<br />
                                Business City, BC 12345<br />
                                Email: info@company.com<br />
                                Phone: (123) 456-7890
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    
                    {/* Embedded Google Map */}
                    <div className="embed-responsive embed-responsive-16by9">
                        <iframe
                            className="embed-responsive-item"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.091056932549!2d-122.40641768468009!3d37.78812397975963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808eb75c7c89%3A0x96e1d1658130ff25!2s123%20Business%20Rd%2C%20Business%20City%2C%20BC%2012345!5e0!3m2!1sen!2sus!4v1653395019324!5m2!1sen!2sus"
                            allowFullScreen="" loading="lazy"></iframe>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Contact;
