const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const config = require('config');

const PORT = config.get("port");
const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const adminsRoutesApp = require('./routes/admins');
const categoriesRoutesApp = require('./routes/categories');
const productsRoutesApp = require('./routes/products');
const inventoryRoutesApp = require('./routes/inventory');
const cartRoutesApp = require('./routes/cart');
const cartItemsRoutesApp = require('./routes/cartitems');
const customersRoutesApp = require('./routes/customers');
const orderRoutesApp = require('./routes/orders');
const orderDetailsRoutesApp = require('./routes/orderdetails')


// Middleware for admin authentication
app.use((request, response, next) => {
    if (request.url.includes('/admin')) {
        if (request.url.startsWith('/admin/signup') || request.url.startsWith('/admin/signin')||request.url.startsWith('/admin/products/image')) {
            next();
        } else {
            const token = request.headers['token'];
            if (!token || token.length == 0) {
                return response.status(401).send("Token not found, please log in");
            }
            try {
                const payload = jwt.verify(token, config.get('secretkey'));
                next();
            } catch (ex) {
                return response.status(401).send("Invalid token");
            }
        }
    } else if (request.url.includes('/customer')) 
        {
        if (request.url.startsWith('/customer/signup') || request.url.startsWith('/customer/signin')||request.url.startsWith('/customer/image')) {
            app.use("/customer", customersRoutesApp);
            next();
        } else {
            const token = request.headers['token'];
            if (!token || token.length == 0) {
                return response.status(401).send("Token not found, please log in");
            }
            try {
                const payload = jwt.verify(token, config.get('secretkeycustomer'));
                app.use("/customer/reduce",customersRoutesApp)
                app.use("/customer/getProducts", customersRoutesApp);
                app.use("/customer/cart", cartRoutesApp);
                app.use("/customer/cartitems", cartItemsRoutesApp);
                app.use("/customer/orders", orderRoutesApp);
                app.use("/customer/orderdetails", orderDetailsRoutesApp);
                app.use("/customer/most-sold", orderDetailsRoutesApp);


                



                next();
            } catch (ex) {
                return response.status(401).send("Invalid token");
            }
        }
    }
});

app.use("/admin", adminsRoutesApp);
app.use("/admin/categories", categoriesRoutesApp);
app.use("/admin/products", productsRoutesApp);
app.use("/admin/inventory", inventoryRoutesApp);



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});