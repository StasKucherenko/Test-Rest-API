const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const parseJson = require('./users.json');
const registerJson = require('./register.json');

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});



db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ZvfqrF1234567',
    database: 'api'
});

db.connect( (err) => {
    if (err) {
      return console.error('Ошибка: ' + err.message);
    }
    else{
      console.log('Server MySQL connect...');
    }
 });


app.get('/api/login', urlencodedParser, (req, res) => {
    res.send(parseJson);
    // res.sendFile(path.resolve(__dirname, 'users.json'));
});


app.get('/list/login', urlencodedParser, (req, res) => {
    let sql = `SELECT * FROM login_users`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;

        res.json({
            status: 200,
            data,
            message: 'User lists retrieved successfully'
        });
    });
}) 

    
app.post('/api/login', urlencodedParser, (req, res) => {
    var token = require('crypto').randomBytes(20).toString('hex');
    let sql = `INSERT INTO login_users(email, password, token) VALUES (?)`;
    const values = [
        email = parseJson.email,
        password = parseJson.password,
        token
    ];
    if (!parseJson.email || !parseJson.password) {
        res.json({
            status: 422,
            field: 'password',
            message: 'Wrong email or password'
        });
    } else {
        db.query(sql, [values], (err, data, fields) => {
            res.json({
                status: 200,
                token: token
            });
        });
    }
});


app.get('/api/register', urlencodedParser, (req, res) => {
    res.send(registerJson);
}); 


app.post('/api/register', urlencodedParser, (req, res) => {
    db.query('SELECT token FROM login_users', (err, result, fields) => { 
        if (err) throw err;
        let sqlRegister = `INSERT INTO register_users(phone, name, email, token) VALUES (?)`;
        var registerValue = [
            phone = registerJson.phone,
            name = registerJson.name,
            email = registerJson.email,
            token = result 
        ]
        if (parseJson.email != registerJson.email && parseJson.password != registerJson.password) {
            res.json({
                status: 422,
                field: 'current_password',
                message: 'Wrong current password'
            });
        } else {
            db.query(sqlRegister, [registerValue], (err, data) => {
                res.json(token);
            });
        };     
    });
});


app.get('/list/register', urlencodedParser, (req, res) => {
    let sql = `SELECT * FROM register_users`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;

        res.json({
            status: 200,
            data,
            message: 'User lists retrieved successfully'
        });
    });
}) 








app.listen(3000, () => {
    console.log('Server has been started...')
})