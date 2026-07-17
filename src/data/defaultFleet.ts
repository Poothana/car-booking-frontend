/**
 * Shown when the cars API is empty or unreachable.
 * Keeps the homepage trustable for visitors and crawlers.
 * Replace indicative rates with your live tariff when possible (admin cars).
 */
export type DefaultFleetCard = {
  id: string
  name: string
  icon: 'fa-car' | 'fa-car-side' | 'fa-shuttle-van' | 'fa-bus'
  seats: number
  rentPerDay: number
  fuelPerKm: number
  abovePerKm: number
  driverBatta: number
  examples: string
}

export const DEFAULT_FLEET_CARDS: DefaultFleetCard[] = [
  {
    id: 'fallback-sedan',
    name: 'Sedan',
    icon: 'fa-car-side',
    seats: 4,
    rentPerDay: 2500,
    fuelPerKm: 12,
    abovePerKm: 14,
    driverBatta: 300,
    examples: 'Dzire / Etios class',
  },
  {
    id: 'fallback-suv',
    name: 'SUV / MUV',
    icon: 'fa-shuttle-van',
    seats: 6,
    rentPerDay: 3500,
    fuelPerKm: 15,
    abovePerKm: 18,
    driverBatta: 400,
    examples: 'Innova / Ertiga class',
  },
  {
    id: 'fallback-crysta',
    name: 'Innova Crysta',
    icon: 'fa-shuttle-van',
    seats: 7,
    rentPerDay: 4500,
    fuelPerKm: 16,
    abovePerKm: 20,
    driverBatta: 400,
    examples: 'Premium family SUV',
  },
  {
    id: 'fallback-traveller',
    name: 'Tempo Traveller',
    icon: 'fa-bus',
    seats: 12,
    rentPerDay: 5500,
    fuelPerKm: 18,
    abovePerKm: 22,
    driverBatta: 500,
    examples: 'Group tours 12–14 seats',
  },
]
