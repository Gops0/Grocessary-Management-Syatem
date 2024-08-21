//Select Customers.CustomerName,CartItems.CartID,ProductName,Quantity from CartItems inner join Cart on Cart.CartID=CartItems.CartID inner join Products on Products.ProductID=CartItems.ProductID inner join Customers on CartItems.CartID=Cart.CartID and Cart.CustomerID= Customers.CustomerID where Customers.CustomerID= 1;


const mysql = require('mysql2');
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');

const app = express.Router();

// app.use(bodyParser.json());

const connectionDetails = {
    host: config.get("host"),
    database: config.get("database"),
    port: config.get("serverport"),
    user: config.get("user"),
    password: config.get("password")
};
// GET all cart items for a customer
app.get("/all/:id", (request, response) => {
    try {
        let CustomerID = request.params.id;

        let queryText = `Select CartItems.CartItemID, Customers.CustomerName, CartItems.CartID, ProductName, Products.ProductID,Products.UnitPrice,Quantity 
                         from CartItems 
                         inner join Cart on Cart.CartID=CartItems.CartID 
                         inner join Products on Products.ProductID=CartItems.ProductID 
                         inner join Customers on CartItems.CartID=Cart.CartID and Cart.CustomerID= Customers.CustomerID
                         where Customers.CustomerID = ${CustomerID};`;

        let connection = mysql.createConnection(connectionDetails);
        connection.query(queryText, (err, result) => {
            response.setHeader("content-Type", "application/json");
            if (err == null) {
                response.write(JSON.stringify(result));
            } else {
                response.write(JSON.stringify({ error: err }));
            }
            connection.end();
            response.end();
        });
    } catch (error) {
        response.status(500).json({ error: 'An error occurred while fetching the cart items.', details: error.message });
    }
});

// POST a new cart item
app.post("/add/:cid/:pid", (request, response) => {
    try {
        let cartId = request.params.cid;
        let productId = request.params.pid;
        let Quantity = request.body.Quantity;

        let queryText = `INSERT INTO CartItems(CartID, ProductID, Quantity) 
                         VALUES(${cartId}, ${productId}, ${Quantity})`;

        let connection = mysql.createConnection(connectionDetails);
        connection.query(queryText, (err, result) => {
            response.setHeader("content-Type", "application/json");
            if (err == null) {
                response.write(JSON.stringify(result));
            } else {
                response.write(JSON.stringify({ error: err }));
            }
            connection.end();
            response.end();
        });
    } catch (error) {
        response.status(500).json({ error: 'An error occurred while adding the cart item.', details: error.message });
    }
});

// DELETE all items of a single cart
app.delete("/delete/:id", (request, response) => {
    try {
        let CartID = request.params.id;

        let queryText = `DELETE FROM CartItems WHERE CartID=${CartID}`;

        let connection = mysql.createConnection(connectionDetails);
        connection.query(queryText, (err, result) => {
            response.setHeader("content-Type", "application/json");
            if (err == null) {
                response.write(JSON.stringify(result));
            } else {
                response.write(JSON.stringify({ error: err }));
            }
            connection.end();
            response.end();
        });
    } catch (error) {
        response.status(500).json({ error: 'An error occurred while deleting the cart item.', details: error.message });
    }
});

//delete single item from a cart
app.delete("/delete/single/:id", (request, response) => {
    try {
        let CartItemsID = request.params.id;

        let queryText = `DELETE FROM CartItems WHERE CartItemID=${CartItemsID}`;

        let connection = mysql.createConnection(connectionDetails);
        connection.query(queryText, (err, result) => {
            response.setHeader("content-Type", "application/json");
            if (err == null) {
                response.write(JSON.stringify(result));
            } else {
                response.write(JSON.stringify({ error: err }));
            }
            connection.end();
            response.end();
        });
    } catch (error) {
        response.status(500).json({ error: 'An error occurred while deleting the cart item.', details: error.message });
    }
});

module.exports = app;
