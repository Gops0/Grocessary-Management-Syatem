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


app.get("/", (request, response) => {

    let queryText = `select * from Categories`;
    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {

        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        }

        else {
            response.write(JSON.stringify(result));
        }
        connection.end();
        response.end();
    })

});



app.post("/add", (request, response) => {
    let CategoryName = request.body.CategoryName;
    let Description = request.body.Description;

    let queryText = `insert into Categories(CategoryName,Description) 
    values('${CategoryName}', '${Description}');`;

    console.log(queryText);

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {

        response.setHeader("Content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        }

        else {
            response.write(JSON.stringify(result));
        }
        connection.end();
        response.end();
    })

})


app.delete("delete/:id", (request, response) => {
    let CategoryID = request.params.id;

    let queryText = `DELETE FROM Category WHERE CategoryID = ${CategoryID};`;

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