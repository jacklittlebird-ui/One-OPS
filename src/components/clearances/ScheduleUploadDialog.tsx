import { useState, useRef, useCallback, useMemo } from "react";
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ParsedFlight, parseScheduleData, readFileAsRows } from "@/lib/scheduleParser";
import { CLEARANCE_TYPES } from "@/components/clearances/ClearanceTypes";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function ScheduleUploadDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"upload" | "preview" | "importing">("upload");
  const [flights, setFlights] = useState<ParsedFlight[]>([]);
  const [format, setFormat] = useState("");
  const [unmatchedCount, setUnmatchedCount] = useState(0);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [dragging, setDragging] = useState(false);

  const { data: airports } = useQuery({
    queryKey: ["airports-iata-upload"],
    queryFn: async () => {
      const { data } = await supabase.from("airports").select("id,iata_code,name,city");
      return data || [];
    },
  });

  const { data: airlines } = useQuery({
    queryKey: ["airlines-upload"],
    queryFn: async () => {
      const { data } = await supabase.from("airlines").select("id,name,code,iata_code");
      return data || [];
    },
  });

  const stationCodes = useMemo(
    () => (airports || []).map((a: any) => a.iata_code?.toUpperCase()).filter(Boolean),
    [airports]
  );

  const processFile = useCallback(async (file: File) => {
    if (!selectedAirline) {
      toast({ title: "Airline required", description: "Please select an airline before uploading.", variant: "destructive" });
      return;
    }
    if (!selectedStation) {
      toast({ title: "Station required", description: "Please select a station before uploading.", variant: "destructive" });
      return;
    }

    setFileName(file.name);
    try {
      const rows = await readFileAsRows(file);
      if (rows.length === 0) {
        toast({ title: "Empty file", description: "No data rows found.", variant: "destructive" });
        return;
      }
      const result = parseScheduleData(rows, stationCodes);
      // Apply selected airline to all parsed flights
      const airlineObj = (airlines || []).find((a: any) => a.id === selectedAirline);
      const airlineName = airlineObj?.name || "";
      const enriched = result.flights.map(f => ({
        ...f,
        airline_name: f.airline_name || airlineName,
        matched_station: f.matched_station || selectedStation,
        station_role: f.station_role || ("turnaround" as const),
      }));
      setFlights(enriched);
      setFormat(result.format);
      setUnmatchedCount(enriched.filter(f => !f.matched_station).length);
      setStep("preview");
    } catch (err: any) {
      toast({ title: "Parse Error", description: err.message, variant: "destructive" });
    }
  }, [stationCodes, selectedAirline, selectedStation, airlines]);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = "";
  }, [processFile]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  }, [processFile]);

  const updateFlight = (idx: number, key: keyof ParsedFlight, value: any) => {
    setFlights(prev => prev.map((f, i) => i === idx ? { ...f, [key]: value } : f));
  };

  const removeFlight = (idx: number) => {
    setFlights(prev => prev.filter((_, i) => i !== idx));
  };

  const handleImport = async () => {
    if (flights.length === 0) return;
    setImporting(true);
    setStep("importing");

    try {
      const records = flights.map(f => ({
        flight_no: f.flight_no,
        airline_id: selectedAirline || null,
        route: f.route,
        aircraft_type: f.aircraft_type,
        registration: f.registration,
        sta: f.sta,
        std: f.std,
        arrival_date: f.arrival_date || null,
        departure_date: f.departure_date || null,
        passengers: f.passengers,
        cargo_kg: f.cargo_kg,
        week_days: f.week_days,
        skd_type: f.skd_type,
        clearance_type: f.clearance_type,
        permit_no: f.permit_no,
        handling_agent: f.handling_agent,
        config: f.config,
        authority: f.matched_station || selectedStation,
        status: "Pending" as const,
        purpose: "Scheduled",
      }));

      const { error } = await supabase.from("flight_schedules").insert(records);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["flight_schedules"] });
      toast({ title: "✅ Import Complete", description: `${records.length} flight records imported successfully.` });
      handleClose();
    } catch (err: any) {
      toast({ title: "Import Error", description: err.message, variant: "destructive" });
      setStep("preview");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setStep("upload");
    setFlights([]);
    setFormat("");
    setUnmatchedCount(0);
    setFileName("");
    setSelectedAirline("");
    setSelectedStation("");
    onOpenChange(false);
  };

  const formatBadges = [
    { label: "Excel (.xlsx)", ext: ".xlsx" },
    { label: "Word (.docx)", ext: ".docx" },
    { label: "PDF (.pdf)", ext: ".pdf" },
    { label: "CSV (.csv)", ext: ".csv" },
  ];

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-primary" />
            Import Schedule
          </DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="flex flex-col gap-5">
            {/* Airline & Station selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Airline <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedAirline} onValueChange={setSelectedAirline}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select airline" />
                  </SelectTrigger>
                  <SelectContent>
                    {(airlines || []).map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.iata_code ? `${a.iata_code} — ` : ""}{a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Station <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedStation} onValueChange={setSelectedStation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {(airports || []).map((a: any) => (
                      <SelectItem key={a.id} value={a.iata_code?.toUpperCase() || a.id}>
                        {a.iata_code} — {a.name}{a.city ? `, ${a.city}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-lg py-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <Upload size={28} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop a file or click to browse
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {formatBadges.map(b => (
                  <Badge key={b.ext} variant="outline" className="text-xs font-normal">
                    {b.label}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-md mt-1">
                Supports both clearance formats (Flight No, Route, STA, STD) and traffic report formats (FltId, DepStn, ArrStn, DatOp)
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv,.docx,.pdf,.txt,.tsv"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        )}

        {step === "preview" && (
          <>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <Badge variant="outline" className="gap-1">
                <FileSpreadsheet size={12} /> {fileName}
              </Badge>
              <Badge variant="secondary">
                Format: {format === "traffic" ? "Traffic Report" : format === "clearance" ? "Clearance" : "Auto"}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 size={12} /> {flights.length} records
              </Badge>
              {unmatchedCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle size={12} /> {unmatchedCount} unmatched stations
                </Badge>
              )}
            </div>

            <ScrollArea className="flex-1 max-h-[50vh] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Flight</TableHead>
                    <TableHead>Airline</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>A/C Type</TableHead>
                    <TableHead>Reg</TableHead>
                    <TableHead>STA</TableHead>
                    <TableHead>STD</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flights.map((f, i) => (
                    <TableRow key={i} className={!f.matched_station ? "bg-warning/5" : ""}>
                      <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-mono font-medium text-sm">{f.flight_no}</TableCell>
                      <TableCell className="text-xs">{f.airline_name || "—"}</TableCell>
                      <TableCell className="font-mono text-xs">{f.route}</TableCell>
                      <TableCell>
                        {f.matched_station ? (
                          <Badge variant="outline" className="text-xs">{f.matched_station}</Badge>
                        ) : (
                          <Select value={f.matched_station || "none"} onValueChange={v => {
                            const station = v === "none" ? "" : v;
                            const role = station === f.origin.toUpperCase() ? "departure" : station === f.destination.toUpperCase() ? "arrival" : "turnaround";
                            updateFlight(i, "matched_station", station);
                            updateFlight(i, "station_role", role);
                          }}>
                            <SelectTrigger className="h-7 text-xs w-24">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">—</SelectItem>
                              {stationCodes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {f.station_role || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{f.aircraft_type || "—"}</TableCell>
                      <TableCell className="text-xs font-mono">{f.registration || "—"}</TableCell>
                      <TableCell className="text-xs">{f.sta || "—"}</TableCell>
                      <TableCell className="text-xs">{f.std || "—"}</TableCell>
                      <TableCell className="text-xs">{f.arrival_date || f.departure_date || "—"}</TableCell>
                      <TableCell>
                        <Select value={f.clearance_type} onValueChange={v => updateFlight(i, "clearance_type", v)}>
                          <SelectTrigger className="h-7 text-xs w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CLEARANCE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeFlight(i)}>
                          <X size={12} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <div className="flex justify-between items-center pt-3 border-t">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setStep("upload"); setFlights([]); }}>
                  Re-upload
                </Button>
                <Button onClick={handleImport} disabled={flights.length === 0}>
                  <Upload size={14} className="mr-2" />
                  Import {flights.length} Records
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "importing" && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 size={40} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Importing {flights.length} records…</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
