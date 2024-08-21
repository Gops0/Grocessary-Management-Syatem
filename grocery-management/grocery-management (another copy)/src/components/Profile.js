import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import './Profile.css'; // Optional custom styles

function Profile() {
    return (
        <Container className="my-5">
            <Row>
                <Col md={4} className="text-center mb-4 mb-md-0">
                    {/* Profile Picture */}
                    <Card className="shadow-sm mb-3">
                        <Card.Img
                            variant="top"
                            src="https://via.placeholder.com/300"
                            alt="Profile Picture"
                            className="profile-img"
                        />
                    </Card>
                    <Button variant="primary" className="w-100">Change Profile Picture</Button>
                </Col>

                <Col md={8}>
                    {/* User Details */}
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">User Profile</Card.Title>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="John Doe" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="johndoe@example.com" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="text" placeholder="+1 234 567 890" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" placeholder="123 Main St, Anytown, USA" />
                                </Form.Group>

                                <Button variant="success" type="submit">Save Changes</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
