interface LedgerSettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function LedgerSettingsPage({ params }: LedgerSettingsPageProps) {
  const { id } = await params;

  return (
    <div className="grid">
      {/* ── Page Header ── */}
      <section className="panel glass-panel page-header fade-up">
        <span className="section-kicker">Ledger Settings</span>
        <div className="page-header-top">
          <div style={{ maxWidth: 700 }}>
            <h1 className="page-title">账本设置</h1>
            <p className="body-copy" style={{ margin: 0, fontSize: 17 }}>
              管理账本 <code>{id}</code> 的基础信息、成员权限与协作规则。
              好的账本管理如同装帧精良的册页——结构清晰，取阅自如。
            </p>
          </div>
          <div className="badge">只读预览</div>
        </div>
      </section>

      {/* ── 基本信息 Section ── */}
      <section className="panel glass-panel fade-up stagger-1" style={{ padding: 28 }}>
        <div className="settings-section">
          <div>
            <h2 style={{ margin: 0, fontSize: 22 }}>基本信息</h2>
            <p className="body-copy" style={{ margin: "8px 0 0" }}>
              账本的名称、描述与币种——定义这本账的身份与语境。
            </p>
          </div>

          <div className="soft-divider" />

          <div className="settings-row">
            <div style={{ flex: 1 }}>
              <span className="field-label">账本 ID</span>
              <p style={{ margin: "4px 0 0", color: "var(--text-primary)", fontSize: 14 }}>
                <code>{id}</code>
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                color: "var(--text-tertiary)",
                padding: "4px 10px",
                borderRadius: "var(--r-full)",
                background: "var(--border-subtle)",
                letterSpacing: "0.04em",
              }}
            >
              系统生成
            </span>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div className="field-group">
              <label className="field-label">账本名称</label>
              <input
                className="field"
                type="text"
                defaultValue="我的账本"
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>

            <div className="field-group">
              <label className="field-label">账本描述</label>
              <input
                className="field"
                type="text"
                defaultValue="记录日常收支与共同开销"
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">币种</label>
                <input
                  className="field"
                  type="text"
                  defaultValue="CNY"
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div className="field-group">
                <label className="field-label">图标</label>
                <input
                  className="field"
                  type="text"
                  defaultValue="book"
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button className="button-primary" disabled>
              保存修改
            </button>
            <button className="button-ghost" disabled>
              重置
            </button>
          </div>
        </div>
      </section>

      {/* ── 成员管理 Section ── */}
      <section className="panel glass-panel fade-up stagger-2" style={{ padding: 28 }}>
        <div className="settings-section">
          <div>
            <h2 style={{ margin: 0, fontSize: 22 }}>成员管理</h2>
            <p className="body-copy" style={{ margin: "8px 0 0" }}>
              共事者的名册——查看成员角色、管理权限分配。每位成员在这本账中都有自己的位置。
            </p>
          </div>

          <div className="soft-divider" />

          <div style={{ display: "grid", gap: 10 }}>
            <div className="member-card">
              <div className="member-avatar">主</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600 }}>
                    账本创建者
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--gold)",
                      padding: "2px 8px",
                      borderRadius: "var(--r-full)",
                      background: "var(--gold-glow)",
                      border: "1px solid rgba(201,169,110,0.15)",
                      letterSpacing: "0.04em",
                      fontWeight: 700,
                    }}
                  >
                    OWNER
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", color: "var(--text-tertiary)", fontSize: 13 }}>
                  创建于账本初始之时
                </p>
              </div>
            </div>

            <div className="member-card">
              <div className="member-avatar">协</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600 }}>
                    协作成员 A
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      padding: "2px 8px",
                      borderRadius: "var(--r-full)",
                      background: "var(--border-subtle)",
                      letterSpacing: "0.04em",
                      fontWeight: 600,
                    }}
                  >
                    EDITOR
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", color: "var(--text-tertiary)", fontSize: 13 }}>
                  可记账、可查看，不可管理设置
                </p>
              </div>
              <button className="button-ghost" disabled style={{ fontSize: 13, padding: "6px 12px" }}>
                移除
              </button>
            </div>

            <div className="member-card">
              <div className="member-avatar">览</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600 }}>
                    协作成员 B
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      padding: "2px 8px",
                      borderRadius: "var(--r-full)",
                      background: "var(--border-subtle)",
                      letterSpacing: "0.04em",
                      fontWeight: 600,
                    }}
                  >
                    VIEWER
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", color: "var(--text-tertiary)", fontSize: 13 }}>
                  只读权限，可查看全部流水
                </p>
              </div>
              <button className="button-ghost" disabled style={{ fontSize: 13, padding: "6px 12px" }}>
                移除
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 邀请设置 Section ── */}
      <section className="panel glass-panel fade-up stagger-3" style={{ padding: 28 }}>
        <div className="settings-section">
          <div>
            <h2 style={{ margin: 0, fontSize: 22 }}>邀请设置</h2>
            <p className="body-copy" style={{ margin: "8px 0 0" }}>
              生成专属邀请链接，让合适的人加入这本账。链接可设定有效期与默认角色。
            </p>
          </div>

          <div className="soft-divider" />

          <div
            style={{
              padding: 20,
              borderRadius: "var(--r-lg)",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border-subtle)",
              display: "grid",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ margin: 0, color: "var(--text-primary)", fontSize: 15, fontWeight: 600 }}>
                  邀请链接
                </p>
                <p style={{ margin: "4px 0 0", color: "var(--text-tertiary)", fontSize: 13 }}>
                  尚未生成 · 点击下方按钮创建
                </p>
              </div>
              <button className="button-secondary" disabled style={{ fontSize: 13 }}>
                生成邀请链接
              </button>
            </div>

            <div className="soft-divider" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">默认角色</label>
                <input
                  className="field"
                  type="text"
                  defaultValue="Editor"
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div className="field-group">
                <label className="field-label">有效期</label>
                <input
                  className="field"
                  type="text"
                  defaultValue="7 天"
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 危险操作 Section ── */}
      <section className="panel fade-up stagger-4" style={{ padding: 28, borderColor: "rgba(199,70,58,0.15)" }}>
        <div className="settings-section">
          <div>
            <h2 style={{ margin: 0, fontSize: 22, color: "var(--expense)" }}>危险操作</h2>
            <p className="body-copy" style={{ margin: "8px 0 0" }}>
              以下操作不可逆转。删除账本将永久移除所有交易记录、分类与成员关系。
            </p>
          </div>

          <div className="soft-divider" />

          <div
            style={{
              padding: 20,
              borderRadius: "var(--r-lg)",
              background: "var(--danger-bg)",
              border: "1px solid rgba(199,70,58,0.15)",
              display: "grid",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ margin: 0, color: "var(--expense)", fontSize: 15, fontWeight: 600 }}>
                  删除此账本
                </p>
                <p style={{ margin: "4px 0 0", color: "var(--text-tertiary)", fontSize: 13 }}>
                  账本 <code>{id}</code> 及其所有数据将被永久清除，此操作无法恢复。
                </p>
              </div>
              <button
                className="button-primary"
                disabled
                style={{
                  background: "linear-gradient(135deg, var(--danger), #8b2e25)",
                  boxShadow: "0 4px 20px rgba(199,70,58,0.2)",
                  fontSize: 13,
                }}
              >
                删除账本
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing Note ── */}
      <section style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <p style={{ color: "var(--text-tertiary)", fontSize: 13, margin: 0, letterSpacing: "0.04em" }}>
          设置如序言，定义账本的形制与边界
        </p>
      </section>
    </div>
  );
}
