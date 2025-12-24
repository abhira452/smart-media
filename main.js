document.addEventListener("DOMContentLoaded", () => {

  // ===== VARIABLES =====
  let currentService = "";
  let currentPrice = 0;

  // ===== ELEMENTS =====
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

  // 🔹 ORDER DETAILS INPUTS
  const usernameInput = document.getElementById("username");
  const profileLinkInput = document.getElementById("profileLink");
  const customerWhatsappInput = document.getElementById("customerWhatsapp");

  // ===== PRICING RULES =====
  const rates = {
    followers: 0.30,
    likes: 0.20,
    views: 0.04
  };

  const packages = {
    followers: [
      { qty: 100, price: 30 },
      { qty: 200, price: 60 },
      { qty: 500, price: 150 }
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

  // ===== SERVICE CLICK =====
  document.querySelectorAll(".card").forEach(card => {
    card.onclick = () => {
      currentService = card.dataset.service;
      landing.classList.remove("active");
      selection.classList.add("active");
      serviceTitle.innerText = "Select " + currentService;
      showPackages();
    };
  });

  // ===== SHOW PACKAGES =====
  function showPackages() {
    packagesDiv.innerHTML = "";
    totalPriceDiv.classList.add("hidden");
    customQty.value = "";

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

  // ===== CUSTOM PRICE CALCULATION =====
  calculateBtn.onclick = () => {
    if (!currentService) {
      alert("Please select a service first");
      return;
    }

    const qty = Number(customQty.value);
    if (!qty || qty <= 0) {
      alert("Enter valid quantity");
      return;
    }

    currentPrice = Math.round(qty * rates[currentService]);
    priceDisplay.innerText = "₹" + currentPrice;
    totalPriceDiv.classList.remove("hidden");
  };

  // ===== RAZORPAY PAYMENT + WHATSAPP =====
  payBtn.onclick = () => {

    if (!currentPrice || currentPrice <= 0) {
      alert("Please select a package or calculate price");
      return;
    }

    // 🔹 VALIDATE ORDER DETAILS
    const username = usernameInput.value.trim();
    const profileLink = profileLinkInput.value.trim();
    const customerWhatsapp = customerWhatsappInput.value.trim();

    if (!username || !profileLink || !customerWhatsapp) {
      alert("Please fill all order details");
      return;
    }

    var options = {
      key: "rzp_test_Rv7XMdWzLnkhx3", // 🔴 PUT YOUR RAZORPAY TEST KEY
      amount: currentPrice * 100,
      currency: "INR",
      name: "Social Media Boost",
      description: currentService + " order",

      handler: function () {

        // ✅ SHOW SUCCESS PAGE
        selection.classList.remove("active");
        success.classList.add("active");

        // ✅ WHATSAPP MESSAGE TO ADMIN
        const adminNumber = "918433316066"; // 🔴 YOUR WHATSAPP NUMBER

        const message = `
New Order Received 🚀

Service: ${currentService}
Amount: ₹${currentPrice}
Username: ${username}
Link: ${profileLink}
Customer WhatsApp: ${customerWhatsapp}
`;

        const whatsappURL =
          "https://wa.me/" +
          adminNumber +
          "?text=" +
          encodeURIComponent(message);

        window.open(whatsappURL, "_blank");
      },

      modal: {
        ondismiss: function () {
          alert("Payment cancelled");
        }
      }
    };

    var rzp = new Razorpay(options);

    rzp.on("payment.failed", function () {
      alert("Payment Failed. Please try again.");
    });

    rzp.open();
  };

  // ===== NAVIGATION =====
  backBtn.onclick = () => {
    selection.classList.remove("active");
    landing.classList.add("active");
  };

  homeBtn.onclick = () => {
    success.classList.remove("active");
    landing.classList.add("active");
  };

});
