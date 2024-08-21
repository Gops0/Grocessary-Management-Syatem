import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Pagination, Row } from 'react-bootstrap';
import { addCartItem, getProducts } from '../utils/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data.data);

                const uniqueCategories = [...new Set(data.data.map(product => product.CategoryName))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                token: `${token}`,
            },
        };
    };

    const handleAddToCart = async (productId) => {
        try {
            const customerID = localStorage.getItem("CustID");
            const cartResponse = await axios.get(`http://localhost:9999/customer/cart/${customerID}`, getAuthHeader());

            let cartID;
            if (cartResponse.data.length > 0) {
                cartID = cartResponse.data[0].CartID;
            } else {
                const createCartResponse = await axios.post(`http://localhost:9999/customer/cart/`, { CustomerID: customerID },getAuthHeader());
                const newCartResponse = await axios.get(`http://localhost:9999/customer/cart/${customerID}`);
                cartID = newCartResponse.data[0].CartID;
            }

            localStorage.setItem('cartID', cartID);
            await addCartItem(cartID, productId);

            setModalMessage("Product added to cart successfully!");
            setShowModal(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setModalMessage("Failed to add product to cart.");
            setShowModal(true);
        }
    };

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

    const handleCloseModal = () => setShowModal(false);

    const filteredProducts = products.filter(product =>
        product.ProductName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory ? product.CategoryName === selectedCategory : true)
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const advancedPagination = (
        <Pagination className="d-flex justify-content-center mt-4">
            <Pagination.First onClick={() => handlePageChange(1)} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
            {currentPage > 1 && <Pagination.Item onClick={() => handlePageChange(1)}>{1}</Pagination.Item>}
            {currentPage > 2 && <Pagination.Ellipsis />}
            {currentPage > 1 && <Pagination.Item onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</Pagination.Item>}
            <Pagination.Item active>{currentPage}</Pagination.Item>
            {currentPage < totalPages && <Pagination.Item onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</Pagination.Item>}
            {currentPage < totalPages - 1 && <Pagination.Ellipsis />}
            {currentPage < totalPages && <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} />
        </Pagination>
    );

    return (
        <Container className="my-4">
            {/* Search Bar and Category Dropdown */}
            <Form className="d-flex justify-content-between mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search Products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="me-2"
                />

                <Form.Select value={selectedCategory} onChange={handleCategoryChange} className="me-2">
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </Form.Select>

                <Button variant="success" size="sm">SEARCH</Button>
            </Form>

            {/* Product List */}
            <h2 className="text-center mb-4">Latest Products</h2>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {currentProducts.map((product) => (
                    <Col key={product.ProductID}>
                        <Card className="h-100 text-center pt-2 shadow">
                            <Card.Img
                                className='p-2'
                                variant="top"
                                src={`http://localhost:9999/customer/image/${product.ProductID}`}
                                alt={product.ProductName}
                                style={{ width: '140px', height: '140px', objectFit: 'cover', margin: '0 auto' }}
                                onError={(e) => e.target.src = 'https://via.placeholder.com/140'}
                            />
                            <Card.Body>
                                <Card.Title>{product.ProductName}</Card.Title>
                                <Card.Text className="fw-bold">₹{product.UnitPrice}</Card.Text>
                                <Button variant="success" size="sm" onClick={() => handleAddToCart(product.ProductID)}>
                                    Add to Cart
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Pagination */}
            {advancedPagination}

            {/* Modal for confirmation */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductList;
