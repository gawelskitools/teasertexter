// --- script.js ---

import { beitragsartenMapping } from './beitragsarten.js';
import { confirmKontextFallback } from './popup.js';
import { generateFinalXML } from './xml-generator.js';

function updateBeitragsarten() {
  const format = document.getElementById("beitragsformat").value;
  const artSelect = document.getElementById("beitragsart");
  artSelect.innerHTML = '<option value="">– Beitragsart wählen –</option>';
  if (beitragsartenMapping[format]) {
    beitragsartenMapping[format].forEach(tag => {
      const opt = document.createElement("option");
      opt.value = tag;
      opt.textContent = tag;
      artSelect.appendChild(opt);
    });
  }
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&apos;");
}

function toggleWarnTag(elem) {
  elem.classList.toggle("active");
}

function getWarnTagsXml() {
  return [...document.querySelectorAll(".tag-button.active")] 
    .map(btn => `<tag>${escapeXml(btn.textContent)}</tag>`).join("\n");
}

function getFieldValue(id) {
  return escapeXml(document.getElementById(id)?.value || "");
}

function getTextareaValue(id) {
  return escapeXml(document.getElementById(id)?.value || "");
}

function getSelectedValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function getAllInputValues() {
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

// Export Funktionen für Zugriff aus HTML
window.updateBeitragsarten = updateBeitragsarten;
window.toggleWarnTag = toggleWarnTag;
window.generateFinalXML = () => generateFinalXML(getAllInputValues());
window.copyToClipboard = () => {
  navigator.clipboard.writeText(document.getElementById("finalXml").textContent);
};
window.downloadXML = () => {
  const blob = new Blob([document.getElementById("finalXml").textContent], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "finale-online-ausgabe.xml";
  a.click();
  URL.revokeObjectURL(url);
};
