import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");

const inputPath = path.join(dataDir, "equipments_raw.txt");
const outputPath = path.join(dataDir, "equipments.generated.ts");

if (!fs.existsSync(inputPath)) {
  console.error("Arquivo não encontrado:", inputPath);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");

const lines = raw
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(Boolean);

// FORMATO REAL:
// 724   COLHEDORA DE CANA - CASE A8800
const equipments = {};
const duplicates = [];

for (const line of lines) {
  const match = line.match(/^(\d+)\s+(.+)$/);
  if (!match) continue;

  const code = match[1];
  const name = match[2].trim();

  if (equipments[code] && equipments[code].name !== name) {
    duplicates.push({ code, old: equipments[code].name, new: name });
  }

  equipments[code] = {
    name,
    fleetCode: "DEFAULT", // 🔹 frota padrão (por enquanto)
  };
}

const codes = Object.keys(equipments).sort((a, b) => Number(a) - Number(b));

let out = `// Arquivo gerado automaticamente. NÃO editar manualmente.\n`;
out += `export const equipments: Record<string, { name: string; fleetCode: string }> = {\n`;

for (const code of codes) {
  const name = equipments[code].name
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');

  out += `  "${code}": { name: "${name}", fleetCode: "DEFAULT" },\n`;
}

out += `};\n\n`;

if (duplicates.length) {
  out += `// Duplicatas encontradas (último venceu):\n`;
  for (const d of duplicates.slice(0, 30)) {
    out += `// ${d.code}: "${d.old}" -> "${d.new}"\n`;
  }
}

fs.writeFileSync(outputPath, out, "utf8");

console.log("✅ equipments.generated.ts criado");
console.log("Equipamentos:", codes.length);
console.log("Duplicatas:", duplicates.length);
