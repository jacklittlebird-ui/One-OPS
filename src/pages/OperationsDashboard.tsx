import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Plane, Building2, CheckCircle2, XCircle, Timer, Clock,
  ArrowRight, AlertTriangle, Users, Globe, FileBarChart2,
  TrendingUp, BarChart3, Luggage, MapPin, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

type FlightRow = { id: string; flight_no: string; airline: string; origin: string; destination: string; arrival: string; departure: string; status: string; flight_type: string; aircraft: string; terminal: string; days: string; };
type ServiceReportRow = { id: string; operator: string; flight_no: string; handling_type: string; arrival_date: string | null; departure_date: string | null; total_cost: number; pax_in_adult_i: number; pax_in_adult_d: number; pax_in_inf_i: number; pax_in_inf_d: number; pax_transit: number; station: string; day_night: string; };
type StaffRow = { id: string; name: string; status: string; shift: string; department: string; };

export default function OperationsDashboard() {
  const navigate = useNavigate();

  const { data: flights = [] } = useQuery({
    queryKey: ["flight_schedules"],
    queryFn: async () => { const { data } = await supabase.from("flight_schedules").select("*").order("departure", { ascending: true }); return (data || []) as FlightRow[]; },
  });

  const { data: reports = [] } = useQuery({
    queryKey: ["service_reports_dash"],
    queryFn: async () => { const { data } = await supabase.from("service_reports").select("id,operator,flight_no,handling_type,arrival_date,departure_date,total_cost,pax_in_adult_i,pax_in_adult_d,pax_in_inf_i,pax_in_inf_d,pax_transit,station,day_night").order("created_at", { ascending: false }).limit(200); return (data || []) as ServiceReportRow[]; },
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["staff_dash"],
    queryFn: async () => { const { data } = await supabase.from("staff_roster").select("id,name,status,shift,department").limit(500); return (data || []) as StaffRow[]; },
  });

  const { data: clearances = [] } = useQuery({
    queryKey: ["clearances_dash"],
    queryFn: async () => { const { data } = await supabase.from("clearances").select("id,status").limit(500); return (data || []) as { id: string; status: string }[]; },
  });

  // KPIs
  const totalFlights = flights.length;
  const scheduled = flights.filter(f => f.status === "Scheduled").length;
  const completed = flights.filter(f => f.status === "Completed").length;
  const delayed = flights.filter(f => f.status === "Delayed").length;
  const cancelled = flights.filter(f => f.status === "Cancelled").length;
  const uniqueAirlines = new Set(flights.map(f => f.airline)).size;
  const totalPax = reports.reduce((s, r) => s + (r.pax_in_adult_i || 0) + (r.pax_in_adult_d || 0) + (r.pax_in_inf_i || 0) + (r.pax_in_inf_d || 0) + (r.pax_transit || 0), 0);
  const totalRevenue = reports.reduce((s, r) => s + (r.total_cost || 0), 0);
  const otpRate = totalFlights > 0 ? Math.round(((completed + scheduled) / totalFlights) * 100) : 0;
  const activeStaff = staff.filter(s => s.status === "Active").length;
  const pendingClearances = clearances.filter(c => c.status === "Pending").length;

  const stats = [
    { label: "Total Flights", value: String(totalFlights), sub: `${scheduled} scheduled`, icon: <Plane size={18} />, color: "bg-primary", link: "/flight-schedule", trend: null },
    { label: "Active Airlines", value: String(uniqueAirlines), sub: "Unique operators", icon: <Building2 size={18} />, color: "bg-info", link: "/airlines", trend: null },
    { label: "OTP Rate", value: `${otpRate}%`, sub: `${completed} completed`, icon: <CheckCircle2 size={18} />, color: "bg-success", link: "/flight-schedule", trend: otpRate >= 85 ? "up" : "down" },
    { label: "Delayed", value: String(delayed), sub: `${totalFlights > 0 ? Math.round(delayed / totalFlights * 100) : 0}% of flights`, icon: <Timer size={18} />, color: "bg-warning", link: "/delay-codes", trend: delayed > 0 ? "down" : "up" },
    { label: "Total PAX", value: totalPax.toLocaleString(), sub: "From service reports", icon: <Users size={18} />, color: "bg-violet", link: "/service-report", trend: null },
    { label: "Handling Rev.", value: `$${(totalRevenue / 1000).toFixed(0)}K`, sub: `${reports.length} reports`, icon: <TrendingUp size={18} />, color: "bg-emerald", link: "/service-report", trend: "up" },
    { label: "Active Staff", value: String(activeStaff), sub: `${staff.length} total`, icon: <Users size={18} />, color: "bg-cyan", link: "/staff-roster", trend: null },
    { label: "Clearances", value: String(pendingClearances), sub: "Pending approval", icon: <Globe size={18} />, color: "bg-orange", link: "/clearances", trend: pendingClearances > 5 ? "down" : "up" },
  ];

  // Flight status donut
  const flightStatusData = useMemo(() => {
    const colors: Record<string, string> = { Scheduled: "hsl(210, 80%, 55%)", Completed: "hsl(152, 60%, 45%)", Delayed: "hsl(38, 92%, 50%)", Cancelled: "hsl(0, 84%, 60%)" };
    return ["Scheduled", "Completed", "Delayed", "Cancelled"]
      .map(s => ({ name: s, value: flights.filter(f => f.status === s).length, fill: colors[s] }))
      .filter(s => s.value > 0);
  }, [flights]);

  // Flight type distribution
  const flightTypeData = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    flights.forEach(f => { const t = f.flight_type || "Scheduled"; typeCounts[t] = (typeCounts[t] || 0) + 1; });
    const fills = ["hsl(243, 55%, 45%)", "hsl(210, 80%, 55%)", "hsl(152, 60%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(270, 60%, 55%)"];
    return Object.entries(typeCounts).slice(0, 6).map(([name, value], i) => ({ name, value, fill: fills[i % fills.length] }));
  }, [flights]);

  // Handling type radar
  const handlingRadar = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => { counts[r.handling_type] = (counts[r.handling_type] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([type, count]) => ({ type, count }));
  }, [reports]);

  // Day vs Night operations
  const dayNightData = useMemo(() => {
    let day = 0, night = 0;
    reports.forEach(r => { if (r.day_night === "Night") night++; else day++; });
    return [
      { name: "Day", value: day, fill: "hsl(45, 93%, 47%)" },
      { name: "Night", value: night, fill: "hsl(243, 55%, 35%)" },
    ].filter(d => d.value > 0);
  }, [reports]);

  // Airline activity top 8
  const airlineActivity = useMemo(() => {
    const map: Record<string, { flights: number; pax: number; revenue: number }> = {};
    flights.forEach(f => {
      if (!map[f.airline]) map[f.airline] = { flights: 0, pax: 0, revenue: 0 };
      map[f.airline].flights++;
    });
    reports.forEach(r => {
      if (!map[r.operator]) map[r.operator] = { flights: 0, pax: 0, revenue: 0 };
      map[r.operator].pax += (r.pax_in_adult_i || 0) + (r.pax_in_adult_d || 0);
      map[r.operator].revenue += r.total_cost || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].flights - a[1].flights).slice(0, 8)
      .map(([name, v]) => ({ name, ...v }));
  }, [flights, reports]);

  // Staff by shift
  const shiftData = useMemo(() => {
    const counts: Record<string, number> = {};
    staff.filter(s => s.status === "Active").forEach(s => { counts[s.shift] = (counts[s.shift] || 0) + 1; });
    const fills: Record<string, string> = { Morning: "hsl(45, 93%, 47%)", Afternoon: "hsl(25, 90%, 55%)", Night: "hsl(243, 55%, 45%)", Split: "hsl(152, 60%, 45%)", Off: "hsl(215, 16%, 47%)" };
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: fills[name] || "hsl(215, 16%, 47%)" }));
  }, [staff]);

  const recentFlights = flights.slice(0, 8);

  const statusColor: Record<string, string> = {
    "Completed": "bg-success/15 text-success",
    "Scheduled": "bg-info/15 text-info",
    "Delayed": "bg-warning/15 text-warning",
    "Cancelled": "bg-destructive/15 text-destructive",
  };

  const quickLinks = [
    { label: "Flight Schedule", icon: <Plane size={16} />, path: "/flight-schedule", color: "bg-primary" },
    { label: "Overfly Schedule", icon: <Globe size={16} />, path: "/overfly-schedule", color: "bg-info" },
    { label: "Service Report", icon: <FileBarChart2 size={16} />, path: "/service-report", color: "bg-success" },
    { label: "Delay Codes", icon: <Clock size={16} />, path: "/delay-codes", color: "bg-warning" },
    { label: "Clearances", icon: <Globe size={16} />, path: "/clearances", color: "bg-violet" },
    { label: "Staff Roster", icon: <Users size={16} />, path: "/staff-roster", color: "bg-cyan" },
    { label: "Airlines", icon: <Building2 size={16} />, path: "/airlines", color: "bg-orange" },
    { label: "Lost & Found", icon: <Luggage size={16} />, path: "/lost-found", color: "bg-rose" },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Cards - 8 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {stats.map(s => (
          <button key={s.label} onClick={() => navigate(s.link)} className="stat-card flex-col items-start gap-2 text-left hover:shadow-md transition-all cursor-pointer group">
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

      {/* Charts Row 1 - 4 charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Flight Status Donut */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <Timer size={14} className="text-warning" /> Flight Status
          </h3>
          {flightStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={flightStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={32} strokeWidth={2} stroke="hsl(var(--card))">
                  {flightStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[170px] text-muted-foreground text-xs">No flights</div>}
        </div>

        {/* Flight Type */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <Plane size={14} className="text-info" /> Flight Types
          </h3>
          {flightTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={flightTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={32} strokeWidth={2} stroke="hsl(var(--card))">
                  {flightTypeData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[170px] text-muted-foreground text-xs">No data</div>}
        </div>

        {/* Day vs Night */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <Clock size={14} className="text-amber" /> Day vs Night Ops
          </h3>
          {dayNightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={dayNightData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={32} strokeWidth={2} stroke="hsl(var(--card))">
                  {dayNightData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[170px] text-muted-foreground text-xs">No reports</div>}
        </div>

        {/* Staff by Shift */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <Users size={14} className="text-cyan" /> Staff by Shift
          </h3>
          {shiftData.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={shiftData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={32} strokeWidth={2} stroke="hsl(var(--card))">
                  {shiftData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[170px] text-muted-foreground text-xs">No staff data</div>}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Airlines bar chart */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <Building2 size={14} className="text-primary" /> Airline Activity
          </h3>
          {airlineActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={airlineActivity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="flights" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Flights" />
                <Bar dataKey="pax" fill="hsl(var(--info))" radius={[0, 4, 4, 0]} name="PAX" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">No data</div>}
        </div>

        {/* Handling type radar */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <FileBarChart2 size={14} className="text-violet" /> Handling Type Distribution
          </h3>
          {handlingRadar.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={handlingRadar}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="type" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="Reports" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">No service reports</div>}
        </div>
      </div>

      {/* Recent Flights Table + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><Plane size={16} className="text-primary" /> Recent Flights</h2>
            <button onClick={() => navigate("/flight-schedule")} className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["FLIGHT", "AIRLINE", "ROUTE", "DEP", "ARR", "TYPE", "TERMINAL", "STATUS"].map(h => (
                    <th key={h} className="data-table-header px-3 py-2.5 text-left whitespace-nowrap text-[11px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentFlights.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">
                    <Plane size={32} className="mx-auto mb-2 text-muted-foreground/30" />
                    <p className="font-semibold text-foreground text-sm">No flights in schedule</p>
                    <p className="text-xs">Add flights to see them here</p>
                  </td></tr>
                ) : recentFlights.map(f => (
                  <tr key={f.id} className="data-table-row cursor-pointer hover:bg-muted/50" onClick={() => navigate("/flight-schedule")}>
                    <td className="px-3 py-2 font-semibold text-foreground text-xs">{f.flight_no}</td>
                    <td className="px-3 py-2 text-foreground text-xs">{f.airline}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{f.origin} → {f.destination}</td>
                    <td className="px-3 py-2 text-foreground text-xs">{f.departure}</td>
                    <td className="px-3 py-2 text-foreground text-xs">{f.arrival}</td>
                    <td className="px-3 py-2 text-[10px] text-muted-foreground">{f.flight_type || "Scheduled"}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{f.terminal || "—"}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor[f.status] || "bg-muted text-muted-foreground"}`}>{f.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><BarChart3 size={16} className="text-primary" /> Quick Actions</h2>
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
