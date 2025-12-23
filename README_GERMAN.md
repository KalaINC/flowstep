# FlowStep - AI-Automated Code-to-Support-Flow Visualizer

FlowStep ist ein Tool, um komplexe Codelogik in saubere, einfach zu verstehende, interaktive Prozessdiagramme zu konvertieren. Perfekt für die Schnittstelle zwischen Development und Support.
Das Tool ist nicht dafür gedacht Support Mitarbeitern eine Prüfungscheckliste zu bauen oder Code in seiner Komplexität darzustellen, sondern den Kollegen zu helfen den Ablauf des Codes zu verstehen um das logische Schlüsse zur Nichtfunktion des Moduls treffen zu können.

## Voraussetzungen

Bevor du startest, muss **Node.js** auf deinem Rechner installiert sein. 
*Falls du normalerweise kein React/Frontend machst: Node.js ist die Laufzeitumgebung, die dieses Tool im Hintergrund antreibt.*

1. Lade Node.js (LTS Version) hier herunter: [nodejs.org](https://nodejs.org/)
2. Installiere es mit den Standard-Einstellungen.

## Schnellstart (Lokal ausführen)

Wenn du den Ordner entpackt hast, öffne dein Terminal (Eingabeaufforderung oder PowerShell) in diesem Ordner und gib folgende Befehle ein:

1. **Abhängigkeiten installieren:**

```bash
npm install
```
(Das lädt einmalig alle benötigten Bibliotheken wie React und Tailwind herunter. Es entsteht ein Ordner node_modules, den du ignorieren kannst.)

### Editor starten, der workflow und wichtige Informationen:

🛫 App starten:
```bash
npm run dev
```
```bash
Öffnen: Klicke auf den Link im Terminal oder öffne ihn manuell im Browser.
z.B: ➜ Local:   http://localhost:3000/
```

💡 Der Workflow (80/20 Prinzip)  
80% bereits fertig / 20% - das finish - machst du selbst  
Logik-Extraktion: Kopiere deinen Code und lass dir von einer KI (lokal oder cloud) (z.B. Gemini (beste Resultate bei tests)) mit dem passenden FlowStep-Prompt (.txt im VZ) die Logik-Daten im JSON-Format erstellen.

1. Import: Ersetze den Inhalt der **constants.tsx komplett** mit dem dir ausgelieferten Code der KI. Falls nicht sofort sichtbar, drücke rechts auf "Restore Defaults".

2. Feinschliff: Passe die Positionen der Boxen (Nodes) kurz manuell an. Schau dir unter "Sequence" die Sequenz an ob sie dir passt.

3. Export: Klicke auf "Export Portable HTML". Du erhältst eine einzige, kleine read-only .html Datei.

📦 Auslieferung & Support
Die exportierte HTML-Datei ist völlig unabhängig. Du kannst sie dem Support schicken, in dein Wiki einbetten oder einfach im Browser öffnen. Sie benötigt kein Node.js und keinen Server.

Viel Erfolg beim Visualisieren!

> [!IMPORTANT]
#### ⚠️ Wichtige Infos zu Save, Copy, Restore und Export – damit alles reibungslos läuft und du nicht denkst "meh, funktioniert nicht" ⚠️

"Browser Save"
Save (Speichern): Der Save-Button speichert deinen aktuellen Stand im LocalStorage deines Browsers. Wenn du die Seite neu lädst, bleibt dein Fortschritt erhalten. 
Achtung: Das schreibt nicht zurück in deine constants.tsx Datei auf der Festplatte. Wenn du "hard save" willst benutzte Copy.

"Hard Save"
Copy (Kopieren/Hard Save): Dieser Button kopiert den kompletten Code deines aktuellen Stands, für deine constants.tsx in die Zwischenablage. 
Um deine Arbeit "hart" zu speichern, ersetze den **kompletten** Inhalt deiner lokalen constants.tsx Datei mit diesem kopierten Code.

Restore Defaults (Standard wiederherstellen): Dieser Button setzt den Editor auf den Stand zurück, der aktuell in deiner constants.tsx Datei steht. 
Nutze das, wenn du einen alten Stand aus LocalStorage siehst oder komplett von vorne anfangen willst.

Export Portable HTML: Diese Funktion nutzt die Daten aus deinem LocalStorage, um die HTML-Datei zu generieren. 
Wichtig: Drücke immer erst auf "Save", bevor du den Export startest, damit auch wirklich dein neuester Stand im Dokument landet.

# Tips & Tricks

➡️ ⬇️ Gerade Pfeile ziehen:
Wenn es nicht möglich erscheint einen geraden Pfeil von einer Node zu der anderen zu ziehen, liegt das womöglich am import Code der KI, hier sind die Nodes noch nicht im Grid eingeschnappt. 
Bewege kurz alle Nodes 1x hin und her und nutze dann die Align X oder Align Y Funktion.
