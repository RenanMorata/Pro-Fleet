import type { Allocation } from "../types/Allocation";

type Props = {
  item: Allocation;
  onDelete(id: string): void;
};

function statusLabel(s: Allocation["status"]) {
  if (s === "TRABALHANDO") return "Trabalhando";
  if (s === "PARADA") return "Parada";
  return "Parada por chuva";
}

export default function EquipmentCard({ item, onDelete }: Props) {
  function handleDelete() {
    const ok = confirm("Deseja realmente excluir esta alocação?");
    if (ok) onDelete(item.id);
  }

  const statusText =
    item.status === "CHUVA"
      ? `Status: ${statusLabel(item.status)}${item.rainMm != null ? ` (${item.rainMm} mm)` : ""}`
      : `Status: ${statusLabel(item.status)}`;

  return (
    <div style={styles.card}>
      <button style={styles.close} onClick={handleDelete} aria-label="Excluir">
        ×
      </button>

      <div style={styles.lineBold}>
        Fazenda: {item.farmCode} {item.farmName}
      </div>

      <div style={styles.line}>
        Operação: {item.operationCode} {item.operationName}
      </div>

      <div style={styles.status}>
        {statusText}
      </div>

      <div style={styles.line}>
        Equipamentos: {item.equipmentCodes.join(", ")}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: "relative",
    background: "#ffffff",
    borderRadius: 14,
    padding: "14px 16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    borderLeft: "6px solid #1f7a3f",
    fontSize: 14,
    lineHeight: 1.5,
  },

  lineBold: {
    fontWeight: 700,
    marginBottom: 6,
  },

  line: {
    color: "#333",
    marginBottom: 4,
  },

  status: {
    fontWeight: 700,
    color: "#0b3d2e",
    marginBottom: 6,
  },

  close: {
    position: "absolute",
    top: 8,
    right: 10,
    border: "none",
    background: "#f3f3f3",
    borderRadius: "50%",
    width: 26,
    height: 26,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  },
};
