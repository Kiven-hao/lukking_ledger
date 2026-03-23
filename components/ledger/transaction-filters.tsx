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
    <form method="GET" className="form-stack">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1.2fr", gap: 12 }}>
        <select
          name="type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="field-select"
        >
          <option value="">全部类型</option>
          <option value="expense">支出</option>
          <option value="income">收入</option>
          <option value="transfer">转账</option>
        </select>
        <select
          name="category_id"
          defaultValue={currentCategoryId}
          className="field-select"
        >
          <option value="">全部分类</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input name="start" type="date" defaultValue={currentStart} className="field" />
        <input name="end" type="date" defaultValue={currentEnd} className="field" />
        <input
          name="keyword"
          type="text"
          defaultValue={currentKeyword}
          placeholder="按备注关键字搜索"
          className="field"
        />
      </div>
      <div className="button-row">
        <button type="submit" className="button-primary">
          应用筛选
        </button>
        <a href="?" className="button-secondary">
          重置条件
        </a>
      </div>
    </form>
  );
}
