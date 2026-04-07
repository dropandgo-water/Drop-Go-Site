// script.js

// Helper to parse YYYY-MM-DD string to Date
function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Calculate first payment for a residence
function getFirstPayment(residence) {
  const today = new Date();
  const config = deliveryConfig[residence];
  const deliveries = config.deliveries.map(parseDate);

  // Remaining deliveries
  const remainingDeliveries = deliveries.filter(d => today <= d);
  const totalDeliveries = remainingDeliveries.length;

  if(totalDeliveries === 0) return config.basePrice; // after term → full price

  let price = config.basePrice * (totalDeliveries / deliveries.length);

  // Apply early discount if set
  if(config.earlyDiscount > 0 && remainingDeliveries.length === deliveries.length){
    price = price * (1 - config.earlyDiscount);
  }

  return price.toFixed(2);
}

// Calculate recurring payment date (3 days before next term start)
function getNextRecurringDate() {
  const today = new Date();
  for(const term of termConfig){
    const termStart = parseDate(term.start);
    if(today <= termStart){
      const recurringDate = new Date(termStart);
      recurringDate.setDate(recurringDate.getDate() - 3);
      return recurringDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    }
  }
  return null;
}

// Update forms
document.querySelectorAll('.card form').forEach(form => {
  const residenceSelect = form.querySelector('select[name="residence"]');
  let residence = residenceSelect.value;

  // Initial first payment
  form.querySelector('input[name="amount"]').value = getFirstPayment(residence);
  form.querySelector('input[name="recurring_amount"]').value = deliveryConfig[residence].basePrice;

  // Update payment if residence changes
  residenceSelect.addEventListener('change', () => {
    residence = residenceSelect.value;
    form.querySelector('input[name="amount"]').value = getFirstPayment(residence);
    form.querySelector('input[name="recurring_amount"]').value = deliveryConfig[residence].basePrice;
  });
});

// Log next recurring payment date
console.log("Next recurring payment date:", getNextRecurringDate());
