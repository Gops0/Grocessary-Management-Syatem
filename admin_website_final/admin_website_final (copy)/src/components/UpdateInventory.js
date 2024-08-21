import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const UpdateInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchInventory();
        fetchProducts();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://localhost:9999/admin/inventory/get', {
                headers: {
                    token: localStorage.getItem('token'),
                },
            });
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:9999/admin/products/getProducts', {
                headers: {
                    token: localStorage.getItem('token'),
                },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleEditClick = (inventoryItem) => {
        setSelectedInventory(inventoryItem);
        setSelectedProductId(inventoryItem.ProductID);
        setQuantity(inventoryItem.Quantity);
    };

    const handleDeleteClick = async (inventoryId) => {
        if (window.confirm('Are you sure you want to delete this inventory item?')) {
            try {
                await axios.delete(`http://localhost:9999/admin/inventory/${inventoryId}`, {
                    headers: {
                        token: localStorage.getItem('token'),
                    },
                });
                alert('Inventory item deleted successfully!');
                fetchInventory();
            } catch (error) {
                console.error('Error deleting inventory:', error);
            }
        }
    };

    const handleUpdateInventory = async (event) => {
        event.preventDefault();
        if (!selectedInventory) return;

        try {
            const updateData = {
                ProductID: parseInt(selectedProductId, 10),
                Quantity: parseInt(quantity, 10),
                LastUpdated: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };

            await axios.put(`http://localhost:9999/admin/inventory/${selectedInventory.InventoryID}`, updateData, {
                headers: {
                    token: localStorage.getItem('token'),
                },
            });

            alert('Inventory updated successfully!');
            setSelectedInventory(null);
            setSelectedProductId('');
            setQuantity('');
            fetchInventory();
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    
    return (
        <>
            
            <AdminNavbar/>
            
            <Container className="mt-5 mb-5">
                <Card className="shadow-lg">
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Inventory Management</Card.Title>
                        <Table striped bordered hover responsive className="text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>Inventory ID</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item.InventoryID}>
                                        <td>{item.InventoryID}</td>
                                        <td>{item.ProductName}</td>
                                        <td>{item.Quantity}</td>
                                        <td>
                                            <Button variant="warning" className="me-2" onClick={() => handleEditClick(item)}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDeleteClick(item.InventoryID)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {selectedInventory && (
                            <Form onSubmit={handleUpdateInventory} className="mt-4">
                                <Form.Group controlId="productSelect">
                                    <Form.Label>Select Product</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(product => (
                                            <option key={product.ProductID} value={product.ProductID}>
                                                {product.ProductName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="quantityInput" className="mt-3">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="Quantity"
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" variant="success" className="mt-3 mb-3 w-100">
                                    Update Inventory
                                </Button>
                            </Form>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default UpdateInventory;
