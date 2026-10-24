import assert from "node:assert/strict"
import {test} from "node:test"
import {formatPeople} from "./format-people.mjs"

function card(total, label = "followers", fetched = Math.min(total, 24)) {
  return `<svg><style/>\n<foreignObject><div><section>
    <h2 class="field"><svg><path/></svg>${total} ${label}</h2>
    <div class="row"><section class="people">
      ${Array.from({length: fetched}, (_, i) => `<img class="avatar" src="avatar-${i}" width="28" height="28" alt="" />`).join("\n")}
    </section></div></section></div></foreignObject></svg>`
}

test("shows every avatar when the list fits, including exactly 24", () => {
  for (const total of [0, 1, 15, 23, 24]) {
    const svg = formatPeople(card(total))
    assert.equal((svg.match(/<img /g) ?? []).length, total)
    assert.ok(!svg.includes('<span class="avatar people-overflow"'))
  }
})

test("reserves the final slot and counts all hidden people in both lists", () => {
  const svg = formatPeople(card(33) + card(28, "followed"))
  assert.equal((svg.match(/<img /g) ?? []).length, 46)
  assert.ok(svg.includes('aria-label="10 more followers"'))
  assert.ok(svg.includes('>+10</span>'))
  assert.ok(svg.includes('aria-label="5 more following"'))
  assert.ok(svg.includes('>+5</span>'))
})

test("handles a one-person overflow and totals with thousands separators", () => {
  assert.ok(formatPeople(card(25)).includes('>+2</span>'))
  assert.ok(formatPeople(card("1,234", "following", 24)).includes('>+1211</span>'))
})

test("counts people omitted by the data source as well", () => {
  const svg = formatPeople(card(20, "followers", 15))
  assert.equal((svg.match(/<img /g) ?? []).length, 15)
  assert.ok(svg.includes('>+5</span>'))
})

test("formatting an already formatted card leaves it unchanged", () => {
  for (const total of [0, 24, 25, 33]) {
    const svg = formatPeople(card(total))
    assert.equal(formatPeople(svg), svg)
    assert.equal((svg.match(/id="people-overflow-style"/g) ?? []).length, 1)
  }
})
