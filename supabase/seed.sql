INSERT INTO public.categories (ledger_id, name, icon, color, type, sort_order, is_system)
SELECT
  l.id,
  seed.name,
  seed.icon,
  seed.color,
  seed.type::public.category_type,
  seed.sort_order,
  TRUE
FROM public.ledgers l
CROSS JOIN (
  VALUES
    ('餐饮', 'utensils-crossed', '#d97706', 'expense', 10),
    ('交通', 'bus', '#0f766e', 'expense', 20),
    ('住房', 'house', '#7c3aed', 'expense', 30),
    ('工资', 'wallet', '#15803d', 'income', 10),
    ('奖金', 'badge-cent', '#2563eb', 'income', 20),
    ('转账', 'arrow-right-left', '#4b5563', 'transfer', 10)
) AS seed(name, icon, color, type, sort_order)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.categories c
  WHERE c.ledger_id = l.id AND c.is_system = TRUE
);
