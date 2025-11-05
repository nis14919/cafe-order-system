// ✅ Café Order System Backend - File Save Version
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// 📁 File jisme orders save honge
const ordersFile = path.join(__dirname, "orders.json");

// 🧾 Step 1: File se orders load kar lo
let orders = [];
if (fs.existsSync(ordersFile)) {
  try {
    const data = fs.readFileSync(ordersFile, "utf8");
    orders = JSON.parse(data);
    console.log(`📂 Loaded ${orders.length} existing orders from file.`);
  } catch (err) {
    console.error("❌ Error reading orders.json:", err);
  }
}

let nextId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;

// 💾 Helper function: orders ko file me save karo
function saveOrders() {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// 🧾 New order receive karna
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

// 📋 All orders show karna
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// 🔁 Order status update karna (admin panel se)
app.put("/api/order/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = req.body.status || order.status;
  saveOrders();
  console.log("🔄 Updated Order:", order);
  res.json({ message: "Status updated" });
});

// 🏠 Homepage serve karna
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "order.html"));
});

// 🚀 Server start
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
