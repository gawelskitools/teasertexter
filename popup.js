// --- popup.js ---

export function confirmKontextFallback() {
  return new Promise(resolve => {
    const confirmBox = document.createElement("div");
    confirmBox.innerHTML = `
      <div style="
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        border: 1px solid #ccc;
        padding: 20px;
        z-index: 9999;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
      ">
        <p><strong>Achtung!</strong> Es ist keine Beitragsart ausgewählt.<br>
        Es wird automatisch die Beitragsart <code>#kontext</code> verwendet.</p>
        <button id="confirmOk">OK</button>
        <button id="confirmCancel">Abbrechen</button>
      </div>
    `;
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
