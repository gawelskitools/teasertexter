// --- script.js ---

import { beitragsartenMapping } from './beitragsarten.js';
import { confirmKontextFallback } from './popup.js';
import { generateFinalXML } from './xml-generator.js';
import { getAllInputValues, escapeXml } from './input-helper.js';

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

document.addEventListener("DOMContentLoaded", () => {
  const formatSelect = document.getElementById("beitragsformat");
  formatSelect.addEventListener("change", updateBeitragsarten);
});

// Exportierte Funktionen für HTML-Zugriff
window.updateBeitragsarten = updateBeitragsarten;
window.toggleWarnTag = (elem) => elem.classList.toggle("active");
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
