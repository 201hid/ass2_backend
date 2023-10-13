const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Toyotaecho3+', // Change to your database password
  database: 'ecommerce', // Change to your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/products', (req, res) => {
  pool.query('SELECT * FROM Product_Catalog', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving products');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
    }
  });
});

app.get('/product/:productName', (req, res) => {
  const productName = req.params.productName;
  pool.query('SELECT * FROM Product_Catalog WHERE Product_Name = ?', [productName], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving product details');
    } else {
      if (results.length === 0) {
        res.status(404).send('Product not found');
      } else {
        const product = results[0];
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
      }
    }
  });
});

// Create a new shopping cart
app.post('/Shopping_Cart', (req, res) => {
  // You can include additional logic here, such as setting cart details.
  // For simplicity, this example just inserts a new cart.
  pool.query('INSERT INTO Shopping_Cart (Cart_DateTime, Status, Total) VALUES (NOW(), ?, ?)', ['active', 0], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating shopping cart');
    } else {
      res.status(201).send('Shopping cart created successfully');
    }
  });
});

app.get('/Cart_Items/:cart_id', (req, res) => {
  const cartId = req.params.cart_id;
  pool.query('SELECT * FROM Cart_Items WHERE Cart_ID = ?', [cartId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving cart items');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
