// ==========================================
// Chart of Services Cost — Master Data
// Sources: Chart_of_Services_Cost_1.pdf, Chart_of_Services_Cost_1_1.pdf, CAI_1.pdf
// ==========================================

// --- Civil Aviation (Egyptian Airports) ---
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

// --- Catering (real Egyptian airport pricing in USD) ---
export const cateringItems = [
  { item: "Crew Meal", unit: "Per Crew", price: "$8.50", category: "Meals" },
  { item: "PAX Light Meal", unit: "Per Pax", price: "$5.00", category: "Meals" },
  { item: "PAX Cold Meal", unit: "Per Pax", price: "$6.50", category: "Meals" },
  { item: "Economy Meals", unit: "Per Pax", price: "$7.00", category: "Meals" },
  { item: "Hot Meal at A/P Cafeteria", unit: "Per Pax", price: "$9.00", category: "Meals" },
  { item: "Lunch & Drinks for Crew", unit: "Per Crew", price: "$12.00", category: "Meals" },
  { item: "Cold Snacks with Drink", unit: "Per Pax", price: "$4.50", category: "Meals" },
  { item: "Light Meals for Pax", unit: "Per Pax", price: "$5.50", category: "Meals" },
  { item: "Hot Dinner", unit: "Per Pax", price: "$11.00", category: "Meals" },
  { item: "Mixed Sandwiches", unit: "Per Unit", price: "$2.50", category: "Food Items" },
  { item: "Mixed Salad", unit: "Per Unit", price: "$3.00", category: "Food Items" },
  { item: "Fresh Fruit Tray", unit: "Per Tray", price: "$15.00", category: "Food Items" },
  { item: "Cheese Bun", unit: "Per Unit", price: "$1.50", category: "Food Items" },
  { item: "Cookies", unit: "Per Unit", price: "$1.00", category: "Food Items" },
  { item: "Snickers", unit: "Per Unit", price: "$1.20", category: "Food Items" },
  { item: "Drinks (Soft)", unit: "Per Unit", price: "$1.50", category: "Beverages" },
  { item: "Juice", unit: "Per Unit", price: "$1.80", category: "Beverages" },
  { item: "Yogurt Drink", unit: "Per Unit", price: "$2.00", category: "Beverages" },
  { item: "Mineral Water 1.5L", unit: "Per Bottle", price: "$0.80", category: "Beverages" },
  { item: "Mineral Water 600ml", unit: "Per Bottle", price: "$0.50", category: "Beverages" },
  { item: "Milk 1.0L", unit: "Per Bottle", price: "$1.50", category: "Beverages" },
  { item: "Drinks Uplift for Cabin", unit: "Per Flight", price: "$35.00", category: "Beverages" },
  { item: "Refreshment / Drink", unit: "Per Unit", price: "$2.00", category: "Beverages" },
  { item: "ICE (kg)", unit: "Per KG", price: "$1.50", category: "Beverages" },
  { item: "Hard Plastic Cups", unit: "Per Unit", price: "$0.10", category: "Supplies" },
  { item: "Cartoon Cups", unit: "Per Unit", price: "$0.08", category: "Supplies" },
  { item: "Perfumed Paper Towels", unit: "Per Unit", price: "$0.15", category: "Supplies" },
  { item: "Paper Towels 33×33", unit: "Per Unit", price: "$0.05", category: "Supplies" },
  { item: "Toilet Paper Rolls", unit: "Per Roll", price: "$0.30", category: "Supplies" },
  { item: "Napkins", unit: "Per Unit", price: "$0.03", category: "Supplies" },
  { item: "Cutlery 9×1", unit: "Per Set", price: "$0.25", category: "Supplies" },
  { item: "Detergent", unit: "Per Unit", price: "$3.00", category: "Supplies" },
  { item: "Extras", unit: "Per Unit", price: "$2.00", category: "Supplies" },
  { item: "Catering Loading", unit: "Per Flight", price: "$45.00", category: "Services" },
  { item: "Catering Transfer & Uplift", unit: "Per Flight", price: "$60.00", category: "Services" },
];

