alert("JS CONNECTED");
// Price configuration (easy to change)
const prices = {
    followers: 0.30, // ₹ per follower
    likes: 0.20,     // ₹ per like
    views: 0.04      // ₹ per view
};

// DOM Elements
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

// Current service and selected package
let currentService = '';
let selectedQuantity = 0;

// Package data for each service
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

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Landing page cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            currentService = card.dataset.service;
            showSelectionPage();
        });
    });

    // Back button
    backBtn.addEventListener('click', showLandingPage);

    // Calculate custom price
    calculateBtn.addEventListener('click', calculateCustomPrice);

    // Pay now button
    payBtn.addEventListener('click', initiatePayment);

    // Home button
    homeBtn.addEventListener('click', showLandingPage);
});

// Show landing page
function showLandingPage() {
    landing.classList.add('active');
    selection.classList.remove('active');
    success.classList.remove('active');
    resetSelection();
}

// Show selection page
function showSelectionPage() {
    landing.classList.remove('active');
    selection.classList.add('active');
    serviceTitle.textContent = `Select ${currentService.charAt(0).toUpperCase() + currentService.slice(1)}`;
    renderPackages();
}

// Render packages for current service
function renderPackages() {
    packagesDiv.innerHTML = '';
    packageData[currentService].forEach(pkg => {
        const div = document.createElement('div');
        div.className = 'package';
        div.innerHTML = `<span>${pkg.qty} ${currentService} – ₹${pkg.price}</span>`;
        div.addEventListener('click', () => selectPackage(pkg.qty, pkg.price));
        packagesDiv.appendChild(div);
    });
}

// Select a package
function selectPackage(qty, price) {
    selectedQuantity = qty;
    updateTotalPrice(price);
    // Highlight selected
    document.querySelectorAll('.package').forEach(p => p.classList.remove('selected'));
    event.target.closest('.package').classList.add('selected');
}

// Calculate custom price
function calculateCustomPrice() {
    const qty = parseInt(customQuantity.value);
    if (qty > 0) {
        const price = Math.round(qty * prices[currentService]);
        selectedQuantity = qty;
        updateTotalPrice(price);
        // Deselect other packages
        document.querySelectorAll('.package').forEach(p => p.classList.remove('selected'));
    } else {
        alert('Please enter a valid quantity.');
    }
}

// Update total price display
function updateTotalPrice(price) {
    priceDisplay.textContent = `₹${price}`;
    totalPriceDiv.classList.remove('hidden');
}

// Initiate Razorpay payment
function initiatePayment() {
    const amount = parseInt(priceDisplay.textContent.replace('₹', '')) * 100; // Amount in paisa
    const options = {
        key: 'rzp_test_YourTestKeyHere', // Replace with your Razorpay test key
        amount: amount,
        currency: 'INR',
        name: 'Social Media Boost',
        description: `${selectedQuantity} ${currentService}`,
        handler: function (response) {
            // Payment success
            showSuccessPage();
        },
        prefill: {
            name: '',
            email: '',
            contact: ''
        },
        theme: {
            color: '#667eea'
        }
    };
    const rzp = new Razorpay(options);
    rzp.open();
}

// Show success page
function showSuccessPage() {
    selection.classList.remove('active');
    success.classList.add('active');
}

// Reset selection page
function resetSelection() {
    selectedQuantity = 0;
    customQuantity.value = '';
    totalPriceDiv.classList.add('hidden');
    document.querySelectorAll('.package').forEach(p => p.classList.remove('selected'));

}
