const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(".")); // serve frontend files (HTML)

const FILE = "./orders.json";

// Read existing orders
function readOrders() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8") || "[]");
}

// Save updated orders
function saveOrders(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// Add new order
app.post("/api/order", (req, res) => {
  const order = req.body;
  const orders = readOrders();
  order.id = Date.now();
  order.status = "new";
  orders.push(order);
  saveOrders(orders);
  res.json({ success: true, message: "Order placed!" });
});

// Get all orders
app.get("/api/orders", (req, res) => {
  const orders = readOrders();
  res.json(orders.reverse());
});

// Update order status
app.put("/api/order/:id", (req, res) => {
  const orders = readOrders();
  const order = orders.find((o) => o.id == req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  order.status = req.body.status || order.status;
  saveOrders(orders);
  res.json({ success: true, message: "Status updated" });
});

// Start the server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
