import {existsSync, readFileSync, writeFileSync} from "node:fs"

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
  "#03001c": "#e6edf3",
  "#777777B2": "#8b949eB2",
  "#7777771F": "#8b949e1F",
  "#777777A0": "#8b949eA0",
  "#77777760": "#8b949e60",
  "#777777": "#8b949e",
  "#959da520": "#8b949e20",
  "#666666": "#8b949e",
  "#8a93a8": "#8b949e",
  "#777": "#8b949e"
}

const FILES = [
  "metrics.plugin.isocalendar.fullyear.svg",
  "metrics.plugin.achievements.svg",
  "metrics.plugin.notable.svg",
  "metrics.plugin.habits.charts.svg",
  "metrics.plugin.people.svg",
  "metrics.plugin.reactions.svg",
  "metrics.plugin.discussions.svg",
  "metrics.plugin.introduction.svg",
  "metrics.plugin.languages.svg",
  "metrics.plugin.poopmap.svg"
]

for (const file of FILES) {
  if (!existsSync(file)) {
    console.log(`Skipped ${file} (not present)`)
    continue
  }
  let svg = readFileSync(file, "utf8")
  for (const [light, dark] of Object.entries(PALETTE)) {
    svg = svg.replace(new RegExp(light + "(?![0-9a-fA-F])", "gi"), dark)
  }
  const output = file.replace(/\.svg$/, ".dark.svg")
  writeFileSync(output, svg)
  console.log(`Wrote ${output}`)
}
