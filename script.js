// BASE PRICES
const basePrices = {
  dagbreek: 390,
  irene: 550
};

// DELIVERY DATES (EDIT THESE WHEN NEEDED)
const deliveries = {
  dagbreek: [
    "2026-04-11","2026-04-18","2026-04-25","2026-05-02","2026-05-09","2026-05-16","2026-05-23","2026-05-30","2026-06-06"
  ],
  irene: [
    "2026-04-11","2026-04-18","2026-04-25","2026-05-02","2026-05-09","2026-05-16","2026-05-23","2026-05-30"
  ]
};

// ELEMENTS
const residence = document.getElementById("residence");
const firstPayment = document.getElementById("first-payment");
const recurringPayment = document.getElementById("recurring-payment");

// UPDATE FUNCTION
function updatePrice() {
  const res = residence.value;

  if (!res) {
    firstPayment.innerHTML = "Fill in your details to see your price";
    recurringPayment.innerHTML = "";
    return;
  }

  const today = new Date();
  const dates = deliveries[res].map(d => new Date(d));

  const total = dates.length;
  const remaining = dates.filter(d => d >= today).length;

  const base = basePrices[res];

  // 🔥 CORRECT LOGIC
  const priceNow = (base * (remaining / total)).toFixed(2);
  const discount = Math.round((1 - (remaining / total)) * 100);

  // DISPLAY
  firstPayment.innerHTML = `
    <span class="big-price">R${priceNow}</span> / term
    <br>
    <span class="sub-price">
      <span class="strike">R${base}</span>
      (${discount}% discount)
    </span>
  `;

  recurringPayment.innerHTML = `
    Recurring: <strong>R${base}</strong> / term
  `;
}

// LIVE UPDATE
residence.addEventListener("change", updatePrice);
document.getElementById("section-room").addEventListener("input", updatePrice);
document.getElementById("name").addEventListener("input", updatePrice);
document.getElementById("phone").addEventListener("input", updatePrice);

// SUBMIT (PLACEHOLDER FOR PAYFAST INTEGRATION)
document.getElementById("payment-form").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Ready to connect PayFast here.");
});
