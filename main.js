document.addEventListener("DOMContentLoaded", () => {

  // ================= VARIABLES =================
  let currentService = "";
  let currentPrice = 0;

  // ================= ELEMENTS =================
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

  // Order inputs (ONLY THESE ARE USED)
  const usernameInput = document.getElementById("username");
  const customerWhatsappInput = document.getElementById("customerWhatsapp");

  // WhatsApp link on success page
  const whatsappLink = document.getElementById("whatsappLink");

  // ================= PRICING =================
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

  // ================= SERVICE CARDS =================
  const cards = document.querySelectorAll(".card");

  if (cards.length === 0) {
    console.error("Service cards not found");
    return;
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      currentService = card.dataset.service;
      landing.classList.remove("active");
      selection.classList.add("active");
      serviceTitle.innerText = "Select " + currentService;
      showPackages();
    });
  });

  // ================= SHOW PACKAGES =================
  function showPackages() {
    packagesDiv.innerHTML = "";
    totalPriceDiv.classList.add("hidden");
    customQty.value = "";
    currentPrice = 0;

    packages[currentService].forEach(p => {
      const div = document.createElement("div");
      div.className = "package";
      div.innerText = `${p.qty} ${currentService} - ₹${p.price}`;

      div.addEventListener("click", () => {
        currentPrice = p.price;
        priceDisplay.innerText = "₹" + currentPrice;
        totalPriceDiv.classList.remove("hidden");
      });

      packagesDiv.appendChild(div);
    });
  }

  // ================= CUSTOM CALCULATION =================
  calculateBtn.addEventListener("click", () => {
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
  });

  // ================= PAY NOW =================
  payBtn.addEventListener("click", () => {

    if (!currentPrice || currentPrice <= 0) {
      alert("Please select a package or calculate price");
      return;
    }

    const username = usernameInput ? usernameInput.value.trim() : "";
    const customerWhatsapp = customerWhatsappInput ? customerWhatsappInput.value.trim() : "";

    if (!username || !customerWhatsapp) {
      alert("Please fill Username and WhatsApp Number");
      return;
    }

    const options = {
      key: "rzp_test_Rv7XMdWzLnkhx3", // 🔴 PUT YOUR RAZORPAY TEST KEY
      amount: currentPrice * 100,
      currency: "INR",
      name: "Social Media Boost",
      description: currentService + " order",

      handler: function ()const orderId = "ORD-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);
{

        // Show success page
        selection.classList.remove("active");
        success.classList.add("active");

        // Prepare WhatsApp message (NO auto open)
        const adminNumber = "918433316066"; // 🔴 YOUR NUMBER

        const message = `
New Order 🚀

Service: ${currentService}
Amount: ₹${currentPrice}
Username: ${username}
Customer WhatsApp: ${customerWhatsapp}
`;

        const whatsappURL =
          "https://wa.me/" +
          adminNumber +
          "?text=" +
          encodeURIComponent(message);

        if (whatsappLink) {
          whatsappLink.href = whatsappURL;
        }
      },

      modal: {
        ondismiss: function () {
          alert("Payment cancelled");
        }
      }
    };

    const rzp = new Razorpay(options);

    rzp.on("payment.failed", function () {
      alert("Payment Failed. Please try again.");
    });

    rzp.open();
  });
const userMessage = `
Hi ${username} 👋

✅ Payment Successful!
🆔 Order ID: ${orderId}
📦 Service: ${currentService}
💰 Amount: ₹${currentPrice}

Status: Processing
Delivery: Within 24 hours

Thank you for choosing us 😊
`;


  // ================= NAVIGATION =================
  backBtn.addEventListener("click", () => {
    selection.classList.remove("active");
    landing.classList.add("active");
  });

  homeBtn.addEventListener("click", () => {
    success.classList.remove("active");
    landing.classList.add("active");
  });

});


