import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const inputPath = path.join(root, "src", "data", "farms_raw.txt");
const outputPath = path.join(root, "src", "data", "farms.generated.ts");

if (!fs.existsSync(inputPath)) {
  console.error("Arquivo não encontrado:", inputPath);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");

const lines = raw
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean);

const farms = {};
const duplicates = [];

for (const line of lines) {
  const match = line.match(/^(\d+)\s+(.+)$/);
  if (!match) continue;

  const code = match[1];
  const name = match[2].trim();

  if (farms[code] && farms[code] !== name) {
    duplicates.push({ code, old: farms[code], new: name });
  }

  farms[code] = name; // último vence
}

const sortedCodes = Object.keys(farms).sort((a, b) => Number(a) - Number(b));

let content = "";
content += `// Arquivo gerado automaticamente. Não editar na mão.\n`;
content += `export const farms: Record<string, string> = {\n`;

for (const code of sortedCodes) {
  const name = String(farms[code]).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  content += `  "${code}": "${name}",\n`;
}

content += `};\n\n`;

if (duplicates.length > 0) {
  content += `// Duplicatas detectadas (último valor venceu):\n`;
  for (const d of duplicates.slice(0, 50)) {
    content += `// ${d.code}: "${d.old}" -> "${d.new}"\n`;
  }
  if (duplicates.length > 50) {
    content += `// ... (${duplicates.length - 50} duplicatas a mais)\n`;
  }
}

fs.writeFileSync(outputPath, content, "utf8");
console.log("✅ Gerado:", outputPath);
console.log("Linhas lidas:", lines.length);
console.log("Fazendas geradas:", sortedCodes.length);
console.log("Duplicatas:", duplicates.length);
