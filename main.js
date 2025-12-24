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

  // User inputs (must exist in HTML)
  const usernameInput = document.getElementById("username");
  const customerWhatsappInput = document.getElementById("customerWhatsapp");

  // WhatsApp links on success page
  const userWhatsappLink = document.getElementById("userWhatsappLink");
  const adminWhatsappLink = document.getElementById("adminWhatsappLink");

  const rates = {
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
      { qty: 100, price: 20 }
    ],
    views: [
      { qty: 1000, price: 40 }
    ]
  };

  // Service selection
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

  calculateBtn.onclick = () => {
    const qty = Number(customQty.value);
    if (!qty || qty <= 0) {
      alert("Enter valid quantity");
      return;
    }
    currentPrice = Math.round(qty * rates[currentService]);
    priceDisplay.innerText = "₹" + currentPrice;
    totalPriceDiv.classList.remove("hidden");
  };

  // PAYMENT
  payBtn.onclick = () => {

    const username = usernameInput.value.trim();
    const customerWhatsapp = customerWhatsappInput.value.trim();

    if (!username || !customerWhatsapp) {
      alert("Please fill username and WhatsApp number");
      return;
    }

    // 🔹 ORDER ID
    const orderId =
      "ORD-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);

    const options = {
      key: "rzp_test_Rv7XMdWzLnkhx3", // 🔴 YOUR RAZORPAY TEST KEY
      amount: currentPrice * 100,
      currency: "INR",
      name: "Social Media Boost",

      handler: function () {

        // Show success page
        selection.classList.remove("active");
        success.classList.add("active");

        // Show order ID
        document.getElementById("orderIdText").innerText = orderId;

        // ===== SAVE ORDER (LOCAL STORAGE) =====
        const orderData = {
          orderId,
          service: currentService,
          amount: currentPrice,
          username,
          whatsapp: customerWhatsapp,
          status: "Processing",
          date: new Date().toISOString()
        };

        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(orderData);
        localStorage.setItem("orders", JSON.stringify(orders));

        // ===== WHATSAPP TO USER =====
        const userMessage = `
Hi ${username} 👋

✅ Payment Successful
🆔 Order ID: ${orderId}
📦 Service: ${currentService}
💰 Amount: ₹${currentPrice}

Status: Processing
Delivery within 24 hours
`;

        userWhatsappLink.href =
          "https://wa.me/" +
          customerWhatsapp +
          "?text=" +
          encodeURIComponent(userMessage);

        // ===== WHATSAPP TO ADMIN =====
        const adminNumber = "918433316066"; // 🔴 YOUR NUMBER

        const adminMessage = `
New Order 🚀

Order ID: ${orderId}
Service: ${currentService}
Amount: ₹${currentPrice}
Username: ${username}
Customer WhatsApp: ${customerWhatsapp}
`;

        adminWhatsappLink.href =
          "https://wa.me/" +
          adminNumber +
          "?text=" +
          encodeURIComponent(adminMessage);
      }
    };

    new Razorpay(options).open();
  };

  backBtn.onclick = () => {
    selection.classList.remove("active");
    landing.classList.add("active");
  };

  homeBtn.onclick = () => {
    success.classList.remove("active");
    landing.classList.add("active");
  };

});

