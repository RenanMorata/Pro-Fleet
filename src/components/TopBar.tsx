export function TopBar() {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        {/* Depois você troca por <img src="/logo.png" .../> */}
        <div style={styles.logoBox}>LOGO</div>

        <div>
          <div style={styles.title}>Alocação de Equipamentos</div>
          <div style={styles.subtitle}>COA • Operações Agrícolas</div>
        </div>
      </div>

      <nav style={styles.nav}>
        <button style={styles.navBtn}>Alocação</button>
        <button style={styles.navBtn}>Cadastros</button>
        <button style={styles.navBtn}>Relatórios</button>
        <button style={styles.navBtn}>Config</button>
      </nav>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    background: "white",
  },
  left: { display: "flex", gap: 12, alignItems: "center" },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    display: "grid",
    placeItems: "center",
    fontSize: 12,
    fontWeight: 900,
  },
  title: { fontWeight: 900, fontSize: 14 },
  subtitle: { fontSize: 12, opacity: 0.7, fontWeight: 700 },
  nav: { display: "flex", gap: 8 },
  navBtn: {
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    padding: "8px 10px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
  },
};
