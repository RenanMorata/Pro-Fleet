type Front = { id: string; name: string };

export function Board({ fronts }: { fronts: Front[] }) {
  return (
    <main style={styles.board}>
      {fronts.map((f) => (
        <section key={f.id} style={styles.col}>
          <div style={styles.colHeader}>
            <div style={styles.colTitle}>{f.name}</div>
            <div style={styles.colCount}>0</div>
          </div>

          <div style={styles.empty}>
            Arraste equipamentos aqui (em breve)
          </div>
        </section>
      ))}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  board: {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "300px",
    gap: 12,
    padding: "16px",
    overflowX: "auto",
  },
  col: {
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(0,0,0,0.02)",
    borderRadius: 18,
    padding: 12,
    minHeight: 500,
  },
  colHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  colTitle: { fontWeight: 900, fontSize: 13 },
  colCount: {
    fontWeight: 900,
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
  },
  empty: {
    marginTop: 8,
    borderRadius: 14,
    border: "1px dashed rgba(0,0,0,0.18)",
    padding: 12,
    fontSize: 12,
    opacity: 0.7,
    fontWeight: 700,
    background: "rgba(255,255,255,0.6)",
  },
};
