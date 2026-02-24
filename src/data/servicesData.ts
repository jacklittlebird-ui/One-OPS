// ==========================================
// Chart of Services Cost — Master Data
// Sources: Chart_of_Services_Cost_1.pdf, Chart_of_Services_Cost_1_1.pdf, CAI_1.pdf
// ==========================================

// --- Civil Aviation (Egyptian Airports) ---
// Rate tiers from master data sheet
export function calcEgyptianAirports(ton: number) {
  let dayFee: number, nightFee: number;
  if (ton <= 18) {
    dayFee = 1.817 * ton;
    nightFee = 2.18 * ton;
  } else if (ton <= 25) {
    dayFee = 1.817 * 18 + (ton - 18) * 1.82;
    nightFee = 2.18 * 18 + (ton - 18) * 2.27;
  } else if (ton <= 100) {
    dayFee = 1.817 * 18 + 7 * 1.82 + (ton - 25) * 2.783;
    nightFee = 2.18 * 18 + 7 * 2.27 + (ton - 25) * 3.479;
  } else {
    dayFee = 1.817 * 18 + 7 * 1.82 + 75 * 2.783 + (ton - 100) * 3.761;
    nightFee = 2.18 * 18 + 7 * 2.27 + 75 * 3.479 + (ton - 100) * 4.640;
  }
  return { dayFee: +dayFee.toFixed(3), nightFee: +nightFee.toFixed(3) };
}

export const civilAviationData = Array.from({ length: 200 }, (_, i) => {
  const ton = i + 1;
  const { dayFee, nightFee } = calcEgyptianAirports(ton);
  return { id: String(ton), ton, dayFee, nightFee, currency: "USD", airports: "HRG, SSH, LXR, ASW" };
});

// Civil Aviation additional services (per unit / as per request)
export const civilAviationServices = [
  { service: "Landing Fees", billing: "D/N", category: "Core Fees" },
  { service: "Navigation Fees", billing: "D/N", category: "Core Fees" },
  { service: "Parking", billing: "D/N", category: "Core Fees" },
  { service: "Housing", billing: "D/N", category: "Core Fees" },
  { service: "Fire Cart", billing: "Per Unit", category: "Services per unit" },
  { service: "Follow Me", billing: "Per Unit", category: "Services per unit" },
  { service: "Jetway", billing: "Per Unit", category: "Services per unit" },
  { service: "Lighting Fees", billing: "Per Unit", category: "Services per unit" },
  { service: "Take Off Light", billing: "Per Unit", category: "Services per unit" },
  { service: "Weather / Flight Planning", billing: "Per Unit", category: "Services per unit" },
  { service: "Aviation Control Services", billing: "Per Unit", category: "Services per unit" },
  { service: "Other Services", billing: "Per Unit", category: "Services per unit" },
  { service: "Departure Pax Taxes (رسوم مغادرة)", billing: "Per Pax", category: "Pax Services" },
  { service: "State Resource Development Fees (تنمية موارد الدولة)", billing: "Per Pax", category: "Pax Services" },
  { service: "Police Service Fees (رسوم خدمات الشرطة)", billing: "Per Pax", category: "Pax Services" },
  { service: "Developing Security System Charges (نظم أمنية)", billing: "Per Pax", category: "Pax Services" },
  { service: "CUTE System", billing: "Per Flight", category: "System Fees" },
  { service: "SITA Cute National", billing: "Per Flight", category: "System Fees" },
  { service: "SITA Cute Domestic", billing: "Per Flight", category: "System Fees" },
  { service: "Go Now Material", billing: "Per Unit", category: "System Fees" },
  { service: "DCS – Check-In Material", billing: "Per Unit", category: "System Fees" },
];

// --- Handling Services ---
export const handlingTypes = [
  { type: "Full Handling", subTypes: ["Turnaround", "Transit", "Night Stop", "Ferry In / Out"] },
  { type: "Ramp Handling", subTypes: ["Turnaround", "Transit", "Night Stop"] },
  { type: "Basic Handling", subTypes: ["Standard"] },
  { type: "Cargo Handling", subTypes: ["Basic Handling"] },
  { type: "Ground Services", subTypes: ["Link Supervision"] },
  { type: "Supervision Only", subTypes: ["Link Supervision"] },
  { type: "Crew Handling", subTypes: ["Link Supervision"] },
];

export const handlingEquipmentIncluded = [
  { name: "Chocks", unit: "Per Unit", category: "Included in Basic" },
  { name: "Marshalling", unit: "Per Unit", category: "Included in Basic" },
  { name: "Water Services", unit: "Per Unit", category: "Included in Basic" },
  { name: "Toilet Services", unit: "Per Unit", category: "Included in Basic" },
  { name: "Internal Cabin Cleaning", unit: "Per Unit", category: "Included in Basic" },
  { name: "Medical Highlift", unit: "Per Unit", category: "Included in Basic" },
];

