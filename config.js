// Base prices
const basePrices = {
  Dagbreek: 390,
  Irene: 550
};

// Delivery dates
const deliveries = {
  Dagbreek: [
    "2026-04-11","2026-04-18","2026-04-25","2026-05-02",
    "2026-05-09","2026-05-16","2026-05-23","2026-05-30","2026-06-06"
  ],
  Irene: [
    "2026-04-11","2026-04-18","2026-04-25","2026-05-02",
    "2026-05-09","2026-05-16","2026-05-23","2026-05-30"
  ]
};

// Elements
const residence = document.getElementById("residence");
const priceText = document.getElementById("price-text");
const recurringText = document.getElementById("recurring-text");

// Inputs
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const roomInput = document.getElementById("room");

// PayFast fields
const pfAmount = document.getElementById("payfast-amount");
const pfRecurring = document.getElementById("payfast-recurring");
const pfName = document.getElementById("pf-name");
const pfPhone = document.getElementById("pf-phone");
const pfResidence = document.getElementById("pf-residence");
const pfRoom = document.getElementById("pf-room");

// MAIN FUNCTION
function updateEverything() {
  const res = residence.value;

  // Copy user data → PayFast
  pfName.value = nameInput.value;
  pfPhone.value = phoneInput.value;
  pfResidence.value = res;
  pfRoom.value = roomInput.value;

  if (!res) {
    priceText.innerHTML = "Fill in your details to see your price";
    recurringText.innerHTML = "";
    return;
  }

  const today = new Date();
  const dates = deliveries[res].map(d => new Date(d));

  const total = dates.length;
  const remaining = dates.filter(d => d >= today).length;

  const base = basePrices[res];

  // CORRECT calculation
  const priceNow = (base * (remaining / total)).toFixed(2);
  const discount = Math.round((1 - (remaining / total)) * 100);

  // Display
  priceText.innerHTML = `
    R${priceNow} / term <br>
    <span style="font-size:14px;">
      <span style="text-decoration:line-through;">R${base}</span>
      (${discount}% off)
    </span>
  `;

  recurringText.innerHTML = `Recurring: R${base} / term`;

  // Send to PayFast
  pfAmount.value = priceNow;
  pfRecurring.value = base;
}

// EVENTS (this is what you were missing before)
residence.addEventListener("change", updateEverything);
nameInput.addEventListener("input", updateEverything);
phoneInput.addEventListener("input", updateEverything);
roomInput.addEventListener("input", updateEverything);
