"use client";

import { useActionState, useEffect, useRef } from "react";
import { createLedgerAction, type ActionState } from "@/app/actions/ledger";

const initialState: ActionState = { error: null };

export function CreateLedgerForm() {
  const [state, action, pending] = useActionState(createLedgerAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="grid" style={{ gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.8fr", gap: 12 }}>
        <input name="name" placeholder="账本名称，例如：家庭账本" required className="panel" style={{ padding: "14px 16px", background: "white" }} />
        <input name="currency" placeholder="CNY" defaultValue="CNY" className="panel" style={{ padding: "14px 16px", background: "white" }} />
        <input name="icon" placeholder="book" defaultValue="book" className="panel" style={{ padding: "14px 16px", background: "white" }} />
      </div>
      <textarea
        name="description"
        placeholder="描述一下这个账本的用途"
        rows={3}
        className="panel"
        style={{ padding: "14px 16px", background: "white", resize: "vertical" }}
      />
      {state.error ? <p style={{ margin: 0, color: "#b42318" }}>{state.error}</p> : null}
      {state.success ? <p style={{ margin: 0, color: "var(--accent)" }}>账本创建成功，列表已刷新。</p> : null}
      <button type="submit" disabled={pending} className="panel" style={{ padding: "14px 18px", background: "var(--accent)", color: "var(--accent-foreground)", cursor: "pointer" }}>
        {pending ? "创建中..." : "新建账本"}
      </button>
    </form>
  );
}
