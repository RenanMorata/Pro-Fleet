import type { Allocation } from "../types/Allocation";
import { fronts } from "../data/catalogs";
import EquipmentCard from "./EquipmentCard";

type Props = {
  data: Allocation[];
  onMove(allocationId: string, newFrontId: string): void;
  onDelete(allocationId: string): void;
};

export default function FrontBoard({ data, onMove, onDelete }: Props) {
  // quais frentes existem no dataset atual
  const usedFrontIds = Array.from(new Set(data.map((a) => String(a.frontId))));

  // monta colunas APENAS para frentes usadas
  const columns = usedFrontIds
    .map((id) => {
      if (id === "0") return { id: "0", name: "SEM FRENTE" };
      const f = fronts.find((x) => String(x.id) === id);
      return f ? { id: String(f.id), name: f.name } : { id, name: `Frente ${id}` };
    })
    .sort((a, b) => (a.id === "0" ? 1 : b.id === "0" ? -1 : Number(a.id) - Number(b.id)));

  return (
    <div className="board">
      {columns.map((front) => {
        const items = data.filter((a) => String(a.frontId) === String(front.id));

        return (
          <div
            key={front.id}
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("id");
              if (!id) return;
              onMove(id, String(front.id));
            }}
          >
            <div className="column-header">
              <div className="column-title">{front.name}</div>
              <div className="badge">{items.length}</div>
            </div>

            <div className="column-body">
              {items.map((item) => (
                <EquipmentCard key={item.id} item={item} onDelete={onDelete} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
