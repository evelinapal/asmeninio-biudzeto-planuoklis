export function createInitialMonths() {
  return {
    '2026-10': {
      budgetCents: 140_000,
      expenses: [
        {
          id: 'oct-food',
          name: 'Maisto prekės',
          amountCents: 4_850,
          createdAt: 1,
        },
        {
          id: 'oct-transport',
          name: 'Transportas',
          amountCents: 6_500,
          createdAt: 2,
        },
      ],
    },
    '2026-11': {
      budgetCents: 150_000,
      expenses: [
        {
          id: 'nov-cafe',
          name: 'Kavinė',
          amountCents: 1_200,
          createdAt: 1,
        },
        {
          id: 'nov-shopping',
          name: 'Pirkiniai',
          amountCents: 8_500,
          createdAt: 2,
        },
      ],
    },
  }
}
