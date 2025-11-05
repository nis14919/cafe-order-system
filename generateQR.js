const QRCode = require("qrcode");
const fs = require("fs");

// 👇 Replace this with your real domain (jab deploy karoge)
const BASE_URL = "http://localhost:3000/order.html?table=";

// Number of tables in your café
const totalTables = 10; // <- yahan total tables ka number likho

for (let i = 1; i <= totalTables; i++) {
  const tableUrl = `${BASE_URL}${i}`;
  const fileName = `table_${i}.png`;

  QRCode.toFile(fileName, tableUrl, {
    color: {
      dark: "#000000",
      light: "#ffffff"
    },
    width: 300
  }, (err) => {
    if (err) throw err;
    console.log(`✅ QR generated for Table ${i}: ${fileName}`);
  });
}
