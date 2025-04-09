// --- xml-generator.js ---

import { confirmKontextFallback } from './popup.js';

export async function generateFinalXML() {
  let art = document.getElementById("beitragsart").value;

  if (!art) {
    const confirmed = await confirmKontextFallback();
    if (!confirmed) return;
    art = "#kontext";
  }

  const isoTime = new Date().toISOString();
  const titel = escapeXml(document.getElementById("beitragstitel").value);
  const format = escapeXml(document.getElementById("beitragsformat").value);
  const topTags = escapeXml(document.getElementById("topTags").value);
  const thema = escapeXml(document.getElementById("themaTag").value);
  const ort = escapeXml(document.getElementById("ortTag").value);
  const ereignis = escapeXml(document.getElementById("ereignisTag").value);
  const warnTags = [...document.querySelectorAll(".tag-button.active")]
    .map(btn => `<tag>${escapeXml(btn.textContent)}</tag>`).join("\n");

  const transcript = escapeXml(document.getElementById("transkript").value);
  const zitatT = document.getElementById("zitateTranskript").value;
  const weightT = document.getElementById("weightTranskript").value;

  const anmoderation = escapeXml(document.getElementById("anmoderation").value);
  const zitatA = document.getElementById("zitateAnmoderation").value;
  const weightA = document.getElementById("weightAnmoderation").value;

  const videoFormatXml = await fetch(`videoformat/${art.replace('#','')}.xml`)
    .then(res => res.ok ? res.text() : fetch('videoformat/kontext.xml').then(r => r.text()))
    .catch(() => '<videoFormat><formatgruppe>kontext</formatgruppe><tags>#kontext</tags></videoFormat>');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<online-ausgabe version="1.0">
  <verarbeitung automatisch="true" />
  <verarbeitungskette>
    <schritt nummer="1" typ="analyse">Transkript und Anmoderation analysieren</schritt>
    <schritt nummer="2" typ="struktur">Analysefelder (2–6) befuellen</schritt>
    <schritt nummer="3" typ="redaktion">Online-Elemente erzeugen</schritt>
    <schritt nummer="4" typ="vorschau">Klartextausgabe erzeugen</schritt>
  </verarbeitungskette>
  <anweisung-fuer-ki>
    <beschreibung>Verarbeite alle Inhalte gemaeß Beitragsart. Nutze &lt;tags&gt; zur Kontextualisierung und Priorisierung. Keine Rueckfragen. Kein CDATA. Direkte Klartextausgabe.</beschreibung>
    <hinweis>Beruecksichtige die Struktur in &lt;videoFormat&gt; fuer alle redaktionellen Ausgaben.</hinweis>
    <ablauf>
      <schritt>1. Inhalte analysieren</schritt>
      <schritt>2. Strukturierte Auswertung</schritt>
      <schritt>3. Redaktionelle Textbausteine erzeugen</schritt>
      <schritt>4. Ausgabe erzeugen</schritt>
    </ablauf>
    <abschluss>
Finale redaktionelle Online-Ausgabe

Ueberschrift (max. 60 Zeichen):
"..."

Kurzbeschreibung (max. 150 Zeichen):
"..."

SEO-Keywords (max. 10):
...

SEO-Themen (max. 5):
...

Keine Rueckfragen. Nur diese Klartextstruktur.
    </abschluss>
  </anweisung-fuer-ki>
  <quelle>
    <zeitstempel>${isoTime}</zeitstempel>
    <titel>${titel}</titel>
    <beitragsformat>${format}</beitragsformat>
    <beitragsart>${art}</beitragsart>
    <tags>
      <top-tags prioritaet="hoch">
        ${topTags.split(',').map(tag => `<tag>${tag.trim()}</tag>`).join("\n")}
      </top-tags>
      <warn-tags bedeutung="inhaltlich kritisch">
        ${warnTags}
      </warn-tags>
      <kontext-tags>
        <thema>${thema}</thema>
        <ort>${ort}</ort>
        <ereignis>${ereignis}</ereignis>
      </kontext-tags>
    </tags>
    <analysearten>
      <transkript gewichtung="${weightT}">
        <zitate-erlaubt>${zitatT}</zitate-erlaubt>
        <originaltext>${transcript}</originaltext>
      </transkript>
      <anmoderation gewichtung="${weightA}">
        <zitate-erlaubt>${zitatA}</zitate-erlaubt>
        <originaltext>${anmoderation}</originaltext>
      </anmoderation>
    </analysearten>
    ${videoFormatXml.trim()}
  </quelle>
</online-ausgabe>`;

  document.getElementById("finalXml").textContent = xml;
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&apos;");
}
