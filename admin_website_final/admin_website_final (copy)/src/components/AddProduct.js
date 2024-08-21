import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';


const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [categories, setCategories] = useState([]);
    const [adminID, setAdminID] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [unitsOnOrder, setUnitsOnOrder] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    // Fetch categories from API on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:9999/admin/categories', {
                    headers: {
                        token: localStorage.getItem('token'),
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Handle form submission to add a new product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('ProductName', productName);
        formData.append('CategoryID', categoryID);
        formData.append('AdminID', adminID);
        formData.append('UnitPrice', unitPrice);
        formData.append('UnitsOnOrder', unitsOnOrder);
        if (image) 
        {
            formData.append('image', image);
        }

        try {
            await axios.post('http://localhost:9999/admin/products/add', formData, {
                headers: {
                    token: localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Product added successfully');
            navigate('/dashboard'); // Navigate to dashboard after successful addition
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    };

   

    return (
        <>
            <AdminNavbar/>

            <Container className="d-flex justify-content-center align-items-center p-4" style={{ minHeight: '80vh' }}>
                <Card className="shadow p-4" style={{ width: '50%' }}>
                    <h3 className="text-center mb-4">Add Product</h3>
                    <Form onSubmit={handleAddProduct}>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Enter product name"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCategory" className="mt-3">
                            <Form.Label>Select Category</Form.Label>
                            <Form.Control
                                as="select"
                                value={categoryID}
                                onChange={(e) => setCategoryID(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.CategoryID} value={category.CategoryID}>{category.CategoryName}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formUnitPrice" className="mt-3">
                            <Form.Label>Unit Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value)}
                                placeholder="Enter unit price"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formUnitsOnOrder" className="mt-3">
                            <Form.Label>Units on Order</Form.Label>
                            <Form.Control
                                type="number"
                                value={unitsOnOrder}
                                onChange={(e) => setUnitsOnOrder(e.target.value)}
                                placeholder="Enter units on order"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formImage" className="mt-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="mt-4 w-100">
                            Add Product
                        </Button>
                    </Form>
                </Card>
            </Container>
        </>
    );
};

export default AddProduct;
