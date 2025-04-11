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
  initRedaktionTagInput();
});

// --- Redaktionelle Tags mit Chips ---
function initRedaktionTagInput() {
  const input = document.getElementById("redaktionstagInput");
  const container = document.getElementById("redaktionstagChips");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      e.preventDefault();
      addRedaktionTag(input.value.trim(), container);
      input.value = "";
    }
  });
}

function addRedaktionTag(text, container) {
  const chip = document.createElement("span");
  chip.className = "chip-tag";
  chip.innerHTML = `
    ${escapeHtml(text)}
    <span class="chip-edit" title="Alternative hinzufügen">✏️</span>
    <span class="chip-delete" title="Entfernen">✖</span>
    <div class="chip-alternativen" style="display:none;"></div>
  `;
  container.appendChild(chip);

  const editBtn = chip.querySelector(".chip-edit");
  const delBtn = chip.querySelector(".chip-delete");
  const altContainer = chip.querySelector(".chip-alternativen");

  editBtn.onclick = () => {
    const existingInput = altContainer.querySelector(".chip-alt-input");
    if (existingInput) {
      existingInput.remove();
      altContainer.style.display = "none";
    } else {
      const altInput = document.createElement("input");
      altInput.type = "text";
      altInput.placeholder = "Alternative eingeben und Enter drücken";
      altInput.className = "chip-alt-input";
      altInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && altInput.value.trim()) {
          const altTag = document.createElement("span");
          altTag.className = "chip-alt-tag";
          altTag.textContent = altInput.value.trim();
          altContainer.appendChild(altTag);
          altInput.value = "";
        }
      });
      altContainer.appendChild(altInput);
      altContainer.style.display = "block";
      altInput.focus();
    }
  };

  delBtn.onclick = () => {
    container.removeChild(chip);
  };
}

// --- Exportfunktion für redaktionelle Tags + Alternativen als XML ---
window.getRedaktionTagsXml = () => {
  const chips = [...document.querySelectorAll("#redaktionstagChips .chip-tag")];
  return chips.map(chip => {
    const nameNode = chip.childNodes[0];
    const name = nameNode?.nodeType === 3 ? nameNode.textContent.trim() : "";
    const altContainer = chip.querySelector(".chip-alternativen");
    const alternativen = [...altContainer.querySelectorAll(".chip-alt-tag")].map(alt => alt.textContent.trim());
    const altXml = alternativen.map(alt => `<alternative>${escapeXml(alt)}</alternative>`).join("");
    return `<tag name="${escapeXml(name)}">${altXml}</tag>`;
  }).join("\n");
};

// --- Hilfsfunktion für sichere HTML-Ausgabe ---
function escapeHtml(str) {
  return str.replace(/[&<>"]/g, tag => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[tag]
  ));
}

// --- Globaler Click-Listener zum Schließen alternativer Eingabefelder ---
document.addEventListener("click", (event) => {
  const allAltContainer = document.querySelectorAll(".chip-alternativen");
  allAltContainer.forEach(container => {
    const isInside = container.contains(event.target) || container.previousSibling?.classList?.contains("chip-edit");
    if (!isInside) {
      const input = container.querySelector(".chip-alt-input");
      if (input) input.remove();
      container.style.display = "none";
    }
  });
});

// --- Laden von Videoformaten / Warn-Tag-Details ---
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

        const beispiele = Array.from(doc.querySelectorAll("beispiele > beispiel"))
          .map(b => b.textContent.trim());

        window.warnTagDetails[tag] = {
          standard: doc.querySelector("standard")?.textContent || "",
          hinweis: doc.querySelector("hinweis")?.textContent || "",
          empfehlung: doc.querySelector("empfehlung")?.textContent || "",
          beispiele
        };
      })
      .catch(() => {
        console.warn(`Warn-Tag-Datei für '${tag}' nicht gefunden.`);
        window.warnTagDetails[tag] = {};
      });
  });
}

window.showHelp = function(type) {
  let message = "";
  switch (type) {
    case "tags":
      message = "Redaktionelle Tags sind feste Begriffe wie Institutionen oder Namen. Du kannst alternative Schreibweisen angeben.";
      break;
    case "hinweis":
      message = "Hier kannst du redaktionelle Hinweise eingeben, z. B. Formulierungen, die zwingend verwendet werden sollen.";
      break;
    default:
      message = "Keine Hilfe verfügbar.";
  }

  const helpBox = document.createElement("div");
  helpBox.innerHTML = `
    <div style="position:fixed;top:20%;left:50%;transform:translateX(-50%);
      background:#fff;border:1px solid #ccc;padding:20px;z-index:9999;
      box-shadow:0 0 15px rgba(0,0,0,0.3);max-width:600px;">
      <p>${message}</p>
      <div style="margin-top: 15px; text-align: right;">
        <button onclick="this.parentNode.parentNode.remove()">Schließen</button>
      </div>
    </div>
  `;
  document.body.appendChild(helpBox);
};

// --- Globale Methoden ---
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
