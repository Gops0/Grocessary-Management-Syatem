import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { removecartID } from '../utils/storage';

const Order = () => {
    const [ShipAddress, setShipAddress] = useState('');
    const [ShipCity, setShipCity] = useState('');
    const [ShipPostalCode, setShipPostalCode] = useState('');
    const [ShipCountry, setShipCountry] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const CustID = localStorage.getItem('CustID');
        const orderData = {
            ShipAddress,
            ShipCity,
            ShipPostalCode,
            ShipCountry
        };

        const getAuthHeader = () => {
            const token = localStorage.getItem('token');
            return {
                headers: {
                    token: `${token}`,
                },
            };
        };

        try {
            // Post the order data
            const response = await axios.post(`http://localhost:9999/customer/orders/addorder/${CustID}`, orderData, getAuthHeader());
          //  console.log('Order placed:', response.data);

            // Fetch the last order for the customer
            const lastOrderResponse = await axios.get(`http://localhost:9999/customer/orders/lastorder/${CustID}`, getAuthHeader());
            const lastOrder = lastOrderResponse.data;

            // Store the last order ID in local storage
            if (lastOrder.length > 0) {
                const OrderID = lastOrder[0].OrderID;
                localStorage.setItem('OrderId', OrderID);
                const cartId = localStorage.getItem('cartID')

                // Post to copy order items
                await axios.post(`http://localhost:9999/customer/orderdetails/copyorderitem/${OrderID}/${CustID}`, {}, getAuthHeader());

                // const cartItems= await axios.get(`http://localhost:9999/customer/cartitems/all/${CustID}`,getAuthHeader())



                const finalcartItems = await axios.get(`http://localhost:9999/customer/cartitems/all/${CustID}`, getAuthHeader())

                const cartItems = finalcartItems.data;

        // Loop through each cart item and reduce the quantity in the inventory
        for (const item of cartItems) {
            const productID = item.ProductID;

            // Make the PUT request to reduce the inventory quantity for the specific ProductID
            await axios.put(`http://localhost:9999/customer/reduce/product/${productID}`, null, getAuthHeader());

            console.log(`Inventory reduced for ProductID: ${productID}`);
       

        }
                console.log(finalcartItems);


                await axios.delete(`http://localhost:9999/customer/cartitems/delete/${cartId}`, getAuthHeader());
                
                await axios.delete(`http://localhost:9999/customer/cart/${cartId}`, getAuthHeader());



                removecartID();
                //localStorage.removeItem('total');

                // Redirect to order details page
                // navigate('/orderDetails');
                // Inside the handleSubmit function after removecartID()
                navigate('/billSuccess');

            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">Place Order</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Shipping Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={ShipAddress}
                                        onChange={(e) => setShipAddress(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={ShipCity}
                                        onChange={(e) => setShipCity(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Postal Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={ShipPostalCode}
                                        onChange={(e) => setShipPostalCode(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={ShipCountry}
                                        onChange={(e) => setShipCountry(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Place Order
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Order;
