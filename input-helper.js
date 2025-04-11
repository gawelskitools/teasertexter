// --- input-helper.js ---

export function escapeXml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&apos;");
}

export function getFieldValue(id) {
  return escapeXml(document.getElementById(id)?.value || "");
}

export function getTextareaValue(id) {
  return escapeXml(document.getElementById(id)?.value || "");
}

export function getSelectedValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

export function getWarnTagsXml() {
  return [...document.querySelectorAll(".tag-button.active")]
    .map(btn => `<tag>${escapeXml(btn.textContent)}</tag>`)
    .join("\n");
}

export function getRedaktionelleTagsXml() {
  const chips = [...document.querySelectorAll("#redaktionstagChips .chip-tag")];

  return chips.map(chip => {
    // Hauptbegriff (direkter Text im Chip, vor den Buttons)
    const nameNode = chip.childNodes[0];
    const name = nameNode?.nodeType === 3 ? nameNode.textContent.trim() : "";

    // Alternative Begriffe
    const altTags = [...chip.querySelectorAll(".chip-alt-tag")];
    const alternativen = altTags.map(el => `<alternative>${escapeXml(el.textContent)}</alternative>`).join("");

    return `<tag name="${escapeXml(name)}">${alternativen}</tag>`;
  }).join("\n");
}

export function getAllInputValues() {
  return {
    titel: getFieldValue("beitragstitel"),
    format: getSelectedValue("beitragsformat"),
    art: getSelectedValue("beitragsart"),
    topTags: getFieldValue("topTags"),
    thema: getFieldValue("themaTag"),
    ort: getFieldValue("ortTag"),
    ereignis: getFieldValue("ereignisTag"),
    warnTags: getWarnTagsXml(),
    redaktionelleHinweise: getFieldValue("redaktionHinweise"),
    redaktionelleTagsXml: getRedaktionelleTagsXml(),
    transcript: getTextareaValue("transkript"),
    weightT: getSelectedValue("weightTranskript"),
    anmoderation: getTextareaValue("anmoderation"),
    weightA: getSelectedValue("weightAnmoderation"),
    redaktion: getTextareaValue("redaktionstext"),
    hintergrund: getTextareaValue("hintergrundtext")
  };
}
