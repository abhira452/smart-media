document.addEventListener("DOMContentLoaded", function () {

  alert("JS CONNECTED");

  const landing = document.getElementById('landing');
  const selection = document.getElementById('selection');
  const success = document.getElementById('success');
  const serviceTitle = document.getElementById('service-title');
  const packagesDiv = document.getElementById('packages');
  const customQuantity = document.getElementById('custom-quantity');
  const calculateBtn = document.getElementById('calculate-btn');
  const totalPriceDiv = document.getElementById('total-price');
  const priceDisplay = document.getElementById('price-display');
  const payBtn = document.getElementById('pay-btn');
  const backBtn = document.getElementById('back-btn');
  const homeBtn = document.getElementById('home-btn');

  const prices = {
    followers: 0.30,
    likes: 0.20,
    views: 0.04
  };

  let currentService = '';
  let selectedQuantity = 0;

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

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function () {
      currentService = this.dataset.service;
      showSelectionPage();
    });
  });

  backBtn.addEventListener('click', showLandingPage);
  calculateBtn.addEventListener('click', calculateCustomPrice);
  payBtn.addEventListener('click', initiatePayment);
  homeBtn.addEventListener('click', showLandingPage);

  function showLandingPage() {
    landing.style.display = "block";
    selection.style.display = "none";
    success.style.display = "none";
  }

  function showSelectionPage() {
    landing.style.display = "none";
    selection.style.display = "block";
    serviceTitle.innerText = "Select " + currentService;
    renderPackages();
  }

  function renderPackages() {
    packagesDiv.innerHTML = "";
    packageData[currentService].forEach(pkg => {
      const div = document.createElement("div");
      div.className = "package";
      div.innerText = `${pkg.qty} ${currentService} - ₹${pkg.price}`;
      div.addEventListener("click", function () {
        selectedQuantity = pkg.qty;
        priceDisplay.innerText = "₹" + pkg.price;
        totalPriceDiv.style.display = "block";
      });
      packagesDiv.appendChild(div);
    });
  }

  function calculateCustomPrice() {
    const qty = parseInt(customQuantity.value);
    if (!qty || qty <= 0) {
      alert("Enter valid quantity");
      return;
    }
    const price = Math.round(qty * prices[currentService]);
    selectedQuantity = qty;
    priceDisplay.innerText = "₹" + price;
    totalPriceDiv.style.display = "block";
  }

  function initiatePayment() {
    alert("Payment page (demo)");
    success.style.display = "block";
    selection.style.display = "none";
  }

});
