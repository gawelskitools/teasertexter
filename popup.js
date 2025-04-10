// --- popup.js ---

// Popup zur Beitragsart-Wahl (#kontext als Fallback)
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

// Popup zur Anzeige von Warn-Tag-Hinweisen (Standard + Custom)
export function showWarnTagPopup(tagName) {
  const hints = window.warnTagHints?.[tagName];
  if (!hints) return;

  const popupBox = document.createElement("div");
  popupBox.innerHTML = `
    <div style="position:fixed;top:20%;left:50%;transform:translateX(-50%);
      background:#fff;border:1px solid #ccc;padding:20px;z-index:10000;
      box-shadow:0 0 15px rgba(0,0,0,0.3);width:400px;max-width:90%;">
      <h3>Hinweise zu <code>${tagName}</code></h3>
      <p><strong>Standard:</strong><br>${hints.standard || "–"}</p>
      <p><strong>Custom:</strong><br>${hints.custom || "–"}</p>
      <div style="margin-top: 20px; text-align: right;">
        <button id="warnHintOk">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(popupBox);
  document.getElementById("warnHintOk").onclick = () => {
    document.body.removeChild(popupBox);
  };
}
