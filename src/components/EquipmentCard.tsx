import type { Allocation } from "../types/Allocation";

type Props = {
  item: Allocation;
  onDelete(id: string): void;
};

export default function EquipmentCard({ item, onDelete }: Props) {
  return (
    <div
      className={`card status-${item.status.toLowerCase()}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("id", item.id)}
    >
      <button
        className="card-x"
        type="button"
        title="Excluir alocação"
        onClick={() => {
          const ok = window.confirm("Deseja excluir esta alocação?");
          if (ok) onDelete(item.id);
        }}
      >
        ✕
      </button>

      <div className="card-title">{item.equipmentCodes.join(", ")}</div>

      <div className="card-sub">{item.farmName}</div>
      <div className="card-sub">{item.operationName}</div>

      {item.status === "CHUVA" && (
        <div className="card-alert">🌧 {item.rainMm ?? 0} mm</div>
      )}

      {typeof item.collaborators === "number" && (
        <div className="card-sub">👥 {item.collaborators}</div>
      )}
    </div>
  );
}
