import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import AdminNavbar from './AdminNavbar';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const navigate = useNavigate();

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

    const handleAddCategory = async () => {
        try {
            await axios.post('http://localhost:9999/admin/categories/add', { CategoryName: newCategory }, {
                headers: {
                    token: localStorage.getItem('token'),
                },
            });
            setCategories([...categories, { CategoryName: newCategory }]);
            setNewCategory('');
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

   

    return (
        <>
           <AdminNavbar />

            <Container className="mt-5">
                <Card className="shadow-lg">
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Manage Categories</Card.Title>

                        <Form.Group controlId="formNewCategory" className="mt-4">
                            <Form.Control
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Add New Category"
                            />
                        </Form.Group>
                        <Button variant="success" onClick={handleAddCategory} className="mt-3 mb-4 w-100">
                            Add Category
                        </Button>

                        <Table striped bordered hover responsive >
                            <thead className="table-dark">
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Category Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{category.CategoryName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Categories;
