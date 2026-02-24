import { airportTaxItems } from "@/data/servicesData";
import { Receipt } from "lucide-react";

export default function AirportTaxPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Receipt size={22} className="text-primary" /> Airport Tax</h1>
        <p className="text-muted-foreground text-sm mt-1">Egyptian airport taxes, levies, and government fees</p>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr>{["TAX / FEE", "UNIT", "AMOUNT (USD)", "APPLICABILITY"].map(h => <th key={h} className="data-table-header px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {airportTaxItems.map((r, i) => (
                <tr key={i} className="data-table-row">
                  <td className="px-4 py-2.5 font-semibold text-foreground">{r.tax}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.unit}</td>
                  <td className="px-4 py-2.5 font-semibold text-success">{r.amount}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.applicability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
