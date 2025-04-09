// --- xml-generator.js ---

import { confirmKontextFallback } from './popup.js';

function escapeXml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&apos;");
}

export async function generateFinalXML(input) {
  let art = input.art;

  if (!art) {
    const confirmed = await confirmKontextFallback();
    if (!confirmed) return;
    art = "#kontext";
  }

  const isoTime = new Date().toISOString();
  const titel = input.titel;
  const format = input.format;
  const topTags = input.topTags;
  const thema = input.thema;
  const ort = input.ort;
  const ereignis = input.ereignis;
  const warnTags = input.warnTags;
  const transcript = input.transcript;
  const zitatT = input.zitatT;
  const weightT = input.weightT;
  const anmoderation = input.anmoderation;
  const zitatA = input.zitatA;
  const weightA = input.weightA;
  const redaktion = input.redaktion;
  const hintergrund = input.hintergrund;

  const videoFormatXml = await fetch(`videoformat/${art.replace('#','')}.xml`)
    .then(res => res.ok ? res.text() : fetch('videoformat/kontext.xml').then(r => r.text()))
    .catch(() => '<videoFormat><formatgruppe>kontext</formatgruppe><tags>#kontext</tags></videoFormat>');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<online-ausgabe version="1.0">
  <verarbeitung automatisch="true" />
  <verarbeitungskette>
    <schritt nummer="1" typ="analyse">Transkript und Anmoderation analysieren</schritt>
    <schritt nummer="2" typ="struktur">Analysefelder (2–6) befüllen</schritt>
    <schritt nummer="3" typ="redaktion">Online-Elemente erzeugen</schritt>
    <schritt nummer="4" typ="vorschau">Klartextausgabe erzeugen</schritt>
  </verarbeitungskette>
  <anweisung-fuer-ki>
    <beschreibung>Verarbeite alle Inhalte gemäß Beitragsart. Nutze &lt;tags&gt; zur Kontextualisierung und Priorisierung. Keine Rückfragen. Kein CDATA. Direkte Klartextausgabe.</beschreibung>
    <hinweis>Berücksichtige die Struktur in &lt;videoFormat&gt; für alle redaktionellen Ausgaben.</hinweis>
    <ablauf>
      <schritt>1. Inhalte analysieren</schritt>
      <schritt>2. Strukturierte Auswertung</schritt>
      <schritt>3. Redaktionelle Textbausteine erzeugen</schritt>
      <schritt>4. Ausgabe erzeugen</schritt>
    </ablauf>
    <abschluss>
Finale redaktionelle Online-Ausgabe

Überschrift (max. 60 Zeichen):
"..."

Kurzbeschreibung (max. 150 Zeichen):
"..."

SEO-Keywords (max. 10):
...

SEO-Themen (max. 5):
...

Keine Rückfragen. Nur diese Klartextstruktur.
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
      <kontextquelle>
        <redaktionelle-anmerkungen>${redaktion}</redaktionelle-anmerkungen>
        <hintergrundtext>${hintergrund}</hintergrundtext>
      </kontextquelle>
    </analysearten>
    ${videoFormatXml.trim()}
  </quelle>
</online-ausgabe>`;

  document.getElementById("finalXml").textContent = xml;
}
