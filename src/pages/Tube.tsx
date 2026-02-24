import { tubeCharges } from "@/data/servicesData";
import { Building2 } from "lucide-react";

export default function TubePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Building2 size={22} className="text-primary" /> Tube Bridge Charges</h1>
        <p className="text-muted-foreground text-sm mt-1">Jetway / tube bridge usage fees by airport</p>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr>{["SERVICE", "UNIT", "PRICE (USD)", "AIRPORT"].map(h => <th key={h} className="data-table-header px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {tubeCharges.map((r, i) => (
                <tr key={i} className="data-table-row">
                  <td className="px-4 py-2.5 font-semibold text-foreground">{r.service}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.unit}</td>
                  <td className="px-4 py-2.5 font-semibold text-success">{r.price}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground">{r.airport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
