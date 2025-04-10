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
  const hints = window.warnTagHints || {};
  const tagInfo = hints[tagName] || {};

  const infoBox = document.createElement("div");
  infoBox.innerHTML = `
    <div style="position:fixed;top:20%;left:50%;transform:translateX(-50%);
      background:#fff;border:1px solid #ccc;padding:20px;z-index:9999;
      box-shadow:0 0 15px rgba(0,0,0,0.3);max-width:600px;">
      <h3>Hinweise zum Warn-Tag: ${tagName}</h3>
      <p><strong>Standard-Hinweis:</strong><br>${tagInfo.standard || "Keine Hinweise vorhanden."}</p>
      ${tagInfo.custom ? `<p><strong>Custom-Hinweis:</strong><br>${tagInfo.custom}</p>` : ""}
      <div style="margin-top: 20px; text-align: right;">
        <button id="warnOk">OK</button>
        <button id="warnCancel" style="margin-left: 10px;">Abbrechen</button>
      </div>
    </div>`;

  document.body.appendChild(infoBox);

  return new Promise(resolve => {
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
