// Baseline price per residence
const RESIDENCES = {
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
    earlyDiscount: 0.30 // 30% discount for first 2 deliveries
  }
};
