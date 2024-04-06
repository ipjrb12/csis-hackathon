const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'your_database_host',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'your_database_name'
});

app.get('/getLastName/:firstName', (req, res) => {
    pool.query('SELECT lastName FROM people WHERE firstName = ?', [req.params.firstName], (error, results) => {
        if (error) throw error;
        res.send(results.length > 0 ? results[0].lastName : 'Not found');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
