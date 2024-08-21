import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Container, Table } from 'react-bootstrap';

const OrderList = () => {
    const [groupedOrders, setGroupedOrders] = useState({});

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:9999/admin/allorders', {
                headers: {
                    token: localStorage.getItem('token'),
                },
            });

            const orders = response.data;

            // Group orders by OrderID and sum quantities for duplicate ProductNames
            const grouped = orders.reduce((acc, order) => {
                if (!acc[order.OrderID]) {
                    acc[order.OrderID] = {
                        CustomerName: order.CustomerName,
                        items: {},
                    };
                }

                // Check if the product already exists in the current order
                if (acc[order.OrderID].items[order.ProductName]) {
                    // If it exists, sum the quantities
                    acc[order.OrderID].items[order.ProductName].Quantity += order.Quantity;
                } else {
                    // If not, add the product to the items list
                    acc[order.OrderID].items[order.ProductName] = { ...order };
                }

                return acc;
            }, {});

            // Convert the items object to an array for easier mapping
            const formattedOrders = Object.keys(grouped).reduce((acc, orderID) => {
                acc[orderID] = {
                    CustomerName: grouped[orderID].CustomerName,
                    items: Object.values(grouped[orderID].items),
                };
                return acc;
            }, {});

            setGroupedOrders(formattedOrders);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Order List</h2>
            {Object.keys(groupedOrders).map(orderID => (
                <Card key={orderID} className="mb-4">
                    <Card.Header>
                        <h4>Order ID: {orderID}</h4>
                        <h4>Customer: {groupedOrders[orderID].CustomerName}</h4>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedOrders[orderID].items.map((order, index) => (
                                    <tr key={index}>
                                        <td>{order.ProductName}</td>
                                        <td>{order.Quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default OrderList;
