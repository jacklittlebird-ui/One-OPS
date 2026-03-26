import { CheckCircle, AlertTriangle, Clock, X } from "lucide-react";
import type { ContractStatus } from "./ContractTypes";

const statusConfig: Record<ContractStatus, { icon: React.ReactNode; cls: string }> = {
  Active:     { icon: <CheckCircle size={11} />, cls: "bg-success/15 text-success" },
  Expired:    { icon: <AlertTriangle size={11} />, cls: "bg-destructive/15 text-destructive" },
  Pending:    { icon: <Clock size={11} />, cls: "bg-warning/15 text-warning" },
  Terminated: { icon: <X size={11} />, cls: "bg-muted text-muted-foreground" },
};

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[status]?.cls || ""}`}>
      {statusConfig[status]?.icon}{status}
    </span>
  );
}

export function ContractTypeBadge({ type }: { type: string }) {
  const cls = type === "SGHA"
    ? "bg-primary/15 text-primary"
    : type === "Charter" || type === "Ad-Hoc"
    ? "bg-accent/15 text-accent-foreground"
    : "bg-secondary text-secondary-foreground";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {type}
    </span>
  );
}
