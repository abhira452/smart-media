document.addEventListener("DOMContentLoaded", function () {

  alert("JS CONNECTED");

  const landing = document.getElementById("landing");
  const selection = document.getElementById("selection");
  const success = document.getElementById("success");

  const serviceTitle = document.getElementById("service-title");
  const packagesDiv = document.getElementById("packages");
  const customQuantity = document.getElementById("custom-quantity");
  const calculateBtn = document.getElementById("calculate-btn");
  const totalPriceDiv = document.getElementById("total-price");
  const priceDisplay = document.getElementById("price-display");
  const payBtn = document.getElementById("pay-btn");
  const backBtn = document.getElementById("back-btn");
  const homeBtn = document.getElementById("home-btn");

  let currentService = "";

  const prices = {
    followers: 0.30,
    likes: 0.20,
    views: 0.04
  };

  const packageData = {
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

  // CARD CLICK
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function () {
      currentService = this.dataset.service;
      showSelectionPage();
    });
  });

  backBtn.addEventListener("click", showLandingPage);
  homeBtn.addEventListener("click", showLandingPage);
  calculateBtn.addEventListener("click", calculateCustomPrice);
  payBtn.addEventListener("click", function () {
  if (priceDisplay.innerText === "₹0") {
    alert("Please select a package or quantity first");
    return;
  }
  showSuccessPage();
});


  function showLandingPage() {
    landing.classList.add("active");
    selection.classList.remove("active");
    success.classList.remove("active");
  }

  function showSelectionPage() {
    landing.classList.remove("active");
    selection.classList.add("active");
    success.classList.remove("active");

    serviceTitle.innerText = "Select " + currentService;
    renderPackages();
  }

  function showSuccessPage() {
    landing.classList.remove("active");
    selection.classList.remove("active");
    success.classList.add("active");
  }

  function renderPackages() {
    packagesDiv.innerHTML = "";
    packageData[currentService].forEach(pkg => {
      const div = document.createElement("div");
      div.className = "package";
      div.innerHTML = `<span>${pkg.qty} ${currentService}</span><span>₹${pkg.price}</span>`;
      div.addEventListener("click", function () {
  priceDisplay.innerText = "₹" + pkg.price;
  totalPriceDiv.classList.remove("hidden");
});

      packagesDiv.appendChild(div);
    });
  }

  function calculateCustomPrice() {
  if (currentService === "") {
    alert("Please select Followers, Likes, or Views first");
    return;
  }

  const qty = Number(customQuantity.value);

  if (!qty || qty <= 0) {
    alert("Please enter a valid quantity");
    return;
  }

  const price = Math.round(qty * prices[currentService]);

  priceDisplay.innerText = "₹" + price;
  totalPriceDiv.classList.remove("hidden");
}


});


