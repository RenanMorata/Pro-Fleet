import { useEffect, useMemo, useRef, useState } from "react";

export type PickerItem = { code: string; name: string };

type Props = {
  label?: string;
  items: PickerItem[];
  onPick: (item: PickerItem) => void;
  buttonTitle?: string;
};

export function CodePicker({ label, items, onPick, buttonTitle = "Buscar" }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items.slice(0, 200);
    return items
      .filter((it) => {
        const c = it.code.toLowerCase();
        const n = it.name.toLowerCase();
        return c.includes(query) || n.includes(query);
      })
      .slice(0, 200);
  }, [q, items]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  function pick(it: PickerItem) {
    onPick(it);
    setOpen(false);
    setQ("");
  }

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        type="button"
        title={buttonTitle}
        onClick={() => setOpen((v) => !v)}
        style={styles.btn}
      >
        🔎
      </button>

      {open && (
        <div style={styles.pop}>
          <div style={styles.popHeader}>
            <div style={styles.popTitle}>{label ?? "Selecionar"}</div>
            <button type="button" onClick={() => setOpen(false)} style={styles.close}>
              ✕
            </button>
          </div>

          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por código ou nome..."
            style={styles.search}
          />

          <div style={styles.list}>
            {filtered.map((it) => (
              <button
                key={it.code}
                type="button"
                onClick={() => pick(it)}
                style={styles.item}
              >
                <span style={styles.code}>{it.code}</span>
                <span style={styles.name} title={it.name}>
                  {it.name}
                </span>
              </button>
            ))}

            {filtered.length === 0 && (
              <div style={styles.empty}>Nada encontrado.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  btn: {
    height: 38,
    width: 42,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "white",
    cursor: "pointer",
    fontWeight: 900,
  },
  pop: {
    position: "absolute",
    right: 0,
    top: 46,
    width: 420,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
    padding: 12,
    zIndex: 50,
  },
  popHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  popTitle: { fontWeight: 900, fontSize: 13 },
  close: {
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    borderRadius: 10,
    cursor: "pointer",
    height: 30,
    width: 34,
    fontWeight: 900,
  },
  search: {
    marginTop: 10,
    height: 38,
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    padding: "0 12px",
    outline: "none",
    fontWeight: 800,
  },
  list: {
    marginTop: 10,
    maxHeight: 320,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  item: {
    display: "grid",
    gridTemplateColumns: "90px 1fr",
    gap: 10,
    alignItems: "center",
    textAlign: "left",
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "white",
    cursor: "pointer",
  },
  code: { fontWeight: 900, fontSize: 12, opacity: 0.9 },
  name: {
    fontWeight: 800,
    fontSize: 12,
    opacity: 0.85,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  empty: { padding: 10, fontWeight: 800, opacity: 0.7, fontSize: 12 },
};
