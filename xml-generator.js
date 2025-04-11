// --- xml-generator.js ---

import { confirmKontextFallback } from './popup.js';
import {
  getAllInputValues,
  escapeXml
} from './input-helper.js';

export async function generateFinalXML() {
  const input = getAllInputValues();
  let art = input.art;

  if (!art) {
    const confirmed = await confirmKontextFallback();
    if (!confirmed) return;
    art = "#kontext";
  }

  const isoTime = new Date().toISOString();

  const videoFormatXml = await fetch(`videoformat/${art.replace('#','')}.xml`)
    .then(res => res.ok ? res.text() : fetch('videoformat/kontext.xml').then(r => r.text()))
    .catch(() => '<videoFormat><formatgruppe>kontext</formatgruppe><tags>#kontext</tags></videoFormat>');

  const zitatVorgabenXml = await fetch(`zitat-verwendung/zitat-vorgaben.xml`)
    .then(res => res.ok ? res.text() : Promise.resolve(""))
    .catch(() => "");

  const activeWarnTagNames = [...document.querySelectorAll(".tag-button.active")].map(btn => btn.textContent.trim());
  const warnTagXmlBlocks = activeWarnTagNames.map(name => {
    const tagData = window.warnTagDetails?.[name] || {};
    return `  <tag name="${escapeXml(name)}">
    <standard>${escapeXml(tagData.standard || "")}</standard>
    <hinweis>${escapeXml(tagData.hinweis || "")}</hinweis>
    <empfehlung>${escapeXml(tagData.empfehlung || "")}</empfehlung>
    <beispiele>${escapeXml(tagData.beispiele || "")}</beispiele>
  </tag>`;
  }).join("\n");

  const redaktionelleHinweise = escapeXml(input.redaktionHinweise || "");

  const redaktionsTags = (input.redaktionsTags || []).map(tag => {
    const alt = tag.alternativen && tag.alternativen.length
      ? `\n      <alternativen>${tag.alternativen.map(a => `<alt>${escapeXml(a)}</alt>`).join("")}</alternativen>`
      : "";
    return `    <begriff>
      <bezeichnung>${escapeXml(tag.name)}</bezeichnung>${alt}
    </begriff>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<online-ausgabe version="1.0">
  <verarbeitung automatisch="true" />
  <verarbeitungskette>
    <schritt nummer="1" typ="analyse">Transkript und Anmoderation analysieren</schritt>
    <schritt nummer="2" typ="struktur">Analysefelder (2–6) befüllen</schritt>
    <schritt nummer="3" typ="redaktion">Online-Elemente erzeugen</schritt>
    <schritt nummer="4" typ="vorschau">Klartextausgabe für Finale redaktionelle Online-Ausgabe (3 Varianten) erzeugen</schritt>
  </verarbeitungskette>
  <anweisung-fuer-ki>
    <beschreibung>Verarbeite alle Inhalte gemäß Beitragsart. Nutze &lt;tags&gt; zur Kontextualisierung und Priorisierung. Keine Rückfragen. Kein CDATA. Direkte Klartextausgabe.</beschreibung>
    <hinweis>Berücksichtige die Struktur in &lt;videoFormat&gt; für alle redaktionellen Ausgaben.</hinweis>
    <hinweis>Beziehe alle gesetzten &lt;warn-tags&gt; in die inhaltliche, sprachliche und rechtliche Auswertung ein. Bei gesetzten Tags ist eine vorsichtige Tonalitaet verpflichtend.</hinweis>
    <hinweis>Für redaktionelle Hinweise zu Warn-Tags beachte die Inhalte aus &lt;custom-warn-tags&gt; im Block &lt;warn-tags&gt;.</hinweis>
    <hinweis>Für Zitate beachte strikt die Regeln in &lt;zitat-vorgaben&gt;. Maximal 3 Zitat-Varianten als separater Block unterhalb der redaktionellen Varianten ausgeben. Nur wörtliche Zitate mit namentlich bekannter Quelle, maximal 60 Zeichen. Keine Rückfragen, keine Ergänzungen, keine erfundenen Inhalte.</hinweis>
    <hinweis>Berücksichtige &lt;redaktionelle-hinweise&gt; und &lt;redaktionelle-tags&gt; streng in der gesamten Auswertung und finalen Textgenerierung.</hinweis>
    <ablauf>
      <schritt>1. Inhalte analysieren</schritt>
      <schritt>2. Strukturierte Auswertung</schritt>
      <schritt>3. Redaktionelle Textbausteine erzeugen</schritt>
      <schritt>4. Finale redaktionelle Online-Ausgabe (3 Varianten) erzeugen</schritt>
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

Zitat-Variante 1: "..."
Zitat-Variante 2: "..."
Zitat-Variante 3: "..."

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
    </tags>
    <warn-tags bedeutung="inhaltlich kritisch">
${warnTagXmlBlocks}
    </warn-tags>
    <tags>
      <kontext-tags>
        <thema>${input.thema}</thema>
        <ort>${input.ort}</ort>
        <ereignis>${input.ereignis}</ereignis>
      </kontext-tags>
    </tags>
    <analysearten>
      <transkript gewichtung="${input.weightT}">
        <originaltext>${input.transcript}</originaltext>
      </transkript>
      <anmoderation gewichtung="${input.weightA}">
        <originaltext>${input.anmoderation}</originaltext>
      </anmoderation>
      <kontextquelle>
        <redaktionelle-anmerkungen>${input.redaktion}</redaktionelle-anmerkungen>
        <hintergrundtext>${input.hintergrund}</hintergrundtext>
      </kontextquelle>
    </analysearten>
    <redaktionelle-hinweise>${redaktionelleHinweise}</redaktionelle-hinweise>
    <redaktionelle-tags>
${redaktionsTags || "      <begriff><bezeichnung>–</bezeichnung></begriff>"}
    </redaktionelle-tags>
    ${videoFormatXml.trim()}
    ${zitatVorgabenXml.trim()}
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
      <zitat-varianten>
        <zitat nummer="1">...</zitat>
        <zitat nummer="2">...</zitat>
        <zitat nummer="3">...</zitat>
      </zitat-varianten>
      <keywords>...</keywords>
      <themen>...</themen>
    </text>
  </vorschau>
</online-ausgabe>`;

  document.getElementById("finalXml").textContent = xml;
}
