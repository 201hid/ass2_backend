const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors'); // Import the cors package

// Create an Express.js app
const app = express();

// Configure the view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use bodyParser middleware to parse JSON data
app.use(bodyParser.json());

// Enable CORS for your frontend origin
app.use(cors({
  origin: 'http://localhost:3000', // Update this with your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Create a connection pool to your MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Toyotaecho3+', // Change to your database password
  database: 'ecommerce', // Change to your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Define a route to retrieve products
app.get('/products', (req, res) => {
  // Example: Query all products from the Product_Catalog table
  pool.query('SELECT * FROM Product_Catalog', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving products');
    } else {
      res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
      res.json(results); // Send the JSON response
    }
  });
});


// Start the server on port 8080 (you can change the port if needed)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
