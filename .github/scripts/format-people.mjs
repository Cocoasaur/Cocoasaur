// Match the people plugin's limit: two rows of twelve circles.
const PEOPLE_LIMIT = 24
const PEOPLE_STYLE = '<style id="people-overflow-style">.people{display:grid;grid-template-columns:repeat(12,28px);gap:4px 8px;padding:0 12px}.people .avatar{margin:0}.people .people-overflow{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#ebedf0;color:#0366d6;box-shadow:inset 0 0 0 1px #959da5;font-size:10px;font-weight:600;line-height:1;white-space:nowrap}</style>'

export function formatPeople(svg) {
  // Replace our styles so rerunning on a previously formatted card is safe.
  svg = svg.replace(/<style id="people-overflow-style">[\s\S]*?<\/style>\s*/, "")
  svg = svg.replace("<foreignObject", `${PEOPLE_STYLE}\n    <foreignObject`)

  return svg.replace(
    /(<h2\b[^>]*>[\s\S]*?<\/h2>\s*<div class="row">\s*<section class="people">)([\s\S]*?)(<\/section>)/g,
    (section, heading, content, closing) => {
      const count = heading.match(/([\d,]+)\s+(followers?|followed|following)\s*<\/h2>/)
      if (!count) return section

      const total = Number(count[1].replaceAll(",", ""))
      const avatars = content.match(/<img\b[^>]*\bclass="avatar"[^>]*\/?\s*>/g) ?? []
      // Reserve the final circle only when some people will be hidden.
      const visible = avatars.slice(0, total > PEOPLE_LIMIT ? PEOPLE_LIMIT - 1 : PEOPLE_LIMIT)
      const remaining = Math.max(0, total - visible.length)
      if (remaining) {
        const label = count[2].startsWith("follower") ? "followers" : "following"
        visible.push(`<span class="avatar people-overflow" role="img" aria-label="${remaining} more ${label}" title="${remaining} more ${label}">+${remaining}</span>`)
      }

      return `${heading}\n                        ${visible.join("\n                        ")}\n                    ${closing}`
    },
  )
}
