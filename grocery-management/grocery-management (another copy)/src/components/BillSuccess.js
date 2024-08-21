import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BillSuccess = () => {
    const total = localStorage.getItem('total');
    const navigate = useNavigate();

    const handleBackToHome = () => {
        localStorage.removeItem('total')
        navigate('/home');
    };

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">Order Placed Successfully!</Card.Title>
                            <Card.Text className="text-center">
                                Thank you for your purchase! Your order has been placed successfully.
                            </Card.Text>
                            <Card.Text className="text-center">
                                <strong>Total Price:</strong> ₹{total}
                            </Card.Text>
                            <Card.Text className="text-center text-success">
                                Payment made successfully!
                            </Card.Text>
                            <Button variant="primary" onClick={handleBackToHome} className="w-100">
                                Back to Home
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BillSuccess;
