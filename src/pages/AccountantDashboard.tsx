import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign, TrendingUp, FileText, Receipt, Building2,
  ArrowRight, CheckCircle2, Clock, AlertTriangle, BookOpen, Users,
  ArrowUpRight, ArrowDownRight, BarChart3, Wallet, CreditCard, PiggyBank
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
  AreaChart, Area, ComposedChart,
} from "recharts";

type InvoiceRow = { id: string; invoice_no: string; operator: string; date: string; due_date: string; total: number; status: string; currency: string; invoice_type: string; civil_aviation: number; handling: number; airport_charges: number; catering: number; other: number; vat: number; };
type VendorInvoiceRow = { id: string; invoice_no: string; vendor_name: string; total: number; status: string; date: string; };
type JournalEntry = { id: string; entry_no: string; status: string; total_debit: number; entry_date: string; };

export default function AccountantDashboard() {
  const navigate = useNavigate();

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => { const { data } = await supabase.from("invoices").select("*").order("date", { ascending: false }); return (data || []) as InvoiceRow[]; },
  });

  const { data: vendorInvoices = [] } = useQuery({
    queryKey: ["vendor_invoices"],
    queryFn: async () => { const { data } = await supabase.from("vendor_invoices").select("*").order("date", { ascending: false }); return (data || []) as VendorInvoiceRow[]; },
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ["journal_entries"],
    queryFn: async () => { const { data } = await supabase.from("journal_entries").select("id,entry_no,status,total_debit,entry_date").order("entry_date", { ascending: false }); return (data || []) as JournalEntry[]; },
  });

  // KPIs
  const totalRevenue = invoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalPaid = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + (i.total || 0), 0);
  const totalPending = invoices.filter(i => i.status === "Sent" || i.status === "Draft").reduce((s, i) => s + (i.total || 0), 0);
  const totalOverdue = invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + (i.total || 0), 0);
  const vendorUnpaid = vendorInvoices.filter(v => v.status !== "Paid").reduce((s, v) => s + (v.total || 0), 0);
  const vendorPaid = vendorInvoices.filter(v => v.status === "Paid").reduce((s, v) => s + (v.total || 0), 0);
  const netPosition = totalPaid - vendorPaid;
  const collectionRate = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;
  const finalizedCount = invoices.filter(i => i.invoice_type === "Final").length;
  const avgInvoiceValue = invoices.length > 0 ? Math.round(totalRevenue / invoices.length) : 0;

  const stats = [
    { label: "Total Revenue", value: `$${(totalRevenue / 1000).toFixed(0)}K`, sub: `${invoices.length} invoices`, icon: <DollarSign size={18} />, color: "bg-primary", link: "/invoices", trend: "up" },
    { label: "Collected", value: `$${(totalPaid / 1000).toFixed(0)}K`, sub: `${invoices.filter(i => i.status === "Paid").length} paid`, icon: <CheckCircle2 size={18} />, color: "bg-success", link: "/invoices", trend: "up" },
    { label: "Pending", value: `$${(totalPending / 1000).toFixed(0)}K`, sub: "Draft + Sent", icon: <Clock size={18} />, color: "bg-warning", link: "/invoices", trend: null },
    { label: "Overdue", value: `$${(totalOverdue / 1000).toFixed(0)}K`, sub: `${invoices.filter(i => i.status === "Overdue").length} invoices`, icon: <AlertTriangle size={18} />, color: "bg-destructive", link: "/aging-reports", trend: totalOverdue > 0 ? "down" : "up" },
    { label: "Vendor Payables", value: `$${(vendorUnpaid / 1000).toFixed(0)}K`, sub: `${vendorInvoices.filter(v => v.status !== "Paid").length} unpaid`, icon: <Building2 size={18} />, color: "bg-info", link: "/vendor-invoices", trend: null },
    { label: "Net Position", value: `$${(netPosition / 1000).toFixed(0)}K`, sub: "Collected - Paid out", icon: <PiggyBank size={18} />, color: "bg-emerald", link: "/financial-reports", trend: netPosition > 0 ? "up" : "down" },
    { label: "Collection Rate", value: `${collectionRate}%`, sub: "Paid / Total", icon: <BarChart3 size={18} />, color: "bg-violet", link: "/invoices", trend: collectionRate >= 70 ? "up" : "down" },
    { label: "Journal Entries", value: String(journalEntries.length), sub: `${journalEntries.filter(j => j.status === "Posted").length} posted`, icon: <BookOpen size={18} />, color: "bg-cyan", link: "/journal-entries", trend: null },
  ];

  // Invoice status pie
  const invoiceStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    invoices.forEach(i => { counts[i.status] = (counts[i.status] || 0) + 1; });
    const colors: Record<string, string> = { Paid: "hsl(152, 60%, 45%)", Sent: "hsl(210, 80%, 55%)", Overdue: "hsl(0, 84%, 60%)", Draft: "hsl(215, 16%, 47%)", Cancelled: "hsl(30, 80%, 55%)" };
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: colors[name] || "hsl(215, 16%, 47%)" }));
  }, [invoices]);

  // Revenue breakdown by charge type
  const revenueBreakdown = useMemo(() => {
    const civil = invoices.reduce((s, i) => s + (i.civil_aviation || 0), 0);
    const handling = invoices.reduce((s, i) => s + (i.handling || 0), 0);
    const airport = invoices.reduce((s, i) => s + (i.airport_charges || 0), 0);
    const catering = invoices.reduce((s, i) => s + (i.catering || 0), 0);
    const other = invoices.reduce((s, i) => s + (i.other || 0), 0);
    const vat = invoices.reduce((s, i) => s + (i.vat || 0), 0);
    return [
      { name: "Civil Aviation", value: civil, fill: "hsl(210, 80%, 55%)" },
      { name: "Handling", value: handling, fill: "hsl(243, 55%, 45%)" },
      { name: "Airport Charges", value: airport, fill: "hsl(152, 60%, 45%)" },
      { name: "Catering", value: catering, fill: "hsl(38, 92%, 50%)" },
      { name: "Other", value: other, fill: "hsl(270, 60%, 55%)" },
      { name: "VAT", value: vat, fill: "hsl(0, 84%, 60%)" },
    ].filter(d => d.value > 0);
  }, [invoices]);

  // Revenue by operator (top 8)
  const revenueByAirline = useMemo(() => {
    const map: Record<string, number> = {};
    invoices.forEach(i => { map[i.operator] = (map[i.operator] || 0) + (i.total || 0); });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([airline, revenue]) => ({ airline, revenue }));
  }, [invoices]);

  // Monthly revenue & expenses (last 6 months)
  const monthlyData = useMemo(() => {
    const months: Record<string, { revenue: number; expenses: number; profit: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = { revenue: 0, expenses: 0, profit: 0 };
    }
    invoices.forEach(i => { const key = i.date?.slice(0, 7); if (months[key]) months[key].revenue += i.total || 0; });
    vendorInvoices.forEach(v => { const key = v.date?.slice(0, 7); if (months[key]) months[key].expenses += v.total || 0; });
    return Object.entries(months).map(([key, val]) => {
      const d = new Date(key + "-01");
      return { month: d.toLocaleString("en", { month: "short" }), ...val, profit: val.revenue - val.expenses };
    });
  }, [invoices, vendorInvoices]);

  // Vendor payment status
  const vendorStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    vendorInvoices.forEach(v => { counts[v.status] = (counts[v.status] || 0) + 1; });
    const colors: Record<string, string> = { Paid: "hsl(152, 60%, 45%)", Pending: "hsl(38, 92%, 50%)", Overdue: "hsl(0, 84%, 60%)", Draft: "hsl(215, 16%, 47%)" };
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: colors[name] || "hsl(215, 16%, 47%)" }));
  }, [vendorInvoices]);

  const recentInvoices = invoices.slice(0, 8);

  const invoiceStatusColor: Record<string, string> = {
    "Paid": "bg-success/15 text-success",
    "Sent": "bg-info/15 text-info",
    "Overdue": "bg-destructive/15 text-destructive",
    "Draft": "bg-muted text-muted-foreground",
    "Cancelled": "bg-warning/15 text-warning",
  };

  const quickLinks = [
    { label: "Invoices", icon: <FileText size={16} />, path: "/invoices", color: "bg-primary" },
    { label: "Chart of Accounts", icon: <BookOpen size={16} />, path: "/chart-of-accounts", color: "bg-info" },
    { label: "Journal Entries", icon: <Receipt size={16} />, path: "/journal-entries", color: "bg-warning" },
    { label: "Aging Reports", icon: <AlertTriangle size={16} />, path: "/aging-reports", color: "bg-destructive" },
    { label: "Financial Reports", icon: <TrendingUp size={16} />, path: "/financial-reports", color: "bg-success" },
    { label: "Vendor Invoices", icon: <Building2 size={16} />, path: "/vendor-invoices", color: "bg-violet" },
    { label: "Contracts", icon: <CreditCard size={16} />, path: "/contracts", color: "bg-orange" },
    { label: "Services", icon: <Wallet size={16} />, path: "/services", color: "bg-cyan" },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Cards - 8 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {stats.map(s => (
          <button key={s.label} onClick={() => navigate(s.link)} className="stat-card flex-col items-start gap-2 text-left hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <div className={`stat-card-icon ${s.color} !w-8 !h-8`}>{s.icon}</div>
              {s.trend && (
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${s.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {s.trend === "up" ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                </span>
              )}
            </div>
            <div>
              <div className="text-xl font-bold text-foreground leading-tight">{s.value}</div>
              <div className="text-[10px] font-semibold text-foreground">{s.label}</div>
              <div className="text-[9px] text-muted-foreground">{s.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue vs Expenses + Profit area */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-success" /> Revenue vs Expenses (6 months)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
              <Area type="monotone" dataKey="profit" fill="hsl(var(--success))" fillOpacity={0.1} stroke="none" name="Profit" />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ fill: "hsl(var(--success))", r: 3 }} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ fill: "hsl(var(--destructive))", r: 3 }} strokeDasharray="5 5" name="Expenses" />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Airline */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <Building2 size={14} className="text-primary" /> Revenue by Airline
          </h3>
          {revenueByAirline.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByAirline} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="airline" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">No invoice data</div>}
        </div>
      </div>

      {/* Charts Row 2 - 3 smaller charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Invoice Status */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <FileText size={14} className="text-info" /> Invoice Status
          </h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={invoiceStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={32} strokeWidth={2} stroke="hsl(var(--card))">
                {invoiceStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <DollarSign size={14} className="text-emerald" /> Revenue Breakdown
          </h3>
          {revenueBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={revenueBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={32} strokeWidth={2} stroke="hsl(var(--card))">
                  {revenueBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[170px] text-muted-foreground text-xs">No data</div>}
        </div>

        {/* Vendor Status */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <Building2 size={14} className="text-orange" /> Vendor Payments
          </h3>
          {vendorStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={vendorStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={32} strokeWidth={2} stroke="hsl(var(--card))">
                  {vendorStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[170px] text-muted-foreground text-xs">No vendor data</div>}
        </div>
      </div>

      {/* Invoices Table + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><FileText size={16} className="text-primary" /> Recent Invoices</h2>
            <button onClick={() => navigate("/invoices")} className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["INVOICE", "OPERATOR", "AMOUNT", "DATE", "TYPE", "STATUS"].map(h => (
                    <th key={h} className="data-table-header px-3 py-2.5 text-left whitespace-nowrap text-[11px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentInvoices.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <FileText size={32} className="mx-auto mb-2 text-muted-foreground/30" />
                    <p className="font-semibold text-foreground text-sm">No invoices yet</p>
                  </td></tr>
                ) : recentInvoices.map(inv => (
                  <tr key={inv.id} className="data-table-row cursor-pointer hover:bg-muted/50" onClick={() => navigate("/invoices")}>
                    <td className="px-3 py-2 font-semibold text-foreground text-xs">{inv.invoice_no}</td>
                    <td className="px-3 py-2 text-foreground text-xs">{inv.operator}</td>
                    <td className="px-3 py-2 font-semibold text-foreground text-xs">${(inv.total || 0).toLocaleString()}</td>
                    <td className="px-3 py-2 text-muted-foreground text-xs">{inv.date}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${inv.invoice_type === "Final" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                        {inv.invoice_type || "Preliminary"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${invoiceStatusColor[inv.status] || ""}`}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><DollarSign size={16} className="text-primary" /> Quick Actions</h2>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {quickLinks.map(ql => (
              <button key={ql.label} onClick={() => navigate(ql.path)} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg text-white font-semibold text-[10px] transition-all hover:opacity-90 hover:scale-[1.02] ${ql.color}`}>
                {ql.icon}
                {ql.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
