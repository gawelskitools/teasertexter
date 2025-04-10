// --- xml-generator.js ---

import { confirmKontextFallback } from './popup.js';
import {
  getAllInputValues,
  escapeXml
} from './input-helper.js';

export async function generateFinalXML() {
  const input = getAllInputValues();
  let art = input.art;

  // Falls keine Beitragsart ausgewählt, Fallback abfragen
  if (!art) {
    const confirmed = await confirmKontextFallback();
    if (!confirmed) return;
    art = "#kontext";
  }

  const isoTime = new Date().toISOString();

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
Finale redaktionelle Online-Ausgabe (3 Varianten)

Variante 1
Überschrift (max. 60 Zeichen): "..."
Kurzbeschreibung (max. 150 Zeichen): "..."

Variante 2
Überschrift (max. 60 Zeichen): "..."
Kurzbeschreibung (max. 150 Zeichen): "..."

Variante 3
Überschrift (max. 60 Zeichen): "..."
Kurzbeschreibung (max. 150 Zeichen): "..."

SEO-Keywords (max. 10): ...
SEO-Themen (max. 5): ...

Keine Rückfragen. Nur diese Klartextstruktur.
    </abschluss>
  </anweisung-fuer-ki>
  <quelle>
    <zeitstempel>${isoTime}</zeitstempel>
    <titel>${input.titel}</titel>
    <beitragsformat>${input.format}</beitragsformat>
    <beitragsart>${art}</beitragsart>
    <tags>
      <top-tags prioritaet="hoch">
        ${input.topTags.split(',').map(tag => `<tag>${tag.trim()}</tag>`).join("\n")}
      </top-tags>
      <warn-tags bedeutung="inhaltlich kritisch">
        ${input.warnTags}
      </warn-tags>
      <kontext-tags>
        <thema>${input.thema}</thema>
        <ort>${input.ort}</ort>
        <ereignis>${input.ereignis}</ereignis>
      </kontext-tags>
    </tags>
    <analysearten>
      <transkript gewichtung="${input.weightT}">
        <zitate-erlaubt>${input.zitatT}</zitate-erlaubt>
        <originaltext>${input.transcript}</originaltext>
      </transkript>
      <anmoderation gewichtung="${input.weightA}">
        <zitate-erlaubt>${input.zitatA}</zitate-erlaubt>
        <originaltext>${input.anmoderation}</originaltext>
      </anmoderation>
      <kontextquelle>
        <redaktionelle-anmerkungen>${input.redaktion}</redaktionelle-anmerkungen>
        <hintergrundtext>${input.hintergrund}</hintergrundtext>
      </kontextquelle>
    </analysearten>
    ${videoFormatXml.trim()}
  </quelle>
  <vorschau>
    <text>
      <variante nummer="1">
        <ueberschrift>...</ueberschrift>
        <kurzbeschreibung>...</kurzbeschreibung>
      </variante>
      <variante nummer="2">
        <ueberschrift>...</ueberschrift>
        <kurzbeschreibung>...</kurzbeschreibung>
      </variante>
      <variante nummer="3">
        <ueberschrift>...</ueberschrift>
        <kurzbeschreibung>...</kurzbeschreibung>
      </variante>
      <keywords>...</keywords>
      <themen>...</themen>
    </text>
    <html>
      <!-- Optional: HTML-Ausgabe -->
    </html>
  </vorschau>
</online-ausgabe>`;

  document.getElementById("finalXml").textContent = xml;
}
