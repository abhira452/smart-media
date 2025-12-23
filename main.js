document.addEventListener("DOMContentLoaded", () => {

  let currentService = "";
  let currentPrice = 0;

  const landing = document.getElementById("landing");
  const selection = document.getElementById("selection");
  const success = document.getElementById("success");

  const serviceTitle = document.getElementById("service-title");
  const packagesDiv = document.getElementById("packages");
  const customQty = document.getElementById("custom-quantity");
  const priceDisplay = document.getElementById("price-display");
  const totalPriceDiv = document.getElementById("total-price");

  const calculateBtn = document.getElementById("calculate-btn");
  const payBtn = document.getElementById("pay-btn");
  const backBtn = document.getElementById("back-btn");
  const homeBtn = document.getElementById("home-btn");

  const prices = {
    followers: 0.30,
    likes: 0.20,
    views: 0.04
  };

  const packages = {
    followers: [
      { qty: 100, price: 30 },
      { qty: 200, price: 60 }
    ],
    likes: [
      { qty: 100, price: 20 },
      { qty: 200, price: 40 }
    ],
    views: [
      { qty: 1000, price: 40 },
      { qty: 5000, price: 200 }
    ]
  };

  // SERVICE CLICK
  document.querySelectorAll(".card").forEach(card => {
    card.onclick = () => {
      currentService = card.dataset.service;
      landing.classList.remove("active");
      selection.classList.add("active");
      serviceTitle.innerText = "Select " + currentService;
      showPackages();
    };
  });

  function showPackages() {
    packagesDiv.innerHTML = "";
    totalPriceDiv.classList.add("hidden");

    packages[currentService].forEach(p => {
      const div = document.createElement("div");
      div.className = "package";
      div.innerText = `${p.qty} ${currentService} - ₹${p.price}`;
      div.onclick = () => {
        currentPrice = p.price;
        priceDisplay.innerText = "₹" + currentPrice;
        totalPriceDiv.classList.remove("hidden");
      };
      packagesDiv.appendChild(div);
    });
  }

  // CUSTOM PRICE
  calculateBtn.onclick = () => {
  if (!currentService) {
    alert("Please select Followers / Likes / Views first");
    return;
  }

  const qty = Number(customQty.value);

  if (!qty || qty <= 0) {
    alert("Enter a valid quantity");
    return;
  }

  currentPrice = Math.round(qty * prices[currentService]);
  priceDisplay.innerText = "₹" + currentPrice;
  totalPriceDiv.classList.remove("hidden");
};

  // PAY
 payBtn.onclick = () => {
  if (!currentPrice || currentPrice <= 0) {
    alert("Please select a package or calculate price first");
    return;
  }

  // Proceed to next step (success page for now)
  selection.classList.remove("active");
  success.classList.add("active");
};


  // BACK
  backBtn.onclick = () => {
    selection.classList.remove("active");
    landing.classList.add("active");
  };

  homeBtn.onclick = () => {
    success.classList.remove("active");
    landing.classList.add("active");
  };

});

