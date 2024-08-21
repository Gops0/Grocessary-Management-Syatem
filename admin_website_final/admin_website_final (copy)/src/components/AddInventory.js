import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';


const AddInventory = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:9999/admin/products/getProducts', {
            headers: {
                token: localStorage.getItem('token'),
            },
        })
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedProductId || selectedProductId === '') {
            alert("Please select a product.");
            return;
        }

        const inventoryData = {
            ProductID: parseInt(selectedProductId, 10),
            Quantity: parseInt(quantity, 10),
        };

        await axios.post('http://localhost:9999/admin/inventory/add', inventoryData, 
        {
            headers: {
                'token': localStorage.getItem('token'),
            },
        })
            .then(response => {
                alert('Inventory added successfully!');
            })
            .catch(error => {
                console.error('There was an error adding the inventory!', error);
            });
    };


    return (
        <>
            <AdminNavbar/>

            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Card className="p-4 shadow-lg w-50">
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Add Inventory</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formProduct">
                                <Form.Label>Product</Form.Label>
                                <Form.Control 
                                    as="select"
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a product</option>
                                    {products.map(product => (
                                        <option key={product.ProductID} value={product.ProductID}>
                                            {product.ProductName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formQuantity" className="mt-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control 
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="success" type="submit" className="mt-3 w-100">
                                Add Inventory
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default AddInventory;
