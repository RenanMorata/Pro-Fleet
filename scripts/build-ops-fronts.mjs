import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");

function readLines(file) {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) {
    console.error("Arquivo não encontrado:", p);
    process.exit(1);
  }
  return fs
    .readFileSync(p, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseKeyValue(lines) {
  const obj = {};
  const dups = [];
  for (const line of lines) {
    const m = line.match(/^(\S+)\s+(.+)$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2].trim();
    if (obj[key] && obj[key] !== val) dups.push({ key, old: obj[key], new: val });
    obj[key] = val; // último vence
  }
  return { obj, dups };
}

function writeFile(file, content) {
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, content, "utf8");
  console.log("✅ Gerado:", p);
}

// operations
{
  const lines = readLines("operations_raw.txt");
  const { obj, dups } = parseKeyValue(lines);

  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b, "pt-BR"));

  let out = `// Arquivo gerado automaticamente. Não editar na mão.\n`;
  out += `export const operations: Record<string, string> = {\n`;
  for (const k of keys) {
    const v = String(obj[k]).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    out += `  "${k}": "${v}",\n`;
  }
  out += `};\n\n`;

  if (dups.length) {
    out += `// Duplicatas (último venceu):\n`;
    for (const d of dups.slice(0, 50)) out += `// ${d.key}: "${d.old}" -> "${d.new}"\n`;
  }

  writeFile("operations.generated.ts", out);
  console.log("Operações:", keys.length, "| Duplicatas:", dups.length);
}

// fronts
{
  const lines = readLines("fronts_raw.txt");
  const { obj, dups } = parseKeyValue(lines);

  const ids = Object.keys(obj).sort((a, b) => a.localeCompare(b, "pt-BR"));

  let out = `// Arquivo gerado automaticamente. Não editar na mão.\n`;
  out += `export const fronts = [\n`;
  for (const id of ids) {
    const name = String(obj[id]).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    out += `  { id: "${id}", name: "${name}" },\n`;
  }
  out += `] as const;\n\n`;

  if (dups.length) {
    out += `// Duplicatas (último venceu):\n`;
    for (const d of dups.slice(0, 50)) out += `// ${d.key}: "${d.old}" -> "${d.new}"\n`;
  }

  writeFile("fronts.generated.ts", out);
  console.log("Frentes:", ids.length, "| Duplicatas:", dups.length);
}
