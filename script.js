// Configuration for residence pricing and discount
const pricingConfig = {
  "Dagbreek": { base: 390, deliveries: 9 },
  "Irene": {
    base: 550,
    deliveries: 8,
    discountDates: ["2026-04-11","2026-04-18"],
    discountPercent: 30
  }
};

// Elements
const residenceInput = document.getElementById("residence");
const sectionRoomInput = document.getElementById("section-room");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const firstPaymentText = document.getElementById("first-payment-text");
const recurringPaymentText = document.getElementById("recurring-payment-text");
const payfastAmount = document.getElementById("payfast-amount");
const payfastRecurring = document.getElementById("payfast-recurring");

function calculatePayments() {
  const residence = residenceInput.value;
  if (!residence || !pricingConfig[residence]) {
    firstPaymentText.innerHTML = "Fill in your details to see your first payment and discount.";
    recurringPaymentText.innerHTML = "Recurring payment per term will be calculated automatically.";
    payfastAmount.value = 0;
    payfastRecurring.value = 0;
    return;
  }

  const today = new Date();
  const config = pricingConfig[residence];

  let firstPayment = config.base;
  let discountDisplay = "";

  // Apply discount for special dates
  if (config.discountDates) {
    for (let date of config.discountDates) {
      const d = new Date(date);
      if (today < d) {
        firstPayment = Math.round((firstPayment * (1 - config.discountPercent / 100)) * 100) / 100;
        discountDisplay = ` <span style="text-decoration:line-through;color:#999;">R${config.base}</span> (-${config.discountPercent}%)`;
        break;
      }
    }
  }

  // Adjust by remaining deliveries
  firstPayment = Math.round((firstPayment / config.deliveries) * 100) / 100;
  const recurring = config.base;

  // Update display
  firstPaymentText.innerHTML = `First payment: <strong>R${firstPayment}</strong>${discountDisplay}`;
  recurringPaymentText.innerHTML = `Recurring payment per term: <strong>R${recurring}</strong>`;

  // Update PayFast fields
  payfastAmount.value = firstPayment;
  payfastRecurring.value = recurring;
}

// Trigger calculation whenever the user updates the form
[residenceInput, sectionRoomInput, nameInput, phoneInput].forEach(el => {
  el.addEventListener("input", calculatePayments);
});
