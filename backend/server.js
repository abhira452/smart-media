const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Razorpay instance (TEST MODE)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// CREATE ORDER (FINAL FIX)
app.post("/create-order", async (req, res) => {
  try {
    let amount = Number(req.body.amount);

    // 🔴 HARD VALIDATION
    if (!amount || isNaN(amount) || amount < 100) {
      return res.status(400).json({
        error: "Invalid amount received",
        received: req.body.amount
      });
    }

    const order = await razorpay.orders.create({
      amount: amount, // MUST be in paise
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    res.json(order);

  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// VERIFY PAYMENT
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

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
