import { useEffect, useState } from "react";
import AllocationForm from "./components/AllocationForm";
import FrontBoard from "./components/FrontBoard";
import TopBar from "./components/TopBar";
import type { Allocation } from "./types/Allocation";

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}

export default function App() {
  const [data, setData] = useState<Allocation[]>(() => {
    const saved = localStorage.getItem("allocations");
    return saved ? (JSON.parse(saved) as Allocation[]) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  function addAllocation(a: Allocation) {
    setData((prev) => [...prev, { ...a, id: newId() }]);
    setIsModalOpen(false);
  }

  function moveAllocation(id: string, newFrontId: string) {
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, frontId: newFrontId } : x)));
  }

  function deleteAllocation(id: string) {
    setData((prev) => prev.filter((x) => x.id !== id));
  }

  useEffect(() => {
    localStorage.setItem("allocations", JSON.stringify(data));
  }, [data]);

  // fechar modal no ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsModalOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <TopBar onOpenAllocate={() => setIsModalOpen(true)} />

      <div className="container">
        {data.length === 0 ? null : (
          <FrontBoard data={data} onMove={moveAllocation} onDelete={deleteAllocation} />
        )}
      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            // clicar fora fecha
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Nova Alocação</div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                Fechar
              </button>
            </div>

            <div className="modal-body">
              <AllocationForm onAdd={addAllocation} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
