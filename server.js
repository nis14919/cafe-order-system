const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// File path for orders data
const ordersFilePath = path.join(__dirname, 'orders.json');

// Helper function to read orders from orders.json
function getOrders() {
  return new Promise((resolve, reject) => {
    fs.readFile(ordersFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// API to get all orders
app.get('/orders.json', async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).send('Error reading orders data');
  }
});

// API to update the status of an order
app.put('/api/order/:id', async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  try {
    const orders = await getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).send('Order not found');
    }

    // Update the order status to 'completed'
    orders[orderIndex].status = 'completed';
    fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), err => {
      if (err) {
        res.status(500).send('Error saving orders');
      } else {
        res.status(200).send('Order status updated');
      }
    });
  } catch (err) {
    res.status(500).send('Error updating order status');
  }
});

// API to clear all orders (optional)
app.delete('/clear-orders', async (req, res) => {
  try {
    fs.writeFile(ordersFilePath, JSON.stringify([], null, 2), err => {
      if (err) {
        res.status(500).send('Error clearing orders');
      } else {
        res.status(200).send('All orders cleared');
      }
    });
  } catch (err) {
    res.status(500).send('Error clearing orders');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
