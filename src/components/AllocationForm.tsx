import React, { useMemo, useRef, useState } from "react";
import { farms, equipments, operations, fronts } from "../data/catalogs";
import type { Allocation, FrontStatus } from "../types/Allocation";
import { CodePicker, type PickerItem } from "./CodePicker";

type Props = {
  onAdd(allocation: Allocation): void;
};

export default function AllocationForm({ onAdd }: Props) {
  const [frontId, setFrontId] = useState<string>("");
  const [farmCode, setFarmCode] = useState("");
  const [status, setStatus] = useState<FrontStatus>("TRABALHANDO");
  const [rainMm, setRainMm] = useState<string>("");
  const [operationCode, setOperationCode] = useState("");

  const [equipmentCode, setEquipmentCode] = useState("");
  const [equipmentList, setEquipmentList] = useState<string[]>([]);

  const [collaborators, setCollaborators] = useState<string>("");

  const frontRef = useRef<HTMLInputElement>(null);
  const farmRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const rainRef = useRef<HTMLInputElement>(null);
  const opRef = useRef<HTMLInputElement>(null);
  const eqRef = useRef<HTMLInputElement>(null);
  const collabRef = useRef<HTMLInputElement>(null);

  const fr = frontId.trim();
  const fc = farmCode.trim();
  const oc = operationCode.trim();
  const ec = equipmentCode.trim();

  const frontName = useMemo(() => {
    if (!fr) return "";
    const found = fronts.find((f) => String(f.id) === String(fr));
    return found?.name ?? "";
  }, [fr]);

  const farmName = useMemo(() => farms[fc] ?? "", [fc]);
  const operationName = useMemo(() => operations[oc] ?? "", [oc]);
  const equipmentName = useMemo(() => equipments[ec]?.name ?? "", [ec]);

  const farmItems: PickerItem[] = useMemo(
    () => Object.entries(farms).map(([code, name]) => ({ code, name })),
    []
  );

  const operationItems: PickerItem[] = useMemo(
    () => Object.entries(operations).map(([code, name]) => ({ code, name })),
    []
  );

  const equipmentItems: PickerItem[] = useMemo(
    () => Object.entries(equipments).map(([code, v]) => ({ code, name: v.name })),
    []
  );

  const frontItems: PickerItem[] = useMemo(
    () =>
      fronts
        .filter((f) => String(f.id) !== "0")
        .map((f) => ({ code: String(f.id), name: f.name })),
    []
  );

  function onEnterNext(
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    next?: React.RefObject<HTMLInputElement | HTMLSelectElement>,
    customAction?: () => void
  ) {
    if (e.key !== "Enter") return;
    e.preventDefault();

    if (customAction) {
      customAction();
      return;
    }

    if (next?.current) next.current.focus();
  }

  function normalizeFront() {
    if (!fr) return { id: "0", name: "SEM FRENTE" };
    const found = fronts.find((f) => String(f.id) === String(fr));
    return found ? { id: String(found.id), name: found.name } : { id: "0", name: "SEM FRENTE" };
  }

  function addEquipment(codeRaw?: string) {
    const code = (codeRaw ?? ec).trim();
    if (!code) return;

    if (!equipments[code]) {
      alert("Equipamento não encontrado.");
      return;
    }

    setEquipmentList((prev) => (prev.includes(code) ? prev : [...prev, code]));
    setEquipmentCode("");
    setTimeout(() => eqRef.current?.focus(), 0);
  }

  function removeEquipment(code: string) {
    setEquipmentList((prev) => prev.filter((c) => c !== code));
  }

  function canSave() {
    if (!farms[fc]) return false;
    if (!operations[oc]) return false;
    if (equipmentList.length === 0) return false;

    if (status === "CHUVA") {
      const mm = Number(rainMm.replace(",", "."));
      if (!Number.isFinite(mm) || mm < 0) return false;
    }

    if (collaborators.trim()) {
      const n = Number(collaborators);
      if (!Number.isFinite(n) || n < 0) return false;
    }

    return true;
  }

  function handleSave() {
    if (!canSave()) {
      alert("Preencha: Fazenda, Operação e pelo menos 1 Equipamento. Se CHUVA, informar mm.");
      return;
    }

    const front = normalizeFront();
    const mm = status === "CHUVA" ? Number(rainMm.replace(",", ".")) : undefined;
    const collab = collaborators.trim() ? Number(collaborators) : undefined;

    onAdd({
      frontId: front.id,
      frontName: front.name,

      farmCode: fc,
      farmName: farms[fc],

      status,
      rainMm: mm,

      operationCode: oc,
      operationName: operations[oc],

      equipmentCodes: equipmentList,
      equipmentNames: equipmentList.map((c) => equipments[c].name),

      collaborators: collab,
    });

    setFrontId("");
    setFarmCode("");
    setStatus("TRABALHANDO");
    setRainMm("");
    setOperationCode("");
    setEquipmentCode("");
    setEquipmentList([]);
    setCollaborators("");
    setTimeout(() => frontRef.current?.focus(), 0);
  }

  return (
    <div style={styles.box}>
      <div className="formHeader" style={styles.header}>

      </div>

      {/* Frente */}
      <div style={styles.row}>
        <label style={styles.label}>Frente de Trabalho</label>
        <div style={styles.grid3}>
          <input
            ref={frontRef}
            style={styles.input}
            placeholder="Código da Frente"
            value={frontId}
            onChange={(e) => setFrontId(e.target.value)}
            onKeyDown={(e) => onEnterNext(e, farmRef)}
          />

          <CodePicker
            label="Frentes"
            items={frontItems}
            onPick={(it) => {
              setFrontId(it.code);
              setTimeout(() => farmRef.current?.focus(), 0);
            }}
          />

          <div style={styles.preview}>
            {fr ? (frontName ? frontName : "Não encontrado") : "SEM FRENTE"}
          </div>
        </div>
      </div>

      {/* Fazenda */}
      <div style={styles.row}>
        <label style={styles.label}>Fazenda</label>
        <div style={styles.grid3}>
          <input
            ref={farmRef}
            style={styles.input}
            placeholder="Código da fazenda"
            value={farmCode}
            onChange={(e) => setFarmCode(e.target.value)}
            onKeyDown={(e) => onEnterNext(e, statusRef)}
          />

          <CodePicker
            label="Fazendas"
            items={farmItems}
            onPick={(it) => {
              setFarmCode(it.code);
              setTimeout(() => statusRef.current?.focus(), 0);
            }}
          />

          <div style={styles.preview}>
            {fc ? (farmName ? farmName : "Não encontrado") : "—"}
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={styles.row}>
        <label style={styles.label}>Status da Frente</label>
        <div style={styles.grid2}>
          <select
            ref={statusRef}
            style={styles.select}
            value={status}
            onChange={(e) => {
              const v = e.target.value as FrontStatus;
              setStatus(v);
              if (v !== "CHUVA") setRainMm("");
            }}
            onKeyDown={(e) => onEnterNext(e, status === "CHUVA" ? rainRef : opRef)}
          >
            <option value="TRABALHANDO">Trabalhando</option>
            <option value="PARADA">Parada</option>
            <option value="CHUVA">Parada por chuva</option>
          </select>

          <div style={styles.preview}>
            {status === "TRABALHANDO"
              ? "Frente em operação"
              : status === "PARADA"
              ? "Frente parada"
              : "Parada por chuva"}
          </div>
        </div>
      </div>

      {status === "CHUVA" && (
        <div style={styles.row}>
          <label style={styles.label}>Chuva (mm)</label>
          <div style={styles.grid2}>
            <input
              ref={rainRef}
              style={styles.input}
              placeholder="Ex: 12,5"
              value={rainMm}
              onChange={(e) => setRainMm(e.target.value)}
              onKeyDown={(e) => onEnterNext(e, opRef)}
            />
            <div style={styles.preview}>Informe os milímetros</div>
          </div>
        </div>
      )}

      {/* Operação */}
      <div style={styles.row}>
        <label style={styles.label}>Operação</label>
        <div style={styles.grid3}>
          <input
            ref={opRef}
            style={styles.input}
            placeholder="Código da operação"
            value={operationCode}
            onChange={(e) => setOperationCode(e.target.value)}
            onKeyDown={(e) => onEnterNext(e, eqRef)}
          />

          <CodePicker
            label="Operações"
            items={operationItems}
            onPick={(it) => {
              setOperationCode(it.code);
              setTimeout(() => eqRef.current?.focus(), 0);
            }}
          />

          <div style={styles.preview}>
            {oc ? (operationName ? operationName : "Não encontrado") : "—"}
          </div>
        </div>
      </div>

      {/* Equipamentos */}
      <div style={styles.row}>
        <label style={styles.label}>Equipamentos (adicionar mais de um)</label>

        <div style={styles.grid4}>
          <input
            ref={eqRef}
            style={styles.input}
            placeholder="Código do equipamento"
            value={equipmentCode}
            onChange={(e) => setEquipmentCode(e.target.value)}
            onKeyDown={(e) => onEnterNext(e, collabRef, () => addEquipment())}
          />

          <CodePicker label="Equipamentos" items={equipmentItems} onPick={(it) => addEquipment(it.code)} />

          <div style={styles.preview}>
            {ec ? (equipmentName ? equipmentName : "Não encontrado") : "—"}
          </div>

          <button type="button" style={styles.addBtn} onClick={() => addEquipment()}>
            + Add
          </button>
        </div>

        <div style={styles.eqList}>
          {equipmentList.length === 0 ? (
            <div style={styles.eqEmpty}>Nenhum equipamento adicionado.</div>
          ) : (
            equipmentList.map((code) => (
              <div key={code} style={styles.eqItem}>
                <div style={styles.eqCode}>{code}</div>
                <div style={styles.eqName} title={equipments[code].name}>
                  {equipments[code].name}
                </div>
                <button type="button" style={styles.eqRemove} onClick={() => removeEquipment(code)} title="Remover">
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Colaboradores */}
      <div style={styles.row}>
        <label style={styles.label}>Colaboradores (opcional)</label>
        <div style={styles.grid2}>
          <input
            ref={collabRef}
            style={styles.input}
            placeholder="Quantidade de pessoas (ex: 18)"
            value={collaborators}
            onChange={(e) => setCollaborators(e.target.value)}
            onKeyDown={(e) => onEnterNext(e, undefined, () => handleSave())}
          />
          <div style={styles.preview}>Para frentes de turma</div>
        </div>
      </div>

      <button style={styles.btn} onClick={handleSave} disabled={!canSave()}>
        Salvar Alocação
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  box: {
    padding: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 14,
    background: "white",
    maxWidth: 820,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  header: { display: "flex", flexDirection: "column", gap: 4 },
  row: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, fontWeight: 900, opacity: 0.75 },

  grid3: { display: "grid", gridTemplateColumns: "220px 52px 1fr", gap: 10, alignItems: "center" },
  grid2: { display: "grid", gridTemplateColumns: "220px 1fr", gap: 10, alignItems: "center" },
  grid4: { display: "grid", gridTemplateColumns: "220px 52px 1fr 90px", gap: 10, alignItems: "center" },

  input: {
    height: 38,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    padding: "0 12px",
    outline: "none",
    fontWeight: 800,
  },
  select: {
    height: 38,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    padding: "0 10px",
    outline: "none",
    fontWeight: 800,
    background: "white",
  },
  preview: {
    height: 38,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    borderRadius: 12,
    border: "1px dashed rgba(0,0,0,0.14)",
    background: "rgba(0,0,0,0.02)",
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.85,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  addBtn: {
    height: 38,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "white",
    fontWeight: 900,
    cursor: "pointer",
  },

  eqList: { marginTop: 10, display: "flex", flexDirection: "column", gap: 8 },
  eqEmpty: {
    padding: 12,
    borderRadius: 12,
    border: "1px dashed rgba(0,0,0,0.14)",
    background: "rgba(0,0,0,0.02)",
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.75,
  },
  eqItem: {
    display: "grid",
    gridTemplateColumns: "90px 1fr 44px",
    gap: 10,
    alignItems: "center",
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "white",
  },
  eqCode: { fontWeight: 900, fontSize: 12 },
  eqName: {
    fontWeight: 800,
    fontSize: 12,
    opacity: 0.85,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  eqRemove: {
    height: 34,
    width: 44,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    cursor: "pointer",
    fontWeight: 900,
  },

  btn: {
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "black",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
  },
};
