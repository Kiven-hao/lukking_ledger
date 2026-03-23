type TransactionItem = {
  id: string;
  amount: number;
  type: "expense" | "income" | "transfer";
  note: string | null;
  occurred_at: string;
  tags: string[] | null;
  category_name: string;
  creator_name: string;
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function TransactionList({ items, currency }: { items: TransactionItem[]; currency: string }) {
  if (items.length === 0) {
    return (
      <div className="panel" style={{ padding: 22 }}>
        <p style={{ margin: 0, color: "var(--muted-foreground)" }}>还没有交易记录，先录入第一笔吧。</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {items.map((item) => (
        <article key={item.id} className="panel" style={{ padding: 20, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: 13 }}>
                {item.category_name} · {new Date(item.occurred_at).toLocaleString("zh-CN")}
              </p>
              <h3 style={{ margin: "8px 0 0", fontSize: 20 }}>{item.note || "未填写备注"}</h3>
            </div>
            <strong style={{ fontSize: 22, color: item.type === "income" ? "#15803d" : item.type === "expense" ? "#b45309" : "#475569" }}>
              {item.type === "expense" ? "-" : item.type === "income" ? "+" : ""}{formatCurrency(item.amount, currency)}
            </strong>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, color: "var(--muted-foreground)", fontSize: 14 }}>
            <span>记录人：{item.creator_name}</span>
            <span>类型：{item.type}</span>
            {item.tags?.length ? <span>标签：{item.tags.join(" / ")}</span> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