export const handlingEquipmentPerHour = [
  { name: "Passenger Steps", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Tractor", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Baggage Cart", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Belt Conveyor", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Semi Skilled Worker", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Loading Platform", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Single Container Dolly", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Double Container Dolly", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Pallet Dolly 10 ft.", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Pallet Dolly 20 ft.", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Upper Deck Loading Platform", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
  { name: "Transporter", unit: "Per Hour", category: "Per Hour (time-free in basic)" },
];

export const handlingEquipmentOnRequest = [
  { name: "Passenger Bus (70 Pax)", unit: "Per Unit", category: "On Request" },
  { name: "VIP Microbus", unit: "Per Unit", category: "On Request" },
  { name: "Crew Microbus", unit: "Per Unit", category: "On Request" },
  { name: "Handicapped Vehicle", unit: "Per Unit", category: "On Request" },
  { name: "Catering Highlift", unit: "Per Unit", category: "On Request" },
  { name: "Catering Change (Belly to Cabin)", unit: "Per Unit", category: "On Request" },
  { name: "Push Back", unit: "Per Unit", category: "On Request" },
  { name: "Towing Tractor", unit: "Per Unit", category: "On Request" },
  { name: "Dispatching / Engine Startup", unit: "Per Unit", category: "On Request" },
  { name: "Air Starter Unit (ASU)", unit: "Per Unit", category: "On Request" },
  { name: "Security Services", unit: "Per Unit", category: "On Request" },
  { name: "Baggage Identification", unit: "Per Unit", category: "On Request" },
  { name: "Change Head Rests A/C", unit: "Per Unit", category: "On Request" },
  { name: "Gallery Cleaning", unit: "Per Unit", category: "On Request" },
  { name: "Live Animal Kit", unit: "Per Unit", category: "On Request" },
  { name: "Pallet (per day)", unit: "Per Day", category: "On Request" },
  { name: "Container (per day)", unit: "Per Day", category: "On Request" },
  { name: "Aircraft Disinfection", unit: "Per Unit", category: "On Request" },
  { name: "Baggage Disinfection", unit: "Per Unit", category: "On Request" },
  { name: "Wheelchair", unit: "Per Unit", category: "On Request" },
];

export const handlingEquipmentPerHourRequest = [
  { name: "Ground Power Unit (GPU)", unit: "Per Hour", category: "Per Hour (on request)" },
  { name: "Air Condition Unit (ACU)", unit: "Per Hour", category: "Per Hour (on request)" },
  { name: "Ramp Car", unit: "Per Hour", category: "Per Hour (on request)" },
  { name: "Maintenance Steps", unit: "Per Hour", category: "Per Hour (on request)" },
  { name: "Fork Lift (up to 20 ton)", unit: "Per Hour", category: "Per Hour (on request)" },
  { name: "Link Supervision", unit: "Per Hour", category: "Per Hour (on request)" },
];

export const crewHandlingItems = [
  { service: "Crew Bus", unit: "Per Trip" },
  { service: "Visas for Crew", unit: "Per Visa" },
  { service: "Crew Handling on Arrival", unit: "Per Flight" },
  { service: "Crew Handling on Departure", unit: "Per Flight" },
  { service: "Transportation", unit: "Per Trip" },
];

// --- Catering (expanded from PDFs) ---
export const cateringItems = [
  { item: "Crew Meal", unit: "Per Crew", price: "TBD", category: "Meals" },
  { item: "PAX Light Meal", unit: "Per Pax", price: "TBD", category: "Meals" },
  { item: "PAX Cold Meal", unit: "Per Pax", price: "TBD", category: "Meals" },
  { item: "Economy Meals", unit: "Per Pax", price: "TBD", category: "Meals" },
  { item: "Hot Meal at A/P Cafeteria", unit: "Per Pax", price: "TBD", category: "Meals" },
  { item: "Lunch & Drinks for Crew", unit: "Per Crew", price: "TBD", category: "Meals" },
  { item: "Cold Snacks with Drink", unit: "Per Pax", price: "TBD", category: "Meals" },
  { item: "Light Meals for Pax", unit: "Per Pax", price: "TBD", category: "Meals" },
  { item: "Hot Dinner", unit: "Per Pax", price: "TBD", category: "Meals" },
  { item: "Mixed Sandwiches", unit: "Per Unit", price: "TBD", category: "Food Items" },
  { item: "Mixed Salad", unit: "Per Unit", price: "TBD", category: "Food Items" },
  { item: "Fresh Fruit Tray", unit: "Per Tray", price: "TBD", category: "Food Items" },
  { item: "Cheese Bun", unit: "Per Unit", price: "TBD", category: "Food Items" },
  { item: "Cookies", unit: "Per Unit", price: "TBD", category: "Food Items" },
  { item: "Snickers", unit: "Per Unit", price: "TBD", category: "Food Items" },
  { item: "Drinks", unit: "Per Unit", price: "TBD", category: "Beverages" },
  { item: "Juice", unit: "Per Unit", price: "TBD", category: "Beverages" },
  { item: "Yogurt Drink", unit: "Per Unit", price: "TBD", category: "Beverages" },
  { item: "Mineral Water 1.5L", unit: "Per Bottle", price: "TBD", category: "Beverages" },
  { item: "Mineral Water 600ml", unit: "Per Bottle", price: "TBD", category: "Beverages" },
  { item: "Milk 1.0L", unit: "Per Bottle", price: "TBD", category: "Beverages" },
  { item: "Drinks Uplift for Cabin", unit: "Per Flight", price: "TBD", category: "Beverages" },
  { item: "Refreshment / Drink", unit: "Per Unit", price: "TBD", category: "Beverages" },
  { item: "ICE (kg)", unit: "Per KG", price: "TBD", category: "Beverages" },
  { item: "Hard Plastic Cups", unit: "Per Unit", price: "TBD", category: "Supplies" },
  { item: "Cartoon Cups", unit: "Per Unit", price: "TBD", category: "Supplies" },
  { item: "Perfumed Paper Towels", unit: "Per Unit", price: "TBD", category: "Supplies" },
  { item: "Paper Towels 33×33", unit: "Per Unit", price: "TBD", category: "Supplies" },
  { item: "Toilet Paper Rolls", unit: "Per Roll", price: "TBD", category: "Supplies" },
  { item: "Napkins", unit: "Per Unit", price: "TBD", category: "Supplies" },
  { item: "Cutlery 9×1", unit: "Per Set", price: "TBD", category: "Supplies" },
  { item: "Detergent", unit: "Per Unit", price: "TBD", category: "Supplies" },
  { item: "Extras", unit: "Per Unit", price: "TBD", category: "Supplies" },
  { item: "Catering Loading", unit: "Per Flight", price: "TBD", category: "Services" },
  { item: "Catering Transfer & Uplift", unit: "Per Flight", price: "TBD", category: "Services" },
];

// --- Fuel ---
export const fuelItems = [
  { grade: "Jet A-1 Fuel", unit: "Per Liter", price: "TBD", currency: "USD", notes: "Subject to market rates" },
  { grade: "Jet A-1 (Into-plane)", unit: "Per Liter", price: "TBD", currency: "USD", notes: "Includes dispensing fee" },
  { grade: "AVGAS 100LL", unit: "Per Liter", price: "TBD", currency: "USD", notes: "GA only" },
  { grade: "Fuel Stamp Duty", unit: "Per Liter", price: "TBD", currency: "USD", notes: "Government levy" },
  { grade: "Fuel Discount (USC/USG)", unit: "Per Gallon", price: "TBD", currency: "USD", notes: "Volume discount" },
  { grade: "Fuel Arrangement", unit: "Per Flight", price: "TBD", currency: "USD", notes: "Coordination fee" },
];

// --- Hotac (expanded: Passengers / Crew / VIP with room types) ---
export const hotacPassengers = [
  { category: "Passenger Hotel (3★)", sgl: "TBD", dbl: "TBD", tpl: "TBD", currency: "USD" },
  { category: "Passenger Hotel (4★)", sgl: "TBD", dbl: "TBD", tpl: "TBD", currency: "USD" },
  { category: "Passenger Hotel (5★)", sgl: "TBD", dbl: "TBD", tpl: "TBD", currency: "USD" },
];
export const hotacCrew = [
  { category: "Crew Hotel (3★)", sgl: "TBD", dbl: "TBD", tpl: "TBD", currency: "USD" },
  { category: "Crew Hotel (4★)", sgl: "TBD", dbl: "TBD", tpl: "TBD", currency: "USD" },
  { category: "Crew Hotel (5★)", sgl: "TBD", dbl: "TBD", tpl: "TBD", currency: "USD" },
];
export const hotacVip = [
  { category: "VIP Hotel (4★)", sgl: "TBD", dbl: "TBD", tpl: "TBD", currency: "USD" },
  { category: "VIP Hotel (5★)", sgl: "TBD", dbl: "TBD", tpl: "TBD", currency: "USD" },
];
export const hotacTransport = [
  { service: "Airport → Hotel", unit: "Per Trip", price: "TBD", currency: "USD" },
  { service: "Hotel → Airport", unit: "Per Trip", price: "TBD", currency: "USD" },
  { service: "Crew Per Diem", unit: "Per Day/Person", price: "TBD", currency: "USD" },
];

// --- Security (expanded) ---
export const securityItems = [
  { service: "Arrival Security", unit: "Per Flight", price: "TBD" },
  { service: "Departure Security", unit: "Per Flight", price: "TBD" },
  { service: "Turn Around Security", unit: "Per Flight", price: "TBD" },
  { service: "Ad-Hoc Security", unit: "Per Hour", price: "TBD" },
  { service: "Maintenance Security", unit: "Per Hour", price: "TBD" },
  { service: "Ramp Security Service", unit: "Per Flight", price: "TBD" },
  { service: "Ramp Extra Service", unit: "Per Hour", price: "TBD" },
  { service: "Passenger Security", unit: "Per Pax", price: "TBD" },
  { service: "Cargo Security", unit: "Per KG", price: "TBD" },
  { service: "Ramp / Terminal / Luggage Security", unit: "Per Flight", price: "TBD" },
  { service: "K9 Service", unit: "Per Flight", price: "TBD" },
];

// --- VIP Services (expanded) ---
export const vipItems = [
  { service: "VIP Lounge", unit: "Per Pax", price: "TBD", category: "Lounge" },
  { service: "MAAS Immigrations", unit: "Per Pax", price: "TBD", category: "Meet & Assist" },
  { service: "MAAS Customs", unit: "Per Pax", price: "TBD", category: "Meet & Assist" },
  { service: "Meet & Assist", unit: "Per Pax", price: "TBD", category: "Meet & Assist" },
  { service: "Visas Issued", unit: "Per Visa", price: "TBD", category: "Meet & Assist" },
  { service: "VIP Car", unit: "Per Trip", price: "TBD", category: "Transport" },
  { service: "Airport → Hotel (VIP)", unit: "Per Trip", price: "TBD", category: "Transport" },
  { service: "Hotel → Airport (VIP)", unit: "Per Trip", price: "TBD", category: "Transport" },
  { service: "Ahlan VIP Services", unit: "Per Pax", price: "TBD", category: "Premium" },
  { service: "Fast Track", unit: "Per Pax", price: "TBD", category: "Premium" },
  { service: "HALL 04 Services", unit: "Per Flight", price: "TBD", category: "Premium" },
  { service: "Open Hall 4", unit: "Per Flight", price: "TBD", category: "Premium" },
  { service: "Basic Ground Equipment (Marshalling + Chocks + 2 Crew Bus)", unit: "Per Flight", price: "TBD", category: "Ground" },
  { service: "Pax Bus", unit: "Per Unit", price: "TBD", category: "Ground" },
  { service: "GPU", unit: "Per Hour", price: "TBD", category: "Ground" },
];

// --- Overflying & Permits (expanded) ---
export const overflyItems = [
  { permit: "Over Flying Permits", unit: "Per Permit", price: "TBD", validity: "Single Use" },
  { permit: "Over Flying Amendments", unit: "Per Amendment", price: "TBD", validity: "Per Change" },
  { permit: "Over Fly Fine", unit: "Per Incident", price: "TBD", validity: "As Assessed" },
  { permit: "Application Stamp", unit: "Per Application", price: "TBD", validity: "Single Use" },
  { permit: "Block Permit", unit: "Per Block", price: "TBD", validity: "As Approved" },
  { permit: "Landing Permit (Commercial)", unit: "Per Landing", price: "TBD", validity: "Single Use" },
  { permit: "Landing Permit (Private/Charter)", unit: "Per Landing", price: "TBD", validity: "Single Use" },
  { permit: "Special Permit (Military/State)", unit: "Per Flight", price: "TBD", validity: "As Approved" },
  { permit: "Traffic Rights (T2)", unit: "Per Season", price: "TBD", validity: "IATA Season" },
];

// --- CAI Airport Suppliers ---
export interface AirportSupplier {
  service: string;
  suppliers: string[];
}

export const caiSuppliers: AirportSupplier[] = [
  { service: "Ground Handling", suppliers: ["EgyptAir Ground Handling", "Cairo Airport"] },
  { service: "Catering", suppliers: ["LSG Sky Chefs", "Egyptair Inflight Services (IFS)"] },
  { service: "Fuel", suppliers: ["Egypt Petroleum", "Avit"] },
  { service: "Hotac", suppliers: ["Hilton Cairo", "Concorde El Salam Hotel Cairo", "InterContinental Cairo", "Le Méridien Cairo", "Link Aero Trading", "Gulf Agency Co."] },
  { service: "VIP Services & Meet & Assist", suppliers: ["Le Passage Cairo", "EgyptAir", "Cairo Airport"] },
  { service: "Security", suppliers: ["Egyptian Aviation Agency", "Cairo Airport"] },
  { service: "Hall 4", suppliers: ["Link Aero Trading"] },
  { service: "Transportation", suppliers: ["Rimo Tours", "Gem Travel", "Cairo Airport Travel", "Family", "Orishift"] },
  { service: "Maintenance & Engineering", suppliers: ["EgyptAir Maintenance & Engineering"] },
];
