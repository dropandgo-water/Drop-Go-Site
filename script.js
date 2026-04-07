// Residence pricing & term deliveries
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
    firstPaymentText.innerHTML = "Fill in your details to see your initial payment.";
    recurringPaymentText.innerHTML = "Recurring payment per term will be displayed here.";
    payfastAmount.value = 0;
    payfastRecurring.value = 0;
    return;
  }

  const today = new Date();
  const config = pricingConfig[residence];

  let basePrice = config.base;
  let remainingDeliveries = config.deliveries;

  // Example: calculate initial payment depending on passed deliveries
  // Here we assume user signs up now, subtract one delivery for simplicity
  const initialPayment = Math.round((basePrice - basePrice / remainingDeliveries) * 100) / 100;

  // Discount logic for Irene (or any other)
  let discountDisplay = "";
  if (config.discountDates) {
    for (let date of config.discountDates) {
      const d = new Date(date);
      if (today < d) {
        const discounted = Math.round(initialPayment * (1 - config.discountPercent/100) * 100)/100;
        discountDisplay = ` <span style="text-decoration:line-through;color:#999;">R${initialPayment}</span> (-${config.discountPercent}%)`;
        payfastAmount.value = discounted;
        firstPaymentText.innerHTML = `Initial payment: <strong>R${discounted}</strong>${discountDisplay}`;
        break;
      }
    }
  } else {
    payfastAmount.value = initialPayment;
    firstPaymentText.innerHTML = `Initial payment: <strong>R${initialPayment}</strong>`;
  }

  // Recurring payment
  recurringPaymentText.innerHTML = `Recurring payment per term: <strong>R${basePrice}</strong>`;
  payfastRecurring.value = basePrice;
}

// Trigger calculation live
[residenceInput, sectionRoomInput, nameInput, phoneInput].forEach(el => {
  el.addEventListener("input", calculatePayments);
});
