const mysql = require('mysql2');
const express = require('express');
const config = require('config');
const multer = require('multer');
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

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './documents/'); // Destination folder
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // File name
    }
});

// Multer upload instance
const upload = multer({ storage });

// Route to get products
app.get("/getProducts", (request, response) => {
    const queryText = `
        SELECT ProductID, ProductName, CategoryName, UnitPrice, Image 
        FROM Products 
        INNER JOIN Categories ON Products.CategoryId = Categories.CategoryId
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

// Route to handle file upload and database insertion
app.post("/add", upload.single('image'), (request, response) => {
    const { ProductName, CategoryID, UnitPrice, UnitsOnOrder } = request.body;
    const AdminID=1;
    const Image = request.file.filename; // Only the filename

    const queryText = `INSERT INTO Products (ProductName, AdminID, CategoryID, UnitPrice, UnitsOnOrder, Image) 
                       VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [ProductName, AdminID, CategoryID, UnitPrice, UnitsOnOrder, Image];

    const connection = mysql.createConnection(connectionDetails);

    connection.connect(err => {
        if (err) {
            return response.status(500).json({ error: 'Database connection failed', details: err });
        }

        connection.query(queryText, values, (err, result) => {
            if (err) {
                return response.status(500).json({ error: 'Query failed', details: err });
            }
            response.status(200).json(result);
            connection.end();
        });
    });
});





// new code for get image


// Route to retrieve image by ProductID
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

// Serve static files from the 'documents' directory
app.use('/documents', express.static(path.join(__dirname, 'documents')));

module.exports = app;
