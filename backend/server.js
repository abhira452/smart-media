const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Razorpay instance (keys will come from Render ENV)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Create Razorpay Order
app.post("/create-order", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount, // amount in paise
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

// Verify Razorpay Payment
app.post("/verify-payment", (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  const body = order_id + "|" + payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

// Start server (Render compatible)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
