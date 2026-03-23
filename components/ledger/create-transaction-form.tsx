"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createTransactionAction, type ActionState } from "@/app/actions/ledger";

type CategoryItem = {
  id: string;
  name: string;
  type: "expense" | "income" | "transfer";
};

const initialState: ActionState = { error: null };

export function CreateTransactionForm({
  ledgerId,
  categories,
}: {
  ledgerId: string;
  categories: CategoryItem[];
}) {
  const [state, action, pending] = useActionState(createTransactionAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const defaultOccurredAt = useMemo(() => new Date().toISOString().slice(0, 16), []);
  const [type, setType] = useState<"expense" | "income" | "transfer">("expense");

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => category.type === type);
  }, [categories, type]);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setType("expense");
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="grid" style={{ gap: 14 }}>
      <input type="hidden" name="ledger_id" value={ledgerId} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", gap: 12 }}>
        <select
          name="type"
          value={type}
          onChange={(event) => setType(event.target.value as "expense" | "income" | "transfer")}
          className="panel"
          style={{ padding: "14px 16px", background: "white" }}
        >
          <option value="expense">支出</option>
          <option value="income">收入</option>
          <option value="transfer">转账</option>
        </select>
        <input name="amount" type="number" step="0.01" min="0.01" placeholder="金额" required className="panel" style={{ padding: "14px 16px", background: "white" }} />
        <select name="category_id" defaultValue="" className="panel" style={{ padding: "14px 16px", background: "white" }}>
          <option value="">未分类</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} · {category.type}
            </option>
          ))}
        </select>
        <input
          name="occurred_at"
          type="datetime-local"
          defaultValue={defaultOccurredAt}
          className="panel"
          style={{ padding: "14px 16px", background: "white" }}
        />
      </div>
      <input name="note" placeholder="备注，例如：午餐、打车、工资发放" className="panel" style={{ padding: "14px 16px", background: "white" }} />
      <input name="tags" placeholder="标签，使用英文逗号分隔，例如：工作日,外卖" className="panel" style={{ padding: "14px 16px", background: "white" }} />
      {state.error ? <p style={{ margin: 0, color: "#b42318" }}>{state.error}</p> : null}
      {state.success ? <p style={{ margin: 0, color: "var(--accent)" }}>交易已新增，列表已刷新。</p> : null}
      <button type="submit" disabled={pending} className="panel" style={{ padding: "14px 18px", background: "var(--accent)", color: "var(--accent-foreground)", cursor: "pointer" }}>
        {pending ? "保存中..." : "新增交易"}
      </button>
    </form>
  );
}
