import {readFileSync, writeFileSync} from "node:fs"

const PALETTE = {
  "#ebedf0": "#161b22",
  "#9be9a8": "#0e4429",
  "#40c463": "#006d32",
  "#30a14e": "#26a641",
  "#216e39": "#39d353",
  "#959da5": "#8b949e",
  "#0969da": "#58a6ff",
  "#0366d6": "#58a6ff",
  "#0a3069": "#1f6feb",
  "#54aeff": "#79c0ff",
  "#b6e3ff": "#1f6feb",
  "#03001c": "#e6edf3"
}

const input = process.argv[2] ?? "metrics.plugin.isocalendar.fullyear.svg"
const output = process.argv[3] ?? "metrics.plugin.isocalendar.fullyear.dark.svg"

let svg = readFileSync(input, "utf8")
for (const [light, dark] of Object.entries(PALETTE)) {
  svg = svg.replace(new RegExp(light, "gi"), dark)
}
writeFileSync(output, svg)
console.log(`Wrote ${output}`)