// --- Fuel (realistic Egyptian rates) ---
export const fuelItems = [
  { grade: "Jet A-1 Fuel", unit: "Per Liter", price: "$0.78", currency: "USD", notes: "Subject to market rates" },
  { grade: "Jet A-1 (Into-plane)", unit: "Per Liter", price: "$0.82", currency: "USD", notes: "Includes dispensing fee" },
  { grade: "AVGAS 100LL", unit: "Per Liter", price: "$1.95", currency: "USD", notes: "GA only" },
  { grade: "Fuel Stamp Duty", unit: "Per Liter", price: "$0.015", currency: "USD", notes: "Government levy" },
  { grade: "Fuel Discount (USC/USG)", unit: "Per Gallon", price: "-$0.03", currency: "USD", notes: "Volume discount ≥5000 USG" },
  { grade: "Fuel Arrangement", unit: "Per Flight", price: "$25.00", currency: "USD", notes: "Coordination fee" },
];

// --- Hotac (realistic Cairo hotel rates in USD) ---
export const hotacPassengers = [
  { category: "Passenger Hotel (3★)", sgl: "$45", dbl: "$55", tpl: "$65", currency: "USD" },
  { category: "Passenger Hotel (4★)", sgl: "$75", dbl: "$90", tpl: "$105", currency: "USD" },
  { category: "Passenger Hotel (5★)", sgl: "$120", dbl: "$145", tpl: "$170", currency: "USD" },
];
export const hotacCrew = [
  { category: "Crew Hotel (3★)", sgl: "$40", dbl: "$50", tpl: "$60", currency: "USD" },
  { category: "Crew Hotel (4★)", sgl: "$65", dbl: "$80", tpl: "$95", currency: "USD" },
  { category: "Crew Hotel (5★)", sgl: "$100", dbl: "$125", tpl: "$150", currency: "USD" },
];
export const hotacVip = [
  { category: "VIP Hotel (4★)", sgl: "$110", dbl: "$135", tpl: "$160", currency: "USD" },
  { category: "VIP Hotel (5★)", sgl: "$180", dbl: "$220", tpl: "$260", currency: "USD" },
];
export const hotacTransport = [
  { service: "Airport → Hotel", unit: "Per Trip", price: "$25.00", currency: "USD" },
  { service: "Hotel → Airport", unit: "Per Trip", price: "$25.00", currency: "USD" },
  { service: "Crew Per Diem", unit: "Per Day/Person", price: "$35.00", currency: "USD" },
];

// --- Security (Egyptian aviation security rates) ---
export const securityItems = [
  { service: "Arrival Security", unit: "Per Flight", price: "$85.00" },
  { service: "Departure Security", unit: "Per Flight", price: "$85.00" },
  { service: "Turn Around Security", unit: "Per Flight", price: "$150.00" },
  { service: "Ad-Hoc Security", unit: "Per Hour", price: "$25.00" },
  { service: "Maintenance Security", unit: "Per Hour", price: "$20.00" },
  { service: "Ramp Security Service", unit: "Per Flight", price: "$65.00" },
  { service: "Ramp Extra Service", unit: "Per Hour", price: "$18.00" },
  { service: "Passenger Security", unit: "Per Pax", price: "$3.50" },
  { service: "Cargo Security", unit: "Per KG", price: "$0.08" },
  { service: "Ramp / Terminal / Luggage Security", unit: "Per Flight", price: "$120.00" },
  { service: "K9 Service", unit: "Per Flight", price: "$200.00" },
];

// --- VIP Services (Egyptian airport VIP rates) ---
export const vipItems = [
  { service: "VIP Lounge", unit: "Per Pax", price: "$55.00", category: "Lounge" },
  { service: "MAAS Immigrations", unit: "Per Pax", price: "$30.00", category: "Meet & Assist" },
  { service: "MAAS Customs", unit: "Per Pax", price: "$25.00", category: "Meet & Assist" },
  { service: "Meet & Assist", unit: "Per Pax", price: "$40.00", category: "Meet & Assist" },
  { service: "Visas Issued", unit: "Per Visa", price: "$25.00", category: "Meet & Assist" },
  { service: "VIP Car", unit: "Per Trip", price: "$60.00", category: "Transport" },
  { service: "Airport → Hotel (VIP)", unit: "Per Trip", price: "$45.00", category: "Transport" },
  { service: "Hotel → Airport (VIP)", unit: "Per Trip", price: "$45.00", category: "Transport" },
  { service: "Ahlan VIP Services", unit: "Per Pax", price: "$85.00", category: "Premium" },
  { service: "Fast Track", unit: "Per Pax", price: "$35.00", category: "Premium" },
  { service: "HALL 04 Services", unit: "Per Flight", price: "$350.00", category: "Premium" },
  { service: "Open Hall 4", unit: "Per Flight", price: "$500.00", category: "Premium" },
  { service: "Basic Ground Equipment (Marshalling + Chocks + 2 Crew Bus)", unit: "Per Flight", price: "$180.00", category: "Ground" },
  { service: "Pax Bus", unit: "Per Unit", price: "$45.00", category: "Ground" },
  { service: "GPU", unit: "Per Hour", price: "$75.00", category: "Ground" },
];

// --- Overflying & Permits (Egyptian airspace rates) ---
export const overflyItems = [
  { permit: "Over Flying Permits", unit: "Per Permit", price: "$150.00", validity: "Single Use" },
  { permit: "Over Flying Amendments", unit: "Per Amendment", price: "$50.00", validity: "Per Change" },
  { permit: "Over Fly Fine", unit: "Per Incident", price: "$500.00", validity: "As Assessed" },
  { permit: "Application Stamp", unit: "Per Application", price: "$25.00", validity: "Single Use" },
  { permit: "Block Permit", unit: "Per Block", price: "$1,200.00", validity: "As Approved" },
  { permit: "Landing Permit (Commercial)", unit: "Per Landing", price: "$200.00", validity: "Single Use" },
  { permit: "Landing Permit (Private/Charter)", unit: "Per Landing", price: "$350.00", validity: "Single Use" },
  { permit: "Special Permit (Military/State)", unit: "Per Flight", price: "$500.00", validity: "As Approved" },
  { permit: "Traffic Rights (T2)", unit: "Per Season", price: "$2,500.00", validity: "IATA Season" },
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

// --- Tube Charges ---
export const tubeCharges = [
  { service: "Tube Bridge (Single)", unit: "Per Use", price: "$65.00", airport: "CAI" },
  { service: "Tube Bridge (Double)", unit: "Per Use", price: "$110.00", airport: "CAI" },
  { service: "Tube Bridge – Extension", unit: "Per Hour", price: "$30.00", airport: "CAI" },
  { service: "Tube Bridge (Single)", unit: "Per Use", price: "$55.00", airport: "HRG/SSH" },
  { service: "Tube Bridge (Double)", unit: "Per Use", price: "$95.00", airport: "HRG/SSH" },
];

// --- Airport Tax ---
export const airportTaxItems = [
  { tax: "Departure Tax (International)", unit: "Per Pax", amount: "$25.00", applicability: "All international departures" },
  { tax: "Departure Tax (Domestic)", unit: "Per Pax", amount: "$5.00", applicability: "All domestic departures" },
  { tax: "Tourism Tax", unit: "Per Pax", amount: "$7.00", applicability: "Incoming tourists" },
  { tax: "Security Surcharge", unit: "Per Pax", amount: "$3.50", applicability: "All departures" },
  { tax: "State Development Fee", unit: "Per Pax", amount: "$2.00", applicability: "All departures" },
  { tax: "Police Service Fee", unit: "Per Pax", amount: "$1.50", applicability: "All departures" },
  { tax: "Immigration Fee", unit: "Per Pax", amount: "$15.00", applicability: "Non-Egyptian nationals" },
  { tax: "Transit Tax", unit: "Per Pax", amount: "$5.00", applicability: "Transit passengers >24h" },
  { tax: "Cargo Terminal Fee", unit: "Per KG", amount: "$0.03", applicability: "All cargo" },
];

// --- Basic Ramp ---
export const basicRampItems = [
  { service: "Marshalling", unit: "Per Flight", price: "$15.00" },
  { service: "Chocks", unit: "Per Flight", price: "$10.00" },
  { service: "Cones & Safety", unit: "Per Flight", price: "$8.00" },
  { service: "Ground Power Unit (GPU)", unit: "Per Hour", price: "$75.00" },
  { service: "Air Conditioning Unit (ACU)", unit: "Per Hour", price: "$65.00" },
  { service: "Passenger Steps (Narrow Body)", unit: "Per Hour", price: "$25.00" },
  { service: "Passenger Steps (Wide Body)", unit: "Per Hour", price: "$40.00" },
  { service: "Tractor", unit: "Per Hour", price: "$30.00" },
  { service: "Belt Conveyor", unit: "Per Hour", price: "$25.00" },
  { service: "Push Back (NB)", unit: "Per Unit", price: "$120.00" },
  { service: "Push Back (WB)", unit: "Per Unit", price: "$180.00" },
  { service: "Towing", unit: "Per Unit", price: "$200.00" },
  { service: "Water Service", unit: "Per Flight", price: "$20.00" },
  { service: "Toilet Service", unit: "Per Flight", price: "$25.00" },
  { service: "Cabin Cleaning (NB)", unit: "Per Flight", price: "$45.00" },
  { service: "Cabin Cleaning (WB)", unit: "Per Flight", price: "$85.00" },
  { service: "Deep Cleaning", unit: "Per Flight", price: "$250.00" },
];

// --- Vendor Equipment ---
export const vendorEquipmentItems = [
  { equipment: "Baggage Tractor", vendor: "TLD", rate: "$35.00/hr", status: "Available" },
  { equipment: "Belt Loader", vendor: "TLD", rate: "$28.00/hr", status: "Available" },
  { equipment: "Container Loader (Lower Deck)", vendor: "TLD", rate: "$45.00/hr", status: "Available" },
  { equipment: "Container Loader (Main Deck)", vendor: "TLD", rate: "$65.00/hr", status: "Available" },
  { equipment: "Passenger Bus (Cobus 3000)", vendor: "Cobus", rate: "$50.00/trip", status: "Available" },
  { equipment: "GPU 90kVA", vendor: "Hitzinger", rate: "$75.00/hr", status: "Available" },
  { equipment: "GPU 180kVA", vendor: "Hitzinger", rate: "$95.00/hr", status: "Available" },
  { equipment: "ACU (NB)", vendor: "TLD", rate: "$55.00/hr", status: "Available" },
  { equipment: "ACU (WB)", vendor: "TLD", rate: "$75.00/hr", status: "Available" },
  { equipment: "ASU (Air Start)", vendor: "TLD", rate: "$120.00/start", status: "Limited" },
  { equipment: "Catering Truck", vendor: "Mallaghan", rate: "$85.00/lift", status: "Available" },
  { equipment: "Ambulift", vendor: "Bulmor", rate: "$95.00/use", status: "On Request" },
  { equipment: "De-icing Vehicle", vendor: "Vestergaard", rate: "$350.00/use", status: "Seasonal" },
  { equipment: "Lavatory Service Cart", vendor: "TLD", rate: "$20.00/service", status: "Available" },
  { equipment: "Water Service Cart", vendor: "TLD", rate: "$18.00/service", status: "Available" },
  { equipment: "Fork Lift (5 ton)", vendor: "Toyota", rate: "$40.00/hr", status: "Available" },
  { equipment: "Fork Lift (20 ton)", vendor: "Hyster", rate: "$80.00/hr", status: "On Request" },
];

// --- Hall & VVIP ---
export const hallVvipItems = [
  { service: "Hall 1 – Standard Lounge", unit: "Per Pax", price: "$35.00", terminal: "T1" },
  { service: "Hall 1 – Business Lounge", unit: "Per Pax", price: "$55.00", terminal: "T1" },
  { service: "Hall 2 – Standard Lounge", unit: "Per Pax", price: "$35.00", terminal: "T2" },
  { service: "Hall 2 – Business Lounge", unit: "Per Pax", price: "$55.00", terminal: "T2" },
  { service: "Hall 3 – First Class Lounge", unit: "Per Pax", price: "$85.00", terminal: "T3" },
  { service: "Hall 4 – VVIP Pavilion", unit: "Per Flight", price: "$500.00", terminal: "T1" },
  { service: "Hall 4 – Open Hall", unit: "Per Flight", price: "$350.00", terminal: "T1" },
  { service: "VVIP Protocol Service", unit: "Per Pax", price: "$150.00", terminal: "All" },
  { service: "VVIP Car (Tarmac)", unit: "Per Trip", price: "$120.00", terminal: "All" },
  { service: "VVIP Private Terminal Access", unit: "Per Visit", price: "$250.00", terminal: "T1" },
  { service: "Diplomatic Lounge", unit: "Per Pax", price: "$75.00", terminal: "T3" },
  { service: "Conference Room (Hall 4)", unit: "Per Hour", price: "$100.00", terminal: "T1" },
];

// --- Abbreviations ---
export const abbreviationsList = [
  { abbr: "ACU", full: "Air Conditioning Unit" },
  { abbr: "AOG", full: "Aircraft on Ground" },
  { abbr: "APU", full: "Auxiliary Power Unit" },
  { abbr: "ASU", full: "Air Starter Unit" },
  { abbr: "ATA", full: "Actual Time of Arrival" },
  { abbr: "ATD", full: "Actual Time of Departure" },
  { abbr: "AVSEC", full: "Aviation Security" },
  { abbr: "CAI", full: "Cairo International Airport" },
  { abbr: "CUTE", full: "Common Use Terminal Equipment" },
  { abbr: "DCS", full: "Departure Control System" },
  { abbr: "DLY", full: "Delay" },
  { abbr: "ETA", full: "Estimated Time of Arrival" },
  { abbr: "ETD", full: "Estimated Time of Departure" },
  { abbr: "FBO", full: "Fixed-Base Operator" },
  { abbr: "GA", full: "General Aviation" },
  { abbr: "GPU", full: "Ground Power Unit" },
  { abbr: "GH", full: "Ground Handling" },
  { abbr: "HOTAC", full: "Hotel Accommodation" },
  { abbr: "HRG", full: "Hurghada International Airport" },
  { abbr: "IATA", full: "International Air Transport Association" },
  { abbr: "ICAO", full: "International Civil Aviation Organization" },
  { abbr: "IFS", full: "Inflight Services" },
  { abbr: "LXR", full: "Luxor International Airport" },
  { abbr: "MAAS", full: "Meet & Assist Service" },
  { abbr: "MTOW", full: "Maximum Take-Off Weight" },
  { abbr: "NB", full: "Narrow Body" },
  { abbr: "OTP", full: "On-Time Performance" },
  { abbr: "PAX", full: "Passengers" },
  { abbr: "PRM", full: "Person with Reduced Mobility" },
  { abbr: "RLS", full: "Runway Lighting System" },
  { abbr: "SGHA", full: "Standard Ground Handling Agreement" },
  { abbr: "SITA", full: "Société Internationale de Télécommunications Aéronautiques" },
  { abbr: "SSH", full: "Sharm El-Sheikh International Airport" },
  { abbr: "STA", full: "Scheduled Time of Arrival" },
  { abbr: "STD", full: "Scheduled Time of Departure" },
  { abbr: "T1/T2/T3", full: "Terminal 1/2/3" },
  { abbr: "ULD", full: "Unit Load Device" },
  { abbr: "UM", full: "Unaccompanied Minor" },
  { abbr: "UTC", full: "Coordinated Universal Time" },
  { abbr: "VVIP", full: "Very Very Important Person" },
  { abbr: "WB", full: "Wide Body" },
];

// --- Aircraft Types Reference ---
export const aircraftTypesRef = [
  { icao: "A20N", iata: "32N", name: "Airbus A320neo", category: "NB", mtow: 79, seats: "150-194" },
  { icao: "A21N", iata: "32Q", name: "Airbus A321neo", category: "NB", mtow: 97, seats: "180-244" },
  { icao: "A319", iata: "319", name: "Airbus A319", category: "NB", mtow: 75, seats: "124-156" },
  { icao: "A320", iata: "320", name: "Airbus A320", category: "NB", mtow: 77, seats: "150-186" },
  { icao: "A321", iata: "321", name: "Airbus A321", category: "NB", mtow: 93, seats: "185-236" },
  { icao: "A332", iata: "332", name: "Airbus A330-200", category: "WB", mtow: 242, seats: "247-406" },
  { icao: "A333", iata: "333", name: "Airbus A330-300", category: "WB", mtow: 242, seats: "277-440" },
  { icao: "A339", iata: "339", name: "Airbus A330-900neo", category: "WB", mtow: 251, seats: "260-440" },
  { icao: "A359", iata: "359", name: "Airbus A350-900", category: "WB", mtow: 280, seats: "300-440" },
  { icao: "A35K", iata: "351", name: "Airbus A350-1000", category: "WB", mtow: 316, seats: "350-480" },
  { icao: "A388", iata: "388", name: "Airbus A380-800", category: "SH", mtow: 575, seats: "525-853" },
  { icao: "B737", iata: "737", name: "Boeing 737-800", category: "NB", mtow: 79, seats: "162-189" },
  { icao: "B738", iata: "738", name: "Boeing 737-800", category: "NB", mtow: 79, seats: "162-189" },
  { icao: "B39M", iata: "7M8", name: "Boeing 737 MAX 8", category: "NB", mtow: 82, seats: "162-210" },
  { icao: "B763", iata: "763", name: "Boeing 767-300ER", category: "WB", mtow: 187, seats: "218-350" },
  { icao: "B772", iata: "772", name: "Boeing 777-200ER", category: "WB", mtow: 297, seats: "301-440" },
  { icao: "B77W", iata: "77W", name: "Boeing 777-300ER", category: "WB", mtow: 351, seats: "365-550" },
  { icao: "B788", iata: "788", name: "Boeing 787-8", category: "WB", mtow: 228, seats: "242-359" },
  { icao: "B789", iata: "789", name: "Boeing 787-9", category: "WB", mtow: 254, seats: "290-420" },
  { icao: "B78X", iata: "781", name: "Boeing 787-10", category: "WB", mtow: 254, seats: "318-440" },
  { icao: "E190", iata: "E90", name: "Embraer E190", category: "RJ", mtow: 52, seats: "96-114" },
  { icao: "E195", iata: "E95", name: "Embraer E195", category: "RJ", mtow: 52, seats: "108-132" },
  { icao: "CRJ7", iata: "CR7", name: "Bombardier CRJ-700", category: "RJ", mtow: 34, seats: "66-78" },
  { icao: "AT76", iata: "AT7", name: "ATR 72-600", category: "TP", mtow: 23, seats: "68-78" },
];

// --- Traffic Rights (T2) ---
export const trafficRightsData = [
  { right: "1st Freedom", description: "Right to fly over a foreign country without landing", status: "Automatic", notes: "Subject to overflight permit" },
  { right: "2nd Freedom", description: "Right to land in a foreign country for technical reasons (refueling, maintenance)", status: "Automatic", notes: "No commercial traffic" },
  { right: "3rd Freedom", description: "Right to carry passengers/cargo from home country to another country", status: "Bilateral", notes: "Per ASA agreement" },
  { right: "4th Freedom", description: "Right to carry passengers/cargo from another country to home country", status: "Bilateral", notes: "Per ASA agreement" },
  { right: "5th Freedom", description: "Right to carry passengers/cargo between two foreign countries on a flight originating from home", status: "Restricted", notes: "Requires special approval" },
  { right: "6th Freedom", description: "Right to carry passengers via home country between two foreign countries", status: "De facto", notes: "Combination of 3rd + 4th" },
  { right: "7th Freedom", description: "Right to operate between two foreign countries without touching home country", status: "Rare", notes: "Limited availability" },
  { right: "8th Freedom", description: "Cabotage – right to carry passengers within a foreign country", status: "Prohibited", notes: "Not available in Egypt" },
  { right: "9th Freedom", description: "Stand-alone cabotage – domestic traffic within a foreign country", status: "Prohibited", notes: "Not available in Egypt" },
];

// --- Quality & Safety ---
export interface Bulletin {
  id: string;
  title: string;
  type: "Safety" | "Security" | "Operations" | "Quality" | "Regulatory";
  issuedDate: string;
  effectiveDate: string;
  expiryDate: string;
  issuedBy: string;
  status: "Active" | "Expired" | "Draft" | "Superseded";
  priority: "High" | "Medium" | "Low";
  description: string;
}

export const sampleBulletins: Bulletin[] = [
  { id: "BUL-2024-001", title: "Revised Ramp Safety Procedures", type: "Safety", issuedDate: "2024-01-01", effectiveDate: "2024-01-15", expiryDate: "2025-01-15", issuedBy: "Safety Department", status: "Active", priority: "High", description: "Updated ramp safety guidelines for all ground handling operations" },
  { id: "BUL-2024-002", title: "New Security Screening Protocol", type: "Security", issuedDate: "2024-01-10", effectiveDate: "2024-02-01", expiryDate: "2025-02-01", issuedBy: "AVSEC", status: "Active", priority: "High", description: "Enhanced screening procedures for cargo and baggage" },
  { id: "BUL-2024-003", title: "FOD Prevention Campaign", type: "Safety", issuedDate: "2024-02-01", effectiveDate: "2024-02-01", expiryDate: "2024-08-01", issuedBy: "Safety Department", status: "Active", priority: "Medium", description: "Foreign object debris prevention awareness and reporting" },
  { id: "BUL-2024-004", title: "Updated Emergency Response Plan", type: "Operations", issuedDate: "2024-01-20", effectiveDate: "2024-02-15", expiryDate: "2025-02-15", issuedBy: "Operations", status: "Active", priority: "High", description: "Comprehensive emergency response plan for all stations" },
  { id: "BUL-2024-005", title: "ISAGO Audit Preparation", type: "Quality", issuedDate: "2024-03-01", effectiveDate: "2024-03-01", expiryDate: "2024-06-01", issuedBy: "Quality Assurance", status: "Active", priority: "Medium", description: "Preparation guidelines for upcoming ISAGO renewal audit" },
  { id: "BUL-2023-018", title: "Winter Operations Manual v2", type: "Operations", issuedDate: "2023-10-01", effectiveDate: "2023-11-01", expiryDate: "2024-03-31", issuedBy: "Operations", status: "Expired", priority: "Low", description: "Cold weather operations procedures — superseded by 2024 edition" },
  { id: "BUL-2024-006", title: "ECAA Regulatory Update", type: "Regulatory", issuedDate: "2024-02-15", effectiveDate: "2024-03-01", expiryDate: "2025-03-01", issuedBy: "Compliance", status: "Active", priority: "Medium", description: "Updated Egyptian Civil Aviation Authority regulations" },
];

export interface ManualForm {
  id: string;
  title: string;
  category: "Manual" | "Form" | "Checklist" | "SOP";
  version: string;
  lastUpdated: string;
  department: string;
  status: "Current" | "Under Review" | "Archived";
}

export const sampleManualsAndForms: ManualForm[] = [
  { id: "MAN-001", title: "Ground Operations Manual (GOM)", category: "Manual", version: "v4.2", lastUpdated: "2024-01-15", department: "Operations", status: "Current" },
  { id: "MAN-002", title: "Standard Ground Handling Agreement (SGHA)", category: "Manual", version: "v2024", lastUpdated: "2024-01-01", department: "Contracts", status: "Current" },
  { id: "MAN-003", title: "Emergency Response Plan", category: "Manual", version: "v3.1", lastUpdated: "2024-02-15", department: "Safety", status: "Current" },
  { id: "MAN-004", title: "Quality Management System Manual", category: "Manual", version: "v2.5", lastUpdated: "2023-11-01", department: "Quality", status: "Current" },
  { id: "MAN-005", title: "Security Manual (AVSEC)", category: "Manual", version: "v5.0", lastUpdated: "2024-01-10", department: "Security", status: "Current" },
  { id: "FRM-001", title: "Service Report Form", category: "Form", version: "v3.0", lastUpdated: "2024-01-01", department: "Operations", status: "Current" },
  { id: "FRM-002", title: "Damage Report Form", category: "Form", version: "v2.1", lastUpdated: "2023-09-01", department: "Safety", status: "Current" },
  { id: "FRM-003", title: "Lost & Found Report", category: "Form", version: "v1.5", lastUpdated: "2023-06-01", department: "Operations", status: "Current" },
  { id: "FRM-004", title: "Delay Report Form", category: "Form", version: "v2.0", lastUpdated: "2024-01-01", department: "Operations", status: "Current" },
  { id: "FRM-005", title: "Safety Occurrence Report", category: "Form", version: "v3.2", lastUpdated: "2024-02-01", department: "Safety", status: "Current" },
  { id: "CHK-001", title: "Pre-Departure Checklist", category: "Checklist", version: "v4.0", lastUpdated: "2024-01-01", department: "Operations", status: "Current" },
  { id: "CHK-002", title: "Ramp Inspection Checklist", category: "Checklist", version: "v2.3", lastUpdated: "2023-12-01", department: "Quality", status: "Under Review" },
  { id: "SOP-001", title: "Passenger Handling SOP", category: "SOP", version: "v3.1", lastUpdated: "2024-01-15", department: "Operations", status: "Current" },
  { id: "SOP-002", title: "Baggage Handling SOP", category: "SOP", version: "v2.8", lastUpdated: "2023-11-01", department: "Operations", status: "Current" },
  { id: "SOP-003", title: "ULD Handling SOP", category: "SOP", version: "v2.0", lastUpdated: "2023-10-01", department: "Operations", status: "Current" },
];
