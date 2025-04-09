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
    transcript: getTextareaValue("transkript"),
    zitatT: getSelectedValue("zitateTranskript"),
    weightT: getSelectedValue("weightTranskript"),
    anmoderation: getTextareaValue("anmoderation"),
    zitatA: getSelectedValue("zitateAnmoderation"),
    weightA: getSelectedValue("weightAnmoderation"),
    redaktion: getTextareaValue("redaktionstext"),
    hintergrund: getTextareaValue("hintergrundtext")
  };
}
