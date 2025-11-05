// ✅ Café Order System Backend - by Harshil
const express = require("express");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // serve HTML, CSS, JS files

// Dummy order data (memory based)
let orders = [];
let nextId = 1;

// 🧾 Place new order
app.post("/api/order", (req, res) => {
  const newOrder = {
    id: nextId++,
    table: req.body.table,
    items: req.body.items,
    status: "new",
    time: new Date().toLocaleTimeString(),
  };
  orders.push(newOrder);
  console.log("🆕 New Order:", newOrder);
  res.json({ message: "Order placed successfully!" });
});

// 📋 Get all orders (for admin)
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// 🔁 Update order status
app.put("/api/order/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  order.status = req.body.status || order.status;
  console.log("🔄 Updated Order:", order);
  res.json({ message: "Status updated" });
});

// 🧹 Optional: clear all orders (for testing)
app.delete("/api/orders", (req, res) => {
  orders = [];
  nextId = 1;
  console.log("🗑️ All orders cleared");
  res.json({ message: "All orders deleted" });
});

// 🏠 Default route (homepage)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "order.html"));
});

// ✅ Server listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
