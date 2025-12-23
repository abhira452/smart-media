document.addEventListener("DOMContentLoaded", function () {

  alert("JS CONNECTED");

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

  const prices = {
    followers: 0.30,
    likes: 0.20,
    views: 0.04
  };

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
      serviceTitle.innerText = "Select " + currentService;
      renderPackages();
    });
  });

  // BACK
  backBtn.onclick = () => {
    selection.classList.remove("active");
    landing.classList.add("active");
  };

  // HOME
  homeBtn.onclick = () => {
    success.classList.remove("active");
    landing.classList.add("active");
  };

  // RENDER PACKAGES
  function renderPackages() {
    packagesDiv.innerHTML = "";
    totalPriceDiv.classList.add("hidden");
    customQty.value = "";

    packages[currentService].forEach(item => {
      const div = document.createElement("div");
      div.className = "package";
      div.innerText = `${item.qty} ${currentService} - ₹${item.price}`;
      div.onclick = () => {
        currentPrice = item.price;
        priceDisplay.innerText = "₹" + currentPrice;
        totalPriceDiv.classList.remove("hidden");
      };
      packagesDiv.appendChild(div);
    });
  }

  // CALCULATE CUSTOM PRICE
  calculateBtn.onclick = () => {
    if (!currentService) {
      alert("Select a service first");
      return;
    }

    const qty = Number(customQty.value);
    if (!qty || qty <= 0) {
      alert("Enter valid quantity");
      return;
    }

    currentPrice = Math.round(qty * prices[currentService]);
    priceDisplay.innerText = "₹" + currentPrice;
    totalPriceDiv.classList.remove("hidden");
  };

  // PAY NOW
  payBtn.onclick = () => {
    if (currentPrice <= 0) {
      alert("Please select a package or quantity");
      return;
    }

    selection.classList.remove("active");
    success.classList.add("active");
  };

});
