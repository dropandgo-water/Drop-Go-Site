const residenceSelect = document.getElementById("residence");
const priceDisplay = document.getElementById("priceDisplay");
const paymentInfo = document.getElementById("paymentInfo");
const amountField = document.getElementById("amount");
const recurringField = document.getElementById("recurring_amount");
const itemNameField = document.getElementById("item_name");
const receiverField = document.querySelector('input[name="receiver"]');
receiverField.value = payfastConfig.merchant_id;

residenceSelect.addEventListener("change", updatePricing);

function updatePricing() {
  const residence = residenceSelect.value;
  if (!residence || !residences[residence]) {
    priceDisplay.textContent = "—";
    paymentInfo.textContent = "Fill in your details to see your payment";
    amountField.value = "";
    recurringField.value = "";
    return;
  }

  const today = new Date();
  const data = residences[residence];
  const deliveryDates = data.deliveries.map(d => new Date(d));
  const remaining = deliveryDates.filter(d => d >= today).length;

  // Check for active special price
  let effectiveBaseline = data.baseline;
  let discountText = "";
  if (data.specialPrice && today <= new Date(data.specialPrice.expiresAt)) {
    effectiveBaseline = data.specialPrice.price;
    discountText = ` <span style="color:#e53935;font-weight:bold;">🔥 Special price R${data.specialPrice.price} — offer ends 22 Apr 23:59!</span>`;
  }

  const firstPayment = effectiveBaseline * remaining / deliveryDates.length;
  const recurringPayment = data.baseline;

  priceDisplay.textContent = firstPayment.toFixed(2);
  paymentInfo.innerHTML = `<strong>Initial payment:</strong> R${firstPayment.toFixed(2)}${discountText}<br>
                           <strong>Recurring payment:</strong> R${recurringPayment.toFixed(2)} / term`;
  amountField.value = firstPayment.toFixed(2);
  recurringField.value = recurringPayment.toFixed(2);
  itemNameField.value = `${residence} Subscription`;
}

const payfastForm = document.getElementById('payfastForm');
payfastForm.addEventListener('submit', function() {
  const residence = residenceSelect.value;
  const sectionRoom = payfastForm.querySelector('input[name="section_room"]').value;
  document.getElementById('custom_str1').value = residence;
  document.getElementById('custom_str2').value = sectionRoom;
});
