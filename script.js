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

  let discount = 0;
  let discountText = "";

  if (residence === "Irene" && data.discountDates) {
    data.discountDates.forEach(d => {
      if (new Date(d.date) >= today) {
        discount = d.discount;
        const endDate = new Date(d.date);
        discountText = ` (30% Off till ${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'short' })})`;
      }
    });
  }

  // First payment uses discount if applicable
  const firstPayment = (data.baseline * remaining / deliveryDates.length) * (1 - discount);

  // Recurring payment always baseline
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
    // Get the current selected residence
    const residence = residenceSelect.value;

    // Get the section/room input value
    const sectionRoom = payfastForm.querySelector('input[name="section_room"]').value;

    // Populate PayFast custom fields
    document.getElementById('custom_str1').value = residence;      // Custom String 1 = Residence
    document.getElementById('custom_str2').value = sectionRoom;    // Custom String 2 = Section_Room
});
