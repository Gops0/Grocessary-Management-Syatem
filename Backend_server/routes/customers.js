const mysql = require('mysql2');
const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express.Router();

const connectionDetails = {
    host: config.get("host"),
    database: config.get("database"),
    port: config.get("serverport"),
    user: config.get("user"),
    password: config.get("password")
};

app.post("/signin", (request, response) => {
    const { Email, Password } = request.body;
    let queryText = `SELECT * FROM Customers WHERE Email = '${Email}' AND Password = '${Password}'`;
    let connection = mysql.createConnection(connectionDetails);

    connection.query(queryText, (err, result) => {
        response.setHeader("content-Type", "application/json");
        if (err == null) {
            if (result.length == 0) {
                response.write("User does not exist");
            } else {
                const { Email } = result[0];
                const payload = { Email };
                const token = jwt.sign(payload, config.get("secretkeycustomer"));
                //const jwttoken = { jwttoken: token };
                const custID=result[0].CustomerID;
                const res = { jwttoken: token,custID:custID };

                response.write(JSON.stringify(res));
            }
        } else {
            response.write(JSON.stringify(err));
        }
        connection.end();
        response.end();
    });
});

app.post("/signup", (request, response) => {
    const { CustomerName, Email, Password, ContactName, Address, City, PostalCode, Country, Phone } = request.body;

    let queryText = `INSERT INTO Customers (CustomerName, Email, Password, ContactName, Address, City, PostalCode, Country, Phone) VALUES ('${CustomerName}', '${Email}', '${Password}', '${ContactName}', '${Address}', '${City}', '${PostalCode}', '${Country}', '${Phone}')`;

    console.log("Query Text: ", queryText);

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {
        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        } else {
            response.write(JSON.stringify(err));
        }
        connection.end();
        response.end();
    });
});

app.get("/getProducts", (request, response) => {
    const queryText = `
        SELECT Products.ProductID, ProductName, CategoryName, UnitPrice, Image FROM Products 
        INNER JOIN Categories ON Products.CategoryId = Categories.CategoryId inner join Inventory 
        on Products.ProductID=Inventory.ProductID where Inventory.ProductID is not null AND Inventory.quantity > 0 ;
    `;

    const connection = mysql.createConnection(connectionDetails);

    connection.connect(err => {
        if (err) {
            return response.status(500).json({ error: 'Database connection failed', details: err });
        }

        connection.query(queryText, (err, result) => {
            if (err) {
                return response.status(500).json({ error: 'Query failed', details: err });
            }

            const baseUrl = `${request.protocol}://${request.get('host')}/documents/`;
            const products = result.map(product => ({
                ...product,
                ImageUrl: baseUrl + product.Image
            }));

            response.status(200).json(products);
            connection.end();
        });
    });
});


app.get("/image/:productId", (request, response) => {
    const productId = request.params.productId;

    const queryText = `
        SELECT Image 
        FROM Products 
        WHERE ProductID = ?
    `;

    const connection = mysql.createConnection(connectionDetails);

    connection.connect(err => {
        if (err) {
            return response.status(500).json({ error: 'Database connection failed', details: err });
        }

        connection.query(queryText, [productId], (err, result) => {
            if (err) {
                return response.status(500).json({ error: 'Query failed', details: err });
            }

            if (result.length === 0 || !result[0].Image) {
                return response.status(404).json({ error: 'Image not found' });
            }

            const imagePath = path.join(__dirname, '../documents', result[0].Image);
            console.log(imagePath);

            if (fs.existsSync(imagePath)) {
                const imageStream = fs.createReadStream(imagePath);
                response.setHeader('Content-Type', 'image/jpeg');
                imageStream.pipe(response);
            } else {
                response.status(404).json({ error: 'Image file not found' });
            }

            connection.end();
        });
    });
});

//update inventory  when order is placed

app.put("/product/:id", (request, response) => {
    let ProductID = request.params.id;
    //let { ProductID, Quantity, LastUpdated } = request.body;

    let queryText = `UPDATE Inventory SET  Quantity = Quantity - 1 
     WHERE ProductID = ${ProductID};`;

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


// Serve static files from the 'documents' directory
app.use('/documents', express.static(path.join(__dirname, 'documents')));

module.exports = app;