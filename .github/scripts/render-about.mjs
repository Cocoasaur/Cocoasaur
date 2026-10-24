import {mkdirSync, readFileSync, writeFileSync} from "node:fs"

const root = new URL("../../", import.meta.url)
const output = new URL("assets/about/", root)
const readme = readFileSync(new URL("README.md", root), "utf8")
const section = readme.match(/<!-- about:start[\s\S]*?<!-- about:end -->/)?.[0]
const paragraphs = [...(section ?? "").matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => match[1].trim())
if (!paragraphs.length) throw new Error("Missing About me text in README.md")

// SVG images cannot fetch external assets on GitHub. Embed the original GIF
// so the card remains self-contained and Kirby keeps animating.
const gif = readFileSync(new URL("kirby.gif", output)).toString("base64")
const escape = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
const layouts = {
  mobile: {width: 320, height: 700, font: 17, padding: 20, stacked: true},
  tablet: {width: 640, height: 470, font: 18, padding: 20, stacked: false},
  // GitHub's profile sidebar reduces the README width on portrait tablets.
  "tablet-portrait": {width: 400, height: 680, font: 17, padding: 16, stacked: false},
  desktop: {width: 860, height: 370, font: 18, padding: 24, stacked: false},
}
const themes = {
  light: {text: "#1f2328", border: "#d1d9e0"},
  dark: {text: "#e6edf3", border: "#30363d"},
}

mkdirSync(output, {recursive: true})
for (const [layout, {width, height, font, padding, stacked}] of Object.entries(layouts)) {
  for (const [theme, colors] of Object.entries(themes)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">About me</title>
  <desc id="description">${escape(paragraphs.join(" "))}</desc>
  <foreignObject width="${width}" height="${height}">
    <div xmlns="http://www.w3.org/1999/xhtml" class="about">
      <style>
        * { box-sizing: border-box; }
        .about {
          display: grid;
          grid-template-columns: ${stacked ? "1fr" : "3fr 2fr"};
          ${stacked ? "grid-template-rows: auto 1fr;" : ""}
          width: ${width}px;
          height: ${height}px;
          border: 1px solid ${colors.border};
          color: ${colors.text};
          font: ${font}px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        }
        .copy { align-self: center; padding: ${padding}px; }
        h2 { margin: 0 0 18px; padding-bottom: 8px; border-bottom: 1px solid ${colors.border}; font-size: 25px; line-height: 1.25; }
        p { margin: 0 0 16px; }
        p:last-child { margin-bottom: 0; }
        .art { display: flex; align-items: center; justify-content: center; padding: ${padding}px; min-width: 0; border-${stacked ? "top" : "left"}: 1px solid ${colors.border}; }
        img { display: block; width: 100%; height: auto; }
      </style>
      <div class="copy">
        <h2>About me</h2>
        ${paragraphs.map(text => `<p>${escape(text)}</p>`).join("\n        ")}
      </div>
      <div class="art"><img src="data:image/gif;base64,${gif}" width="500" height="304" alt="Animated Kirby" /></div>
    </div>
  </foreignObject>
</svg>
`
    const name = `${layout}${theme === "dark" ? ".dark" : ""}.svg`
    writeFileSync(new URL(name, output), svg)
    console.log(`Wrote assets/about/${name}`)
  }
}
