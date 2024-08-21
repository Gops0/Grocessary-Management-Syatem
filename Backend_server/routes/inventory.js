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

// GET all inventory items
app.get("/get", (request, response) => {
    let queryText = `select InventoryID, ProductName, Quantity from Inventory inner join Products on Inventory.ProductID = Products.ProductID`;
    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {
        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        } else {
            response.write(JSON.stringify({error: err}));
        }
        connection.end();
        response.end();
    });
});

// POST a new inventory item
// app.post("/add", (request, response) => {
//     let { ProductID, Quantity } = request.body;

//     let queryText = `INSERT INTO Inventory(ProductID, Quantity, LastUpdated) 
//                      VALUES(${ProductID}, ${Quantity}, now());`;

//     let connection = mysql.createConnection(connectionDetails);
//     connection.query(queryText, (err, result) => {
//         response.setHeader("content-Type", "application/json");
//         if (err == null) {
//             response.write(JSON.stringify(result));
//         } else {
//             response.write(JSON.stringify({error: err}));
//         }
//         connection.end();
//         response.end();
//     });
// });

// POST a new inventory item
app.post("/add", (request, response) => {
    let { ProductID, Quantity } = request.body;

    let queryText = `INSERT INTO Inventory(ProductID, Quantity, LastUpdated) 
                     VALUES(?, ?, now());`;

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, [ProductID, Quantity], (err, result) => {
        response.setHeader("Content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        } else {
            response.write(JSON.stringify({ error: err }));
        }
        connection.end();
        response.end();
    });
});

// PUT to update an existing inventory item
app.put("/:id", (request, response) => {
    let InventoryID = request.params.id;
    let { ProductID, Quantity, LastUpdated } = request.body;

    let queryText = `UPDATE Inventory SET ProductID = ${ProductID}, Quantity = ${Quantity}, 
                     LastUpdated = '${LastUpdated}' WHERE InventoryID = ${InventoryID};`;

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {
        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        } else {
            response.write(JSON.stringify({error: err}));
        }
        connection.end();
        response.end();
    });
});

// DELETE an inventory item
app.delete("/:id", (request, response) => {
    let InventoryID = request.params.id;

    let queryText = `DELETE FROM Inventory WHERE InventoryID = ${InventoryID};`;

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {
        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        } else {
            response.write(JSON.stringify({error: err}));
        }
        connection.end();
        response.end();
    });
});



module.exports = app;
