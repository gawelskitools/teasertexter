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

function copyToClipboard() {
  navigator.clipboard.writeText(document.getElementById("finalXml").textContent);
}

function downloadXML() {
  const blob = new Blob([document.getElementById("finalXml").textContent], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "finale-online-ausgabe.xml";
  a.click();
  URL.revokeObjectURL(url);
}

// Export Funktionen für Zugriff aus HTML
window.updateBeitragsarten = updateBeitragsarten;
window.toggleWarnTag = toggleWarnTag;
window.generateFinalXML = generateFinalXML;
window.copyToClipboard = copyToClipboard;
window.downloadXML = downloadXML;
