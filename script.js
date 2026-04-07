// Configuration
const config = {
  residences: {
    dagbreek: { 
      baseline: 390, 
      deliveries: [
        "2026-04-07",
        "2026-04-11",
        "2026-04-18",
        "2026-04-25",
        "2026-05-02",
        "2026-05-09",
        "2026-05-16",
        "2026-05-23",
        "2026-05-30"
      ]
    },
    irene: { 
      baseline: 550, 
      deliveries: [
        "2026-04-11",
        "2026-04-18",
        "2026-04-25",
        "2026-05-02",
        "2026-05-09",
        "2026-05-16",
        "2026-05-23",
        "2026-05-30"
      ],
      discountDates: ["2026-04-11", "2026-04-18"],
      discountPercent: 30
    }
  }
};

const residenceSelect = document.getElementById('residence');
const priceDisplay = document.getElementById('display-price');
const pfAmount = document.getElementById('pf-amount');
const pfRecurring = document.getElementById('pf-recurring');

residenceSelect.addEventListener('change', () => {
  const selected = residenceSelect.value;
  if (!selected) {
    priceDisplay.textContent = "Price: R50 – R550";
    pfAmount.value = 0;
    pfRecurring.value = 0;
    return;
  }

  const today = new Date();
  const res = config.residences[selected];

  // Remaining deliveries for current term
  const remainingDeliveries = res.deliveries.filter(d => new Date(d) >= today).length;
  const totalDeliveries = res.deliveries.length;

  // Calculate discount if applicable (for Irene)
  let price = res.baseline;
  if (selected === 'irene') {
    const discountActive = res.discountDates.some(d => new Date(d) > today);
    price = price * (discountActive ? (1 - res.discountPercent / 100) : 1);
  }

  // First payment: proportional to remaining deliveries
  const firstPayment = remainingDeliveries > 0 ? (price * remainingDeliveries / totalDeliveries) : price;

  priceDisplay.textContent = `First payment: R${firstPayment.toFixed(2)}`;
  
  // Update hidden PayFast inputs
  pfAmount.value = firstPayment.toFixed(2);
  pfRecurring.value = res.baseline; // recurring amount is always baseline
});
