const mysql = require('mysql2');
const express = require('express');
const config = require('config');

const app = express.Router();

const connectionDetails = {
    host: config.get("host"),
    database: config.get("database"),
    port: config.get("serverport"),
    user: config.get("user"),
    password: config.get("password")
};

// Create a connection pool
const pool = mysql.createPool(connectionDetails);

// Get the most sold products
app.get('/most-sold', (req, res) => {
    const query = `
        SELECT 
            ProductID,
            SUM(Quantity) AS TotalQuantitySold
        FROM 
            OrderDetails
        GROUP BY 
            ProductID
        ORDER BY 
            TotalQuantitySold DESC
        LIMIT 6;
    `;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching most sold products:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(results);
    });
});

// GET all orders and order items by customer ID
app.get("/all/:cid", (req, res) => {
    const customerID = req.params.cid;

    const queryText = `
        SELECT 
            OrderDetails.OrderID,
            Products.ProductName,
            OrderDetails.Quantity
        FROM 
            OrderDetails
        INNER JOIN 
            Products ON Products.ProductID = OrderDetails.ProductID
        INNER JOIN 
            Orders ON Orders.OrderID = OrderDetails.OrderID
        WHERE 
            Orders.CustomerID = ?
    `;

    pool.query(queryText, [customerID], (err, result) => {
        res.setHeader("Content-Type", "application/json");
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

// Add order item into order details table for a particular order
app.post("/addorderitem/:oid/:pid", (req, res) => {
    const orderID = req.params.oid;
    const productID = req.params.pid;
    const { Quantity, UnitPrice, Discount } = req.body;

    const queryText = `
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice, Discount)
        VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(queryText, [orderID, productID, Quantity, UnitPrice, Discount], (err, result) => {
        res.setHeader("Content-Type", "application/json");
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

// Copy items from cart to order details
app.post("/copyorderitem/:oid/:cid", (req, res) => {
    const orderID = req.params.oid;
    const customerID = req.params.cid;

    const queryText = `
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice, Discount)
        SELECT 
            ?, 
            Products.ProductID,
            CartItems.Quantity,
            Products.UnitPrice,
            0.00 AS Discount 
        FROM 
            CartItems
        INNER JOIN 
            Cart ON Cart.CartID = CartItems.CartID
        INNER JOIN 
            Products ON Products.ProductID = CartItems.ProductID
        INNER JOIN 
            Customers ON Cart.CustomerID = Customers.CustomerID
        WHERE 
            Customers.CustomerID = ?
    `;

    pool.query(queryText, [orderID, customerID], (err, result) => {
        res.setHeader("Content-Type", "application/json");
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

module.exports = app;
