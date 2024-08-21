import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';

import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';
import ExampleCarouselImage from '../components/ExampleCarouselImage';
import { addCartItem, getProducts } from '../utils/api';


function Home() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [modalMessage, setModalMessage] = useState(''); // State for modal message
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data.data.slice(0, 4)); // Display only the first 4 products
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

    const handleViewAll = () => {
        navigate('/products'); // Navigate to the Products page
    };

    const handleAddToCart = async (productId) => {
        try {
            // Check if a cart exists for the customer
            const customerID = localStorage.getItem("CustID")
            const cartResponse = await axios.get(`http://localhost:9999/customer/cart/${customerID}`, getAuthHeader());
            
            let cartID;

            if (cartResponse.data.length > 0) {
                // If cart exists, get the CartID
                cartID = cartResponse.data[0].CartID;
            } else {
                // If cart doesn't exist, create a new cart
                const createCartResponse = await axios.post(`http://localhost:9999/customer/cart/`, { CustomerID: customerID }, getAuthHeader());
                
                // Fetch the newly created CartID
                const newCartResponse = await axios.get(`http://localhost:9999/customer/cart/${customerID}`, getAuthHeader());
                cartID = newCartResponse.data[0].CartID;
            }

            // Store the CartID in localStorage
            localStorage.setItem('cartID', cartID);

            const cartId = localStorage.getItem("cartID")
            await addCartItem(cartId, productId);

            // Show the modal with a success message
            setModalMessage("Product added to cart successfully!");
            setShowModal(true);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Show the modal with an error message
            setModalMessage("Failed to add product to cart.");
            setShowModal(true);
        }
    };
    return (
        <>
            {/* Carousel start */}
            <Carousel>
                <Carousel.Item>   
                    <ExampleCarouselImage imageUrl="https://images.deepai.org/art-image/567661c2a69c4988a64174164adbbfe1/grocery-store-website-images.jpg" text="First slide" />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <ExampleCarouselImage imageUrl="https://dummyimage.com/800x240/000/fff.png" text="Second slide" />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <ExampleCarouselImage imageUrl="https://dummyimage.com/800x240/000/fff.png" text="Third slide" />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            {/* Carousel end */} 

            {/* Product List start */}
            <Container className="my-4">
                <h2 className="text-center mb-4">Featured Products</h2>
                <Row xs={1} sm={2} md={4} lg={4} className="g-4">
                    {products.map((product) => (
                        <Col key={product.ProductID}>
                            <Card className="h-100 text-center pt-2 shadow">
                                <Card.Img className='p-2'
                                    variant="top"
                                    src={`http://localhost:9999/customer/image/${product.ProductID}`}
                                    alt={product.ProductName}
                                    style={{ width: '140px', height: '140px', objectFit: 'cover', margin: '0 auto' }}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/140'}
                                />
                                <Card.Body>
                                    <Card.Title>{product.ProductName}</Card.Title>
                                    <Card.Text className="fw-bold">₹{product.UnitPrice}</Card.Text>
                                    <Button variant="success" onClick={() => handleAddToCart(product.ProductID)}>
                                        Add to Cart
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="d-flex justify-content-center mt-4">
                    <Button variant="primary" onClick={handleViewAll}>
                        View All Products
                    </Button>
                </div>


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
            {/* Product List end */}
        </>



    );
}

export default Home;
