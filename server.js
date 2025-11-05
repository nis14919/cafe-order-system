// ✅ Harshil Café - Final Backend (File Save + API + Static Frontend)
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const ordersFile = path.join(__dirname, "orders.json");

let orders = [];
if (fs.existsSync(ordersFile)) {
  try {
    orders = JSON.parse(fs.readFileSync(ordersFile, "utf8"));
    console.log(`📂 Loaded ${orders.length} existing orders`);
  } catch (err) {
    console.error("❌ Error reading orders.json:", err);
  }
}

let nextId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;

function saveOrders() {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

app.post("/api/order", (req, res) => {
  const newOrder = {
    id: nextId++,
    table: req.body.table,
    items: req.body.items,
    status: "new",
    time: new Date().toLocaleTimeString(),
  };
  orders.push(newOrder);
  saveOrders();
  console.log("🆕 New Order:", newOrder);
  res.json({ message: "Order placed successfully!" });
});

app.get("/api/orders", (req, res) => res.json(orders));

app.put("/api/order/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = req.body.status || order.status;
  saveOrders();
  console.log("🔄 Updated Order:", order);
  res.json({ message: "Status updated" });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "order.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "admin.html")));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
