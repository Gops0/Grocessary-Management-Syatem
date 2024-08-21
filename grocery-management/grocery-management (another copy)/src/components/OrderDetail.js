import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Card, Container, Spinner } from 'react-bootstrap';

const OrderDetail = () => {
    const [orders, setOrders] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const CustID = localStorage.getItem('CustID');

            const getAuthHeader = () => {
                const token = localStorage.getItem('token');
                return {
                    headers: {
                        token: `${token}`,
                    },
                };
            };

            try {
                const response = await axios.get(`http://localhost:9999/customer/orderdetails/all/${CustID}`, getAuthHeader());
                const groupedOrders = response.data.reduce((acc, order) => {
                    if (!acc[order.OrderID]) {
                        acc[order.OrderID] = [];
                    }
                    acc[order.OrderID].push(order);
                    return acc;
                }, {});
                setOrders(groupedOrders);
            } catch (error) {
                setError('Failed to fetch orders');
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4 text-center">Order Details</h2>
            {Object.keys(orders).map((orderId) => (
                <Card key={orderId} className="mb-4 shadow-sm">
                    <Card.Header as="h5" className="bg-info text-white">
                        Order ID: {orderId}
                    </Card.Header>
                    <Card.Body>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Product Name</th>
                                    <th style={styles.th}>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders[orderId].map((order) => (
                                    <tr key={order.ProductName}>
                                        <td style={styles.td}>{order.ProductName}</td>
                                        <td style={styles.td}>{order.Quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

const styles = {
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        borderBottom: '2px solid #333',
        padding: '10px',
        textAlign: 'left',
        backgroundColor: '#eaeaea',
    },
    td: {
        borderBottom: '1px solid #ddd',
        padding: '10px',
    },
};

export default OrderDetail;
