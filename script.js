// --- script.js ---

import { beitragsartenMapping } from './beitragsarten.js';
import { confirmKontextFallback, showWarnTagPopup } from './popup.js';
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

  const artSelect = document.getElementById("beitragsart");
  artSelect.addEventListener("change", () => {
    const art = artSelect.value || "kontext";
    fetchVideoFormatHints(art);
  });

  document.querySelectorAll(".tag-button").forEach(btn => {
    btn.addEventListener("click", async () => {
      const tagName = btn.textContent.trim();
      const confirmed = await showWarnTagPopup(tagName);
      if (confirmed) {
        btn.classList.toggle("active");
      }
    });
  });

  fetchVideoFormatHints("kontext");
  preloadWarnTagDetails();
});

function fetchVideoFormatHints(artValue) {
  const path = `videoformat/${artValue.replace('#', '')}.xml`;
  fetch(path)
    .then(res => res.ok ? res.text() : Promise.reject("not found"))
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "application/xml");

      const standardTags = xml.querySelectorAll("warn-tags-verarbeitung > bei-warn-tag");
      const customTags = xml.querySelectorAll("custom-warn-tags > bei-warn-tag");
      window.warnTagHints = {};

      standardTags.forEach(el => {
        const name = el.getAttribute("name");
        const text = el.textContent.trim();
        if (name) window.warnTagHints[name] = { standard: text };
      });

      customTags.forEach(el => {
        const name = el.getAttribute("name");
        const text = el.textContent.trim();
        if (name) {
          if (!window.warnTagHints[name]) window.warnTagHints[name] = {};
          window.warnTagHints[name].custom = text;
        }
      });
    })
    .catch(() => {
      console.warn("Hinweis: VideoFormat-Hinweise konnten nicht geladen werden.");
      window.warnTagHints = {};
    });
}

function preloadWarnTagDetails() {
  const tags = ["Mutmaßung", "Vorverurteilung", "Falschmeldung", "Identitätsschutz", "rechtlich sensibel"];
  window.warnTagDetails = {};

  tags.forEach(tag => {
    fetch(`warn-tags/${tag}.xml`)
      .then(res => res.ok ? res.text() : Promise.reject("not found"))
      .then(xml => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "application/xml");
        window.warnTagDetails[tag] = {
          standard: doc.querySelector("standard")?.textContent || "",
          hinweis: doc.querySelector("hinweis")?.textContent || "",
          empfehlung: doc.querySelector("empfehlung")?.textContent || "",
          beispiele: doc.querySelector("beispiele")?.textContent || ""
        };
      })
      .catch(() => {
        console.warn(`Warn-Tag-Datei für '${tag}' nicht gefunden.`);
        window.warnTagDetails[tag] = {};
      });
  });
}

window.updateBeitragsarten = updateBeitragsarten;
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
