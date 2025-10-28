<h1>Denki Memory Helfer</h1>
<p>
  Ein einfaches Browser-Addon, das das TU Wien Memory-Spiel automatisiert.
  Es lernt das Spielfeld durch einmaliges Hovern und markiert danach in
  jeder Runde automatisch die korrekte Antwortkarte.
</p>

<hr />

<h2>Kompatibilität</h2>
<p>
  Dieses Addon wurde für <b>Chromium-basierte Browser</b> entwickelt.
</p>

<p>
  <b>Wichtiger Hinweis zu Firefox:</b>
  <br />
  Es gibt derzeit <b>keinen Release für Firefox</b>. Firefox verwendet
  eine andere Addon-Architektur (WebExtensions API), die Anpassungen am Code
  erfordern würde.
</p>

<hr />

<h2>Installationsanleitung (Chrome / Brave / Edge)</h2>
<p>
  Da das Addon nicht im offiziellen Chrome Web Store gelistet ist, muss es
  manuell über den "Entwicklermodus" geladen werden.
</p>

<ol>
  <li>
    <strong>Code herunterladen</strong>
    <ul>
      <li>
        Klicke oben auf dieser GitHub-Seite auf den grünen
        <strong>"&lt;&gt; Code"</strong> Button.
      </li>
      <li>Wähle <strong>"Download ZIP"</strong>.</li>
      <li>
        Entpacke die ZIP-Datei in einen Ordner an einem Ort, den du nicht
        mehr löschst (z.B. in deinem "Dokumente"-Ordner).
      </li>
    </ul>
  </li>

  <li>
    <strong>Browser-Erweiterungsseite öffnen</strong>
    <ul>
      <li>
        <b>Für Chrome/Brave:</b> Gib
        <code>chrome://extensions</code> in deine Adressleiste ein und
        drücke Enter.
      </li>
      <li>
        <b>Für Edge:</b> Gib <code>edge://extensions</code> in deine
        Adressleiste ein und drücke Enter.
      </li>
    </ul>
  </li>

  <li>
    <strong>Entwicklermodus aktivieren</strong>
    <p>
      Suche auf der Erweiterungsseite nach dem Schalter
      <b>"Entwicklermodus"</b> (Developer mode) und aktiviere ihn. Er
      befindet sich meistens in der oberen rechten Ecke.
    </p>
  </li>

  <li>
    <strong>Erweiterung laden</strong>
    <p>
      Es erscheinen nun neue Buttons. Klicke auf
      <b>"Entpackte Erweiterung laden"</b> (Load unpacked).
    </p>
    <p>
      Es öffnet sich ein Datei-Explorer. Wähle hier den kompletten Ordner
      aus, den du in Schritt 1 entpackt hast (also den Ordner, der die
      <code>manifest.json</code>-Datei enthält).
    </p>
  </li>

  <li>
    <strong>Fertig!</strong>
    <p>
      Das "TU Memory Helfer"-Addon sollte jetzt in deiner Liste erscheinen.
      Solange der Entwicklermodus aktiv ist, bleibt das Addon geladen und
      funktioniert automatisch, wenn du die Spiel-Seite besuchst.
    </p>
  </li>
</ol>

<hr />

<h3>Benutzung</h3>
<ol>
  <li>Geh auf das gewünschte Memory</li>
  <li>WICHITG: reloade das memory mit F5 oder reload button</li>
  <li>
    Dann: unten rechts erscheint der Status:
    <b>"Lernphase: 0 / 9 Definitionen gesehen."</b>
  </li>
  <li>
    Hovere <b>einmal und langsam</b> über jede Karte auf dem Spielfeld, bis der Zähler
    voll ist.
  </li>
  <li>
    Das Addon markiert die korrekte Karte sofort rot. Bei jeder neuen
    Runde wird die nächste Karte automatisch markiert (kein Hovern mehr
    nötig).
  </li>
</ol>
