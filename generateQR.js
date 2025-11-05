// ✅ QR Code Generator for Café Tables
// Author: Harshil Cafe System

const QRCode = require("qrcode"); // ensure installed via: npm install qrcode

// 🪑 Total tables in your café
const totalTables = 20;

// 🌐 Your live website URL (no trailing slash)
const baseURL = "https://cafe-oreder-system.onrender.com";

console.log("🚀 Generating QR codes...");

(async () => {
  for (let table = 1; table <= totalTables; table++) {
    const url = `${baseURL}/order.html?table=${table}`;
    const fileName = `qr_table_${table}.png`;

    try {
      await QRCode.toFile(fileName, url, {
        color: {
          dark: "#000000",  // QR color
          light: "#ffffff", // background color
        },
        width: 400,
        margin: 3,
      });
      console.log(`✅ QR code generated for Table ${table} (${url})`);
    } catch (err) {
      console.error(`❌ Error generating QR for Table ${table}:`, err);
    }
  }

  console.log("\n🎉 All QR codes created successfully!");
  console.log("📁 Check your project folder for 'qr_table_1.png', 'qr_table_2.png', etc.");
})();
