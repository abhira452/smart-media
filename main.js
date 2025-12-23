document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // GLOBAL VARIABLES
  // ======================
  let currentService = "";
  let currentPrice = 0;

  // ======================
  // DOM ELEMENTS
  // ======================
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

  // ======================
  // PRICE RULES (IN RUPEES)
  // ======================
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

  // ======================
  // SERVICE SELECTION
  // ======================
  document.querySelectorAll(".card").forEach(card => {
    card.onclick = () => {
      currentService = card.dataset.service;
      landing.classList.remove("active");
      selection.classList.add("active");
      serviceTitle.innerText = "Select " + currentService;
      showPackages();
    };
  });

  // ======================
  // SHOW PACKAGES
  // ======================
  function showPackages() {
    packagesDiv.innerHTML = "";
    totalPriceDiv.classList.add("hidden");
    customQty.value = "";
    currentPrice = 0;

    packages[currentService].forEach(pkg => {
      const div = document.createElement("div");
      div.className = "package";
      div.innerText = `${pkg.qty} ${currentService} - ₹${pkg.price}`;

      div.onclick = () => {
        currentPrice = Number(pkg.price);   // 🔥 FORCE NUMBER
        priceDisplay.innerText = "₹" + currentPrice;
        totalPriceDiv.classList.remove("hidden");
      };

      packagesDiv.appendChild(div);
    });
  }

  // ======================
  // CUSTOM QUANTITY CALCULATION
  // ======================
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

    currentPrice = Math.round(qty * rates[currentService]); // RUPEES
    priceDisplay.innerText = "₹" + currentPrice;
    totalPriceDiv.classList.remove("hidden");
  };

  // ======================
  // PAY NOW (FIXED AMOUNT LOGIC)
  // ======================
  payBtn.onclick = async () => {

    if (!currentPrice || currentPrice <= 0) {
      alert("Please select a package or calculate price");
      return;
    }

    // 🔥 FINAL AMOUNT (FROM DISPLAY — NOT VARIABLE)
    const finalAmountRupees = Number(priceDisplay.innerText.replace("₹", ""));
    const finalAmountPaise = finalAmountRupees * 1000;

    try {
      // 1️⃣ Create order from backend
      const orderResponse = await fetch(
        "https://smart-media-official.onrender.com/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalAmountPaise
          })
        }
      );

      const order = await orderResponse.json();

      // 2️⃣ Razorpay options
      const options = {
        key: "rzp_test_Rv7XMdWzLnkhx3", // 🔴 PUT YOUR TEST KEY ID ONLY
        amount: order.amount,
        currency: "INR",
        name: "Social Media Boost",
        description: currentService + " order",
        order_id: order.id,

        handler: async function (response) {

          // 3️⃣ Verify payment
          const verifyResponse = await fetch(
            "https://smart-media-official.onrender.com/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            }
          );

          const result = await verifyResponse.json();

          if (result.success) {
            selection.classList.remove("active");
            success.classList.add("active");
          } else {
            alert("Payment verification failed");
          }
        },

        theme: {
          color: "#667eea"
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Backend not reachable");
    }
  };

  // ======================
  // NAVIGATION
  // ======================
  backBtn.onclick = () => {
    selection.classList.remove("active");
    landing.classList.add("active");
  };

  homeBtn.onclick = () => {
    success.classList.remove("active");
    landing.classList.add("active");
  };

});


