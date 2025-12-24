document.addEventListener("DOMContentLoaded", () => {

  let currentService = "";
  let currentPrice = 0;

  const landing = document.getElementById("landing");
  const selection = document.getElementById("selection");
  const success = document.getElementById("success");

  const serviceTitle = document.getElementById("service-title");
  const packagesDiv = document.getElementById("packages");
  const priceDisplay = document.getElementById("price-display");
  const totalPriceDiv = document.getElementById("total-price");

  const payBtn = document.getElementById("pay-btn");
  const backBtn = document.getElementById("back-btn");
  const homeBtn = document.getElementById("home-btn");

  const usernameInput = document.getElementById("username");
  const customerWhatsappInput = document.getElementById("customerWhatsapp");

  const userWhatsappLink = document.getElementById("userWhatsappLink");

  const packages = {
    followers: [{ qty: 100, price: 30 }],
    likes: [{ qty: 100, price: 20 }],
    views: [{ qty: 1000, price: 40 }]
  };

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

  payBtn.onclick = () => {

    const username = usernameInput.value.trim();
    const customerWhatsapp = customerWhatsappInput.value.trim();

    if (!username || !customerWhatsapp) {
      alert("Fill username and WhatsApp number");
      return;
    }

    const orderId =
      "ORD-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);

    const options = {
      key: "rzp_test_YOUR_KEY_ID", // 🔴 PUT YOUR TEST KEY
      amount: currentPrice * 100,
      currency: "INR",
      name: "Social Media Boost",

      handler: function () {

        // show success
        selection.classList.remove("active");
        success.classList.add("active");

        // show order id
        document.getElementById("orderIdText").innerText = orderId;

        // WhatsApp confirmation for USER
        const userMessage = `
Hi ${username} 👋

Payment Successful ✅
Order ID: ${orderId}
Service: ${currentService}
Amount: ₹${currentPrice}

Status: Processing
Delivery: Within 24 hours
`;

        const userWhatsappURL =
          "https://wa.me/" +
          customerWhatsapp +
          "?text=" +
          encodeURIComponent(userMessage);

        userWhatsappLink.href = userWhatsappURL;
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
