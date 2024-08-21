import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCartItems, removeCartItem, updateCartItem } from '../utils/api';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const customerId = localStorage.getItem('CustID');

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const data = await getCartItems(customerId);
                console.log('Cart Items Response:', data); // Log to check data structure
                setCartItems(Array.isArray(data.data) ? data.data : []); // Ensure it's an array
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [customerId]);

    const handleRemoveItem = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
            setCartItems((prevItems) => prevItems.filter(item => item.CartItemID !== cartItemId));
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        try {
            await updateCartItem(itemId, newQuantity);
            setCartItems(cartItems.map(item => 
                item.CartItemID === itemId ? { ...item, Quantity: newQuantity } : item
            ));
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const handleCheckout = () => {
        if (totalPrice === 0) {
            alert("Please add items to the cart");
        } else {
            localStorage.setItem('total', totalPrice);
            navigate('/order');
        }
    };

    const totalPrice = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + item.UnitPrice * item.Quantity, 0) : 0;

    return (
        <Container className="my-4">
            <h2 className="text-center mb-4">Cart Items</h2>
            
            {cartItems.length === 0 ? (
                <div className="text-center">
                    <p>Your cart is empty</p>
                </div>
            ) : (
                <Row className="g-4">
                    {cartItems.map((item) => (
                        <Col key={item.CartItemID} md={4}>
                            <Card className="h-100 shadow-sm">
                                <Card.Img className='p-2'
                                    variant="top"
                                    src={`http://localhost:9999/customer/image/${item.ProductID}`}
                                    alt={item.ProductName}
                                    style={{ width: '140px', height: '140px', objectFit: 'cover', margin: '0 auto' }}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/140'}
                                />
                                <Card.Body className="d-flex flex-column align-items-center">
                                    <Card.Title>{item.ProductName}</Card.Title>
                                    <Card.Text className="fw-bold">₹{item.UnitPrice}</Card.Text>
                                    <Card.Text>Quantity: {item.Quantity}</Card.Text>
                                    <div className="d-flex justify-content-center gap-2 mt-auto">
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.CartItemID)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Cart Summary */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <h3>Total Price: ₹{totalPrice}</h3>
                <Button variant="primary" onClick={handleCheckout}>
                    Proceed to Checkout
                </Button>
            </div>
        </Container>
    );
};

export default Cart;
