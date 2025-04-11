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
    .map(btn => `<tag>${escapeXml(btn.textContent)}</tag>`).join("\n");
}

export function getRedaktionelleTagsXml() {
  const tagContainer = document.getElementById("redaktionTags");
  if (!tagContainer) return "";

  const tags = [...tagContainer.querySelectorAll(".chip")];
  return tags.map(chip => {
    const hauptbegriff = escapeXml(chip.dataset.value || "");
    const aliasContainer = chip.querySelectorAll(".alias-tag");
    const aliases = [...aliasContainer].map(aliasEl => escapeXml(aliasEl.textContent));
    const aliasXml = aliases.length
      ? `<alias>${aliases.join("</alias>\n<alias>")}</alias>`
      : "";
    return `<begriff>${hauptbegriff}${aliasXml ? "\n" + aliasXml : ""}</begriff>`;
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
