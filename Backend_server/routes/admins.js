const mysql = require('mysql2');
const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');


const app = express.Router();

const connectionDetails = {
    host: config.get("host"),
    database: config.get("database"),
    port: config.get("serverport"),
    user: config.get("user"),
    password: config.get("password")
};

app.get("/allorders", (request, response) => {

 
     let queryText = `Select Customers.CustomerName, OrderDetails.OrderID,Products.ProductName,OrderDetails.Quantity from OrderDetails inner join Products on Products.ProductID=OrderDetails.ProductID inner join Orders on Orders.OrderID=OrderDetails.OrderID inner join Customers;
 `;
 
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

app.post("/signin", (request, response) => {

    const {Email , Password} = request.body;
    let queryText = `select * from Admins where Email = '${Email}' and Password = '${Password}'`;
    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, async(err, result) => {

       await response.setHeader("content-Type", "application/json");
        if (err == null) {
            //response.write(JSON.stringify(result));
            if(result.length == 0) {
                response.write("User does not exist");
            }
            else{
                //response.write(JSON.stringify(result));
                const {Email}=result[0].Email;

              const payload = {Email};
              
              const token = jwt.sign(payload, config.get("secretkey"));
              const jwttoken = {jwttoken:token}
              response.write(JSON.stringify(jwttoken));
            }

        }

        else {
            response.write(JSON.stringify(err));
        }
        connection.end();
        response.end();
    })

});



app.post("/signup", (request, response)=>
    {
    let AdminName = request.body.AdminName
    let Email = request.body.Email;
    let Password = request.body.Password;
    let Mobile = request.body.Mobile;


    let queryText = `insert into Admins(AdminName,Email, Password, Mobile) 
    values('${AdminName}', '${Email}', '${Password}', '${Mobile}');`;

    console.log(queryText);

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {

        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        }

        else {
            response.write(err);
        }
        connection.end();
        response.end();
    })

})

module.exports = app;