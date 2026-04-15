import * as XLSX from "xlsx";
import * as mammoth from "mammoth";

export type ParsedFlight = {
  flight_no: string;
  airline_name: string;
  route: string;
  origin: string;
  destination: string;
  aircraft_type: string;
  registration: string;
  sta: string;
  std: string;
  arrival_date: string;
  departure_date: string;
  passengers: number;
  cargo_kg: number;
  week_days: string;
  skd_type: string;
  clearance_type: string;
  permit_no: string;
  handling_agent: string;
  config: number;
  matched_station: string;
  station_role: "arrival" | "departure" | "turnaround" | "";
  _raw: Record<string, any>;
};

type FormatType = "clearance" | "traffic" | "unknown";

const CLEARANCE_HEADERS = ["flight no", "route", "sta", "std", "a/c type", "aircraft type", "permit"];
const TRAFFIC_HEADERS = ["fltid", "depstn", "arrstn", "datop", "fltno"];

function detectFormat(headers: string[]): FormatType {
  const lower = headers.map(h => h.toLowerCase().trim());
  const trafficScore = TRAFFIC_HEADERS.filter(h => lower.some(l => l.includes(h))).length;
  const clearanceScore = CLEARANCE_HEADERS.filter(h => lower.some(l => l.includes(h))).length;
  if (trafficScore >= 2) return "traffic";
  if (clearanceScore >= 2) return "clearance";
  return "unknown";
}

function col(row: Record<string, any>, ...keys: string[]): string {
  for (const k of keys) {
    for (const rk of Object.keys(row)) {
      if (rk.toLowerCase().trim() === k.toLowerCase()) return String(row[rk] ?? "").trim();
    }
  }
  return "";
}

function colNum(row: Record<string, any>, ...keys: string[]): number {
  const v = col(row, ...keys);
  return Number(v) || 0;
}

function normalizeDate(val: string): string {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0, 10);
  const dmy = val.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  const num = Number(val);
  if (num > 30000 && num < 100000) {
    const d = new Date((num - 25569) * 86400 * 1000);
    return d.toISOString().slice(0, 10);
  }
  return val;
}

function matchStations(
  origin: string,
  destination: string,
  stationCodes: string[]
): { matched_station: string; station_role: ParsedFlight["station_role"] } {
  const o = origin.toUpperCase();
  const d = destination.toUpperCase();
  const oMatch = stationCodes.includes(o);
  const dMatch = stationCodes.includes(d);
  if (oMatch && dMatch) return { matched_station: o, station_role: "turnaround" };
  if (dMatch) return { matched_station: d, station_role: "arrival" };
  if (oMatch) return { matched_station: o, station_role: "departure" };
  return { matched_station: "", station_role: "" };
}

function autoServiceType(role: ParsedFlight["station_role"]): string {
  if (role === "arrival") return "Arrival Handling";
  if (role === "departure") return "Departure Handling";
  return "Full Handling";
}

function parseClearanceRow(row: Record<string, any>, stationCodes: string[]): ParsedFlight[] {
  const flightNo = col(row, "Flight No", "Flight", "flight_no", "FLIGHT", "FltNo");
  if (!flightNo) return [];

  const route = col(row, "Route", "ROUTE", "route");
  const parts = route.split(/[-\/]/).map(s => s.trim().toUpperCase());
  const origin = parts[0] || col(row, "Origin", "DepStn", "DEP");
  const destination = parts[1] || col(row, "Destination", "ArrStn", "ARR");
  const stationMatch = matchStations(origin, destination, stationCodes);

  return [{
    flight_no: flightNo,
    airline_name: col(row, "Airline", "Operator", "airline", "Account"),
    route: route || `${origin}-${destination}`,
    origin, destination,
    aircraft_type: col(row, "A/C Type", "Aircraft Type", "aircraft_type", "AcType"),
    registration: col(row, "Reg No", "Registration", "REG", "registration"),
    sta: col(row, "STA", "sta"),
    std: col(row, "STD", "std"),
    arrival_date: normalizeDate(col(row, "Arrival Date", "arrival_date", "Date")),
    departure_date: normalizeDate(col(row, "Departure Date", "departure_date", "Date")),
    passengers: colNum(row, "PAX", "passengers", "Pax"),
    cargo_kg: colNum(row, "Cargo", "cargo_kg"),
    week_days: col(row, "Days", "week_days", "WeekDays"),
    skd_type: col(row, "Skd Type", "SKD", "skd_type"),
    clearance_type: col(row, "Service Type", "Type", "clearance_type") || autoServiceType(stationMatch.station_role),
    permit_no: col(row, "Permit No", "permit_no", "Permit"),
    handling_agent: col(row, "Handling Agent", "handling_agent", "Handling"),
    config: colNum(row, "Config", "config"),
    ...stationMatch,
    _raw: row,
  }];
}

function parseTrafficRow(row: Record<string, any>, stationCodes: string[]): ParsedFlight[] {
  const flightNo = col(row, "FltId", "FltNo", "Flight No", "FlightId", "FLIGHT");
  if (!flightNo) return [];

  const origin = col(row, "DepStn", "DEP", "Origin").toUpperCase();
  const destination = col(row, "ArrStn", "ARR", "Destination").toUpperCase();
  const date = normalizeDate(col(row, "DatOp", "Date", "FlightDate", "DateOp"));
  const acType = col(row, "AcType", "A/C Type", "Aircraft", "ACType");
  const reg = col(row, "Registration", "Reg", "REG", "AcReg");
  const pax = colNum(row, "Pax", "PAX", "PaxTotal");
  const airline = col(row, "Airline", "Operator", "Carrier");

  const results: ParsedFlight[] = [];
  const oMatch = stationCodes.includes(origin);
  const dMatch = stationCodes.includes(destination);

  const base: Omit<ParsedFlight, "matched_station" | "station_role" | "clearance_type"> = {
    flight_no: flightNo,
    airline_name: airline,
    route: `${origin}-${destination}`,
    origin, destination,
    aircraft_type: acType,
    registration: reg,
    sta: col(row, "STA", "ArrTime", "sta"),
    std: col(row, "STD", "DepTime", "std"),
    arrival_date: date,
    departure_date: date,
    passengers: pax,
    cargo_kg: colNum(row, "Cargo", "cargo_kg"),
    week_days: "",
    skd_type: "",
    permit_no: "",
    handling_agent: "",
    config: 0,
    _raw: row,
  };

  if (oMatch && dMatch) {
    results.push({ ...base, matched_station: origin, station_role: "departure", clearance_type: "Departure Handling" });
    results.push({ ...base, matched_station: destination, station_role: "arrival", clearance_type: "Arrival Handling" });
  } else if (dMatch) {
    results.push({ ...base, matched_station: destination, station_role: "arrival", clearance_type: "Arrival Handling" });
  } else if (oMatch) {
    results.push({ ...base, matched_station: origin, station_role: "departure", clearance_type: "Departure Handling" });
  } else {
    results.push({ ...base, matched_station: "", station_role: "", clearance_type: "Full Handling" });
  }

  return results;
}

export function parseScheduleData(
  rows: Record<string, any>[],
  stationCodes: string[]
): { flights: ParsedFlight[]; format: FormatType; unmatchedCount: number } {
  if (rows.length === 0) return { flights: [], format: "unknown", unmatchedCount: 0 };

  const headers = Object.keys(rows[0]);
  const format = detectFormat(headers);
  const parser = format === "traffic" ? parseTrafficRow : parseClearanceRow;
  const codes = stationCodes.map(s => s.toUpperCase());

  const flights: ParsedFlight[] = [];
  for (const row of rows) {
    flights.push(...parser(row, codes));
  }

  const unmatchedCount = flights.filter(f => !f.matched_station).length;
  return { flights, format, unmatchedCount };
}

