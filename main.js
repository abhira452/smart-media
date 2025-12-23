document.addEventListener("DOMContentLoaded", function () {

  const landing = document.getElementById("landing");
  const selection = document.getElementById("selection");
  const success = document.getElementById("success");

  const serviceTitle = document.getElementById("service-title");
  const packagesDiv = document.getElementById("packages");
  const customQty = document.getElementById("custom-quantity");
  const calculateBtn = document.getElementById("calculate-btn");
  const totalPriceDiv = document.getElementById("total-price");
  const priceDisplay = document.getElementById("price-display");
  const payBtn = document.getElementById("pay-btn");
  const backBtn = document.getElementById("back-btn");
  const homeBtn = document.getElementById("home-btn");

  let currentService = "";
  let currentPrice = 0;

  // price rules
  const priceRate = {
    followers: 0.30, // ₹ per follower
    likes: 0.20,     // ₹ per like
    views: 0.04      // ₹ per view
  };

  // fixed packages
  const packages = {
    followers: [
      { qty: 100, price: 30 },
      { qty: 200, price: 60 },
      { qty: 500, price: 150 },
      { qty: 1000, price: 300 }
    ],
    likes: [
      { qty: 100, price: 20 },
      { qty: 200, price: 40 },
      { qty: 500, price: 100 },
      { qty: 1000, price: 200 }
    ],
    views: [
      { qty: 1000, price: 40 },
      { qty: 5000, price: 200 },
      { qty: 10000, price: 400 }
    ]
  };

  // SERVICE CLICK
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function () {
      currentService = this.dataset.service;
      landing.classList.remove("active");
      selection.classList.add("active");
      servi
