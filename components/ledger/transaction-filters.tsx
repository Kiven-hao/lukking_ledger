"use client";

import { useMemo, useState } from "react";

type CategoryItem = {
  id: string;
  name: string;
  type: "expense" | "income" | "transfer";
};

export function TransactionFilters({
  categories,
  currentType,
  currentCategoryId,
  currentStart,
  currentEnd,
  currentKeyword,
}: {
  categories: CategoryItem[];
  currentType: string;
  currentCategoryId: string;
  currentStart: string;
  currentEnd: string;
  currentKeyword: string;
}) {
  const [type, setType] = useState(currentType);

  const filteredCategories = useMemo(() => {
    if (!type) return categories;
    return categories.filter((category) => category.type === type);
  }, [categories, type]);

  return (
    <form method="GET" className="grid" style={{ gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1.2fr", gap: 12 }}>
        <select
          name="type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="panel"
          style={{ padding: "14px 16px", background: "white" }}
        >
          <option value="">全部类型</option>
          <option value="expense">支出</option>
          <option value="income">收入</option>
          <option value="transfer">转账</option>
        </select>
        <select
          name="category_id"
          defaultValue={currentCategoryId}
          className="panel"
          style={{ padding: "14px 16px", background: "white" }}
        >
          <option value="">全部分类</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input name="start" type="date" defaultValue={currentStart} className="panel" style={{ padding: "14px 16px", background: "white" }} />
        <input name="end" type="date" defaultValue={currentEnd} className="panel" style={{ padding: "14px 16px", background: "white" }} />
        <input
          name="keyword"
          type="text"
          defaultValue={currentKeyword}
          placeholder="按备注关键字搜索"
          className="panel"
          style={{ padding: "14px 16px", background: "white" }}
        />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button type="submit" className="panel" style={{ padding: "12px 16px", background: "var(--accent)", color: "var(--accent-foreground)", cursor: "pointer" }}>
          应用筛选
        </button>
        <a href="?" className="panel" style={{ padding: "12px 16px" }}>
          重置条件
        </a>
      </div>
    </form>
  );
}
