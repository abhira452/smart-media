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

    packages[currentService].forEach(pkg => {
      const div = document.createElement("div");
      div.className = "package";
      div.innerText = `${pkg.qty} ${currentService} - ₹${pkg.price}`;
      div.onclick = () => {
        currentPrice = pkg.price; // RUPEES ONLY
        priceDisplay.innerText = "₹" + currentPrice;
        totalPriceDiv.classList.remove("hidden");
      };
      packagesDiv.appendChild(div);
    });
  }

  payBtn.onclick = async () => {
    if (!currentPrice) return alert("Select a package");

    const response = await fetch(
      "https://smart-media-official.onrender.com/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: currentPrice }) // RUPEES
      }
    );

    const order = await response.json();

    const options = {
      key: "rzp_test_Rv7XMdWzLnkhx3",// put the key
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: "Social Media Boost",

      handler: async function (response) {
        const verify = await fetch(
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

        const result = await verify.json();
        if (result.success) {
          selection.classList.remove("active");
          success.classList.add("active");
        }
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

