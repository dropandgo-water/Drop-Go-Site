// script.js

const residenceSelect = document.getElementById('residence');
const sectionRoomInput = document.getElementById('sectionRoom');
const fullNameInput = document.getElementById('fullName');
const phoneInput = document.getElementById('phoneNumber');
const firstPaymentEl = document.getElementById('firstPayment');
const recurringPaymentEl = document.getElementById('recurringPayment');
const subscribeBtn = document.getElementById('subscribeBtn');

residenceSelect.addEventListener('change', updatePayments);
sectionRoomInput.addEventListener('input', updatePayments);
fullNameInput.addEventListener('input', updatePayments);
phoneInput.addEventListener('input', updatePayments);

function updatePayments() {
  const residence = residenceSelect.value;
  if (!residence || !residences[residence]) {
    firstPaymentEl.textContent = '-';
    recurringPaymentEl.textContent = '-';
    return;
  }

  const today = new Date();
  const resData = residences[residence];
  const totalDeliveries = resData.deliveries.length;

  // Find remaining deliveries
  let remaining = resData.deliveries.filter(d => new Date(d) >= today).length;
  if (remaining === 0) remaining = totalDeliveries; // in case term already passed

  // Base calculation
  let firstPayment = (resData.baseline * remaining) / totalDeliveries;
  let discountText = '';

  // Apply discount if applicable
  if (resData.discountDates) {
    for (const disc of resData.discountDates) {
      if (new Date(disc.date) >= today) {
        firstPayment = firstPayment * (1 - disc.discount);
        discountText = ` (was ${resData.baseline}, discount ${disc.discount * 100}%)`;
        break;
      }
    }
  }

  firstPaymentEl.innerHTML = `${firstPayment.toFixed(2)}${discountText} / term`;
  recurringPaymentEl.textContent = `${resData.baseline.toFixed(2)} / term`;
}

// PayFast integration
subscribeBtn.addEventListener('click', () => {
  const residence = residenceSelect.value;
  if (!residence) { alert('Please select a residence.'); return; }

  const firstPayment = parseFloat(firstPaymentEl.textContent) || residences[residence].baseline;

  // Build PayFast URL
  const payfastUrl = `https://www.payfast.co.za/eng/process?merchant_id=${payfastConfig.merchant_id}&amount=${firstPayment.toFixed(2)}&item_name=Water+Subscription&return_url=${encodeURIComponent(payfastConfig.return_url)}&cancel_url=${encodeURIComponent(payfastConfig.cancel_url)}`;

  window.open(payfastUrl, "_blank");
});
