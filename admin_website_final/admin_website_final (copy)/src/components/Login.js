import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the custom CSS file

const Login = () => {
    const [email, setEmail] = useState('admin1@example.com');
    const [password, setPassword] = useState('password1');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9999/admin/signin', {
                Email: email,
                Password: password,
            });
            if (response.data.jwttoken) {
                localStorage.setItem("token", response.data.jwttoken);
                navigate('/dashboard');
            }
            else if (response.data.jwttoken== null)
            {
                alert("please enter corrrect credentials")
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-background">
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Card className="glassmorphism-card p-4 shadow-lg">
                    <h2 className="text-center mb-4">GMS ADMIN </h2>
                    <h4 className="text-center text-light mb-4">Welcome</h4>

                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="mt-4 w-100">
                            Login
                        </Button>
                    </Form>
                </Card>
            </Container>
        </div>
    );
};

export default Login;
