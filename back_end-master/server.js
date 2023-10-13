const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package


const app = express();
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123123', // Change to your database password
  database: 'ecommerce', // Change to your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your front-end's origin
}));

app.get('/products', (req, res) => {
  // Query your MySQL database to retrieve product data here
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

// Get cart items for a specific shopping cart
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

// Add a new item to a shopping cart
app.post('/Cart_Items/:cart_id', (req, res) => {
  const cartId = req.params.cart_id;
  const { product_id, quantity } = req.body;

  // You can include additional logic here, such as checking product availability and updating cart total.
  // For simplicity, this example just inserts a new cart item.
  pool.query('INSERT INTO Cart_Items (Cart_ID, Product_ID, Quantity) VALUES (?, ?, ?)', [cartId, product_id, quantity], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding item to cart');
    } else {
      res.status(201).send('Item added to cart successfully');
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
