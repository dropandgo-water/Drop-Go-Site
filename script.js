document.addEventListener("DOMContentLoaded", () => {
  const residenceSelect = document.getElementById("residence-select");
  const firstPaymentDisplay = document.getElementById("first-payment");
  const pfAmount = document.getElementById("pf-amount");
  const pfRecurring = document.getElementById("pf-recurring");

  function calculateFirstPayment() {
    const residenceKey = residenceSelect.value;
    if (!residenceKey) {
      firstPaymentDisplay.textContent = "First payment: R---";
      return;
    }

    const today = new Date();
    const residence = RESIDENCES[residenceKey];
    const deliveries = residence.deliveries.map(d => new Date(d));
    let remainingDeliveries = deliveries.filter(d => d >= today).length;

    if (remainingDeliveries === 0) {
      remainingDeliveries = deliveries.length; // next term
    }

    let firstPayment = residence.baseline * (remainingDeliveries / deliveries.length);

    // Apply early discount for Irene first 2 deliveries
    if (residence.earlyDiscount && residenceKey === "irene") {
      if (today < deliveries[1]) { // before 2nd delivery
        firstPayment = firstPayment * (1 - residence.earlyDiscount);
      }
    }

    // Round to nearest rand
    firstPayment = Math.round(firstPayment);

    firstPaymentDisplay.textContent = `First payment: R${firstPayment}`;
    pfAmount.value = firstPayment;
    pfRecurring.value = residence.baseline; // recurring amount always baseline
  }

  residenceSelect.addEventListener("change", calculateFirstPayment);
});
