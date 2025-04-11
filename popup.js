// --- popup.js ---

export function confirmKontextFallback(currentArt) {
  return new Promise(resolve => {
    if (currentArt && currentArt.trim() !== "") {
      resolve(true);
      return;
    }

    const confirmBox = document.createElement("div");
    confirmBox.innerHTML = `
      <div style="position:fixed;top:20%;left:50%;transform:translateX(-50%);
        background:#fff;border:1px solid #ccc;padding:20px;z-index:9999;
        box-shadow:0 0 10px rgba(0,0,0,0.2);">
        <p><strong>Achtung!</strong> Es ist keine Beitragsart ausgewählt.<br>
        Es wird automatisch die Beitragsart <code>#kontext</code> verwendet.</p>
        <div style="margin-top: 15px; text-align: right;">
          <button id="confirmOk">OK</button>
          <button id="confirmCancel" style="margin-left: 10px;">Abbrechen</button>
        </div>
      </div>`;
    document.body.appendChild(confirmBox);

    document.getElementById("confirmOk").onclick = () => {
      document.body.removeChild(confirmBox);
      resolve(true);
    };

    document.getElementById("confirmCancel").onclick = () => {
      document.body.removeChild(confirmBox);
      resolve(false);
    };
  });
}

export function showWarnTagPopup(tagName) {
  return new Promise(resolve => {
    const tagInfo = window.warnTagDetails?.[tagName] || {};
    const standard = tagInfo.standard?.trim() || "-";

    // Fallback: String oder Array
    const beispieleArray = Array.isArray(tagInfo.beispiele)
      ? tagInfo.beispiele
      : typeof tagInfo.beispiele === "string"
        ? tagInfo.beispiele.split(/[\r\n]+/).map(line => line.trim()).filter(Boolean)
        : [];

    const beispielList = beispieleArray
      .map(b => `&gt; ${escapeHtml(b)}`)
      .join("<br>");

    const infoBox = document.createElement("div");
    infoBox.innerHTML = `
      <div style="position:fixed;top:20%;left:50%;transform:translateX(-50%);
        background:#fff;border:1px solid #ccc;padding:20px;z-index:9999;
        box-shadow:0 0 15px rgba(0,0,0,0.3);max-width:700px;">
        <h3>Warn-Tag: ${escapeHtml(tagName)}</h3>
        <p><strong>Dieser Warn-Tag wird wie folgt bei der KI-Verarbeitung benutzt:</strong></p>
        <p>${escapeHtml(standard)}</p>
        ${beispielList ? `
          <p><strong>Beispiele zum besseren Verständnis:</strong><br>
          ${beispielList}</p>` : ""}
        <p style="margin-top: 20px;"><em>Mit "OK" wird dieser Warn-Tag übernommen!</em></p>
        <div style="margin-top: 20px; text-align: right;">
          <button id="warnOk">OK</button>
          <button id="warnCancel" style="margin-left: 10px;">Abbrechen</button>
        </div>
      </div>
    `;

    document.body.appendChild(infoBox);

    document.getElementById("warnOk").onclick = () => {
      document.body.removeChild(infoBox);
      resolve(true);
    };

    document.getElementById("warnCancel").onclick = () => {
      document.body.removeChild(infoBox);
      resolve(false);
    };
  });
}

export function showHelp(type) {
  const helpTexts = {
    "hinweis": `
      <h3>Redaktionelle Hinweise</h3>
      <p>Diese Hinweise werden bei der KI-Auswertung besonders berücksichtigt – auch wenn sie nicht in den Quelltexten stehen.</p>
      <p><strong>Beispiel:</strong><br>„Die Angeklagte soll in allen Texten als ‚mutmaßliche Ex-Terroristin‘ bezeichnet werden.“</p>
    `,
    "tags": `
      <h3>Redaktionelle Tags mit Alternativen</h3>
      <p>Gib einen Begriff ein (z. B. HSH Nordbank) und optional Alternativen wie „HSH“ oder „HSH Bank“.</p>
      <p>Diese Begriffe werden in der finalen Ausgabe gezielt ersetzt oder bevorzugt verwendet.</p>
    `
  };

  const html = helpTexts[type] || "<p>Keine Hilfe verfügbar.</p>";

  const box = document.createElement("div");
  box.id = "popupContainer";
  box.innerHTML = `
    <div style="background:#fff;padding:20px;border:1px solid #ccc;max-width:600px;
                box-shadow:0 0 10px rgba(0,0,0,0.3);position:fixed;top:20%;left:50%;
                transform:translateX(-50%);z-index:9999;">
      ${html}
      <div style="margin-top:15px;text-align:right;">
        <button onclick="document.body.removeChild(document.getElementById('popupContainer'))">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(box);
}


// Sicherheitsfunktion zur HTML-Escapierung
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, tag => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[tag]
  ));
}
