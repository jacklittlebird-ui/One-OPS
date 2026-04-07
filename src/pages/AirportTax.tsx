import { useState } from "react";
import { Receipt, Download, Pencil, Plus, Trash2, Save, X } from "lucide-react";
import { useSupabaseTable } from "@/hooks/useSupabaseQuery";
import { exportToExcel } from "@/lib/exportExcel";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Row = { id: string; tax: string; unit: string; amount: string; applicability: string };

export default function AirportTaxPage() {
  const { data, isLoading } = useSupabaseTable<Row>("airport_tax", { orderBy: "created_at", ascending: true });
  const queryClient = useQueryClient();
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ tax: "", unit: "", amount: "", applicability: "" });

  const handleExport = () => exportToExcel(data.map(r => ({ "Tax/Fee": r.tax, Unit: r.unit, "Amount (USD)": r.amount, Applicability: r.applicability })), "Departure Tax", "Link_Departure_Tax.xlsx");

  const openEdit = (r: Row) => { setEditRow(r); setIsNew(false); setForm({ tax: r.tax, unit: r.unit, amount: r.amount, applicability: r.applicability }); };
  const openNew = () => { setEditRow({} as Row); setIsNew(true); setForm({ tax: "", unit: "", amount: "", applicability: "" }); };

  const handleSave = async () => {
    if (!form.tax.trim()) { toast.error("Tax/Fee name is required"); return; }
    if (isNew) {
      const { error } = await supabase.from("airport_tax").insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success("Record added");
    } else {
      const { error } = await supabase.from("airport_tax").update(form).eq("id", editRow!.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Record updated");
    }
    queryClient.invalidateQueries({ queryKey: ["airport_tax"] });
    setEditRow(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("airport_tax").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Record deleted");
    queryClient.invalidateQueries({ queryKey: ["airport_tax"] });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Receipt size={22} className="text-primary" /> Departure Tax</h1><p className="text-muted-foreground text-sm mt-1">Egyptian departure taxes, levies, and government fees</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={openNew}><Plus size={14} className="mr-1" /> Add</Button>
          <Button variant="outline" size="sm" onClick={handleExport}><Download size={14} className="mr-1" /> Export</Button>
        </div>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr>{["TAX / FEE", "UNIT", "AMOUNT (USD)", "APPLICABILITY", ""].map(h => <th key={h} className="data-table-header px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody>{isLoading ? <tr><td colSpan={5} className="text-center py-16 text-muted-foreground">Loading…</td></tr> : data.map(r => (
          <tr key={r.id} className="data-table-row">
            <td className="px-4 py-2.5 font-semibold text-foreground">{r.tax}</td>
            <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.unit}</td>
            <td className="px-4 py-2.5 font-semibold text-success">{r.amount}</td>
            <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.applicability}</td>
            <td className="px-4 py-2.5 text-right">
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(r)}><Pencil size={13} /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(r.id)}><Trash2 size={13} /></Button>
              </div>
            </td>
          </tr>
        ))}</tbody></table></div></div>

      <Dialog open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isNew ? "Add Tax/Fee" : "Edit Tax/Fee"}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Tax / Fee</Label><Input value={form.tax} onChange={e => setForm(f => ({ ...f, tax: e.target.value }))} /></div>
            <div><Label>Unit</Label><Input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} /></div>
            <div><Label>Amount (USD)</Label><Input value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
            <div><Label>Applicability</Label><Input value={form.applicability} onChange={e => setForm(f => ({ ...f, applicability: e.target.value }))} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditRow(null)}><X size={14} className="mr-1" /> Cancel</Button>
              <Button onClick={handleSave}><Save size={14} className="mr-1" /> Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
