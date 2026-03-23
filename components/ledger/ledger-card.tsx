import Link from "next/link";

type LedgerCardProps = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  currency: string;
  role: string;
  ownerName: string | null;
};

export function LedgerCard({ id, name, description, icon, currency, role, ownerName }: LedgerCardProps) {
  return (
    <Link href={`/dashboard/ledger/${id}`} className="ledger-link fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: 13 }}>{icon ?? "book"} · {currency}</p>
          <h3 style={{ margin: "8px 0 0", fontSize: 24 }}>{name}</h3>
        </div>
        <span className="badge">{role}</span>
      </div>
      <div className="soft-divider" />
      <p style={{ margin: 0, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{description || "还没有填写账本描述。"} </p>
      <p style={{ margin: 0, fontSize: 14 }} className="body-copy">Owner · {ownerName || "未知成员"}</p>
    </Link>
  );
}