// ─── HTML table parser (for DOCX output) ─────────────────────────
function parseHtmlTables(html: string): Record<string, any>[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const tables = doc.querySelectorAll("table");
  const rows: Record<string, any>[] = [];

  for (const table of Array.from(tables)) {
    const trs = table.querySelectorAll("tr");
    if (trs.length < 2) continue;

    // First row as headers
    const headers = Array.from(trs[0].querySelectorAll("th, td")).map(
      (cell) => (cell.textContent || "").trim()
    );
    if (headers.length === 0) continue;

    for (let i = 1; i < trs.length; i++) {
      const cells = Array.from(trs[i].querySelectorAll("td, th"));
      const row: Record<string, any> = {};
      headers.forEach((h, j) => {
        row[h] = (cells[j]?.textContent || "").trim();
      });
      rows.push(row);
    }
  }

  return rows;
}

// ─── Plain text table parser (tab/pipe/multi-space delimited) ────
function parseTextTable(text: string): Record<string, any>[] {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // Detect delimiter
  const firstLine = lines[0];
  let delimiter: RegExp;
  if (firstLine.includes("\t")) {
    delimiter = /\t+/;
  } else if (firstLine.includes("|")) {
    delimiter = /\s*\|\s*/;
  } else {
    delimiter = /\s{2,}/;
  }

  const headers = firstLine.split(delimiter).map(h => h.trim()).filter(Boolean);
  if (headers.length < 2) return [];

  const rows: Record<string, any>[] = [];
  for (let i = 1; i < lines.length; i++) {
    // Skip separator lines
    if (/^[-=|+\s]+$/.test(lines[i])) continue;
    const cells = lines[i].split(delimiter).map(c => c.trim());
    if (cells.length < 2) continue;
    const row: Record<string, any> = {};
    headers.forEach((h, j) => {
      row[h] = cells[j] || "";
    });
    rows.push(row);
  }

  return rows;
}

// ─── PDF text extraction ──────────────────────────────────────────
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  
  // Set worker to empty to use fake worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = "";
  
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const textParts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ");
    textParts.push(pageText);
  }

  return textParts.join("\n");
}

// ─── Main file reader (supports xlsx, xls, csv, docx, pdf, txt) ─
export async function readFileAsRows(file: File): Promise<Record<string, any>[]> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "csv") {
    const text = await file.text();
    const wb = XLSX.read(text, { type: "string" });
    return XLSX.utils.sheet_to_json<Record<string, any>>(wb.Sheets[wb.SheetNames[0]]);
  }

  if (ext === "xlsx" || ext === "xls") {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });
    return XLSX.utils.sheet_to_json<Record<string, any>>(wb.Sheets[wb.SheetNames[0]]);
  }

  if (ext === "docx") {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const html = result.value;
    // Try HTML tables first
    const tableRows = parseHtmlTables(html);
    if (tableRows.length > 0) return tableRows;
    // Fallback: extract plain text and try to parse as delimited
    const textResult = await mammoth.extractRawText({ arrayBuffer: buffer });
    return parseTextTable(textResult.value);
  }

  if (ext === "pdf") {
    const buffer = await file.arrayBuffer();
    const text = await extractPdfText(buffer);
    const rows = parseTextTable(text);
    if (rows.length > 0) return rows;
    throw new Error("Could not extract tabular data from PDF. Try converting to Excel or CSV first.");
  }

  if (ext === "txt" || ext === "tsv") {
    const text = await file.text();
    const rows = parseTextTable(text);
    if (rows.length > 0) return rows;
    // Try as CSV fallback
    const wb = XLSX.read(text, { type: "string" });
    return XLSX.utils.sheet_to_json<Record<string, any>>(wb.Sheets[wb.SheetNames[0]]);
  }

  throw new Error(`Unsupported file format: .${ext}. Please use Excel (.xlsx), CSV, Word (.docx), PDF, or text files.`);
}
