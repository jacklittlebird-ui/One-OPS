import { hallVvipItems } from "@/data/servicesData";
import { Crown } from "lucide-react";

export default function HallVVIPPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Crown size={22} className="text-primary" /> Hall & VVIP Services</h1>
        <p className="text-muted-foreground text-sm mt-1">Lounge, VVIP pavilion, and premium terminal services</p>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr>{["SERVICE", "UNIT", "PRICE (USD)", "TERMINAL"].map(h => <th key={h} className="data-table-header px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {hallVvipItems.map((r, i) => (
                <tr key={i} className="data-table-row">
                  <td className="px-4 py-2.5 font-semibold text-foreground">{r.service}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.unit}</td>
                  <td className="px-4 py-2.5 font-semibold text-success">{r.price}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground">{r.terminal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
