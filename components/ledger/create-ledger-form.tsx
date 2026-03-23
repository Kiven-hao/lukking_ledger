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
    <form ref={formRef} action={action} className="form-stack">
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.8fr 0.8fr", gap: 12 }}>
        <input name="name" placeholder="账本名称，例如：家庭账本" required className="field" />
        <input name="currency" placeholder="CNY" defaultValue="CNY" className="field" />
        <input name="icon" placeholder="book" defaultValue="book" className="field" />
      </div>
      <textarea
        name="description"
        placeholder="描述一下这个账本的用途"
        rows={3}
        className="field-area"
      />
      {state.error ? <p className="alert-error">{state.error}</p> : null}
      {state.success ? <p className="alert-success">账本创建成功，列表已刷新。</p> : null}
      <button type="submit" disabled={pending} className="button-primary">
        {pending ? "创建中..." : "新建账本"}
      </button>
    </form>
  );
}
