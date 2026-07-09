[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Qff1715V)

# Begleitendes Projekt zum Modul Web Technologien im Sommersemester 2026
Zum Modul Web Technologien gibt es ein begleitendes Projekt. Im Rahmen dieses Projekts werden wir von Veranstaltung zu Veranstaltung ein Projekt sukzessive weiter entwickeln und uns im Rahmen der Veranstaltung den Fortschritt anschauen, Code Reviews machen und Entwicklungsschritte vorstellen und diskutieren.
Als organisatorischen Rahmen für das Projekt nutzen wir GitHub Classroom. 

## 👋 Gestenbasierte Steuerung im Browser
Dieses Projekt ist eine browserbasierte Demo zur Erkennung von Handgesten mit MediaPipe. Die Anwendung nutzt die Webcam, erkennt Hand- und Pose-Landmarks und übergibt diese Daten an eine eigene kleine Gesture-Library.

Die eigentliche Gestenerkennung liegt im Ordner `src/lib/`. Die Demo-Anwendung liegt in `src/main.js` und `src/demo/` und ist für Kamera, MediaPipe-Setup, Canvas-Zeichnung und UI-Ausgabe zuständig.

### Aktuelle Funktionen
- Webcam-basierte Handerkennung mit MediaPipe
- Unterscheidung zwischen Nah- und Distanzmodus
- Erkennung registrierter Gesten über eine eigene Library-Struktur
- Aktuell implementierte Gesten:
  - Pinch
  - Fist
  - Thumbs Up
  - Thumbs Down
- Stabilisierung erkannter Gesten über mehrere Frames
- Erweiterbare Struktur für neue Gesten

## Projektstruktur
```txt
src/
├── main.js
├── style.css
├── demo/
│   ├── drawing.js
│   └── mediapipe.js
└── lib/
    ├── index.js
    ├── GestureRecognizer.js
    ├── utils.js
    └── gestures/
        ├── index.js
        ├── pinch.js
        ├── fist.js
        ├── thumbsUp.js
        └── thumbsDown.js
```

## Projekt lokal ausführen

### Voraussetzungen

Für das Projekt wird Node.js benötigt. Außerdem muss der Browser Zugriff auf eine Webcam haben.

### Repository herunterladen

```bash
git clone <repository-url>
cd <repository-name>
````
### Abhängigkeiten installieren und Entwicklungsserver starten
Das Projekt nutzt Vite. Die Demo kann deshalb mit folgendem Befehl gestartet werden:

```bash
npm install
npm run dev
````
Vite gibt danach im Terminal eine lokale Adresse aus, zum Beispiel:
http://localhost:5173/

### Demo testen
1. Im Browser die lokale Vite-Adresse öffnen.
2. Auf den Startbutton klicken.
3. Den Zugriff auf die Webcam erlauben.
4. Eine Hand vor die Kamera halten.
5. Die Anwendung zeigt erkannte Hand- oder Pose-Daten sowie erkannte Gesten an.


## 📋 Dokumentation
Die Dokumentation zur Umsetzung des Projekts und die Details zu den unterschiedlichen Architectual Decision Records (ADRs) sind unter `docs/adrs/` zu finden, sowie in der API Dokumentation unter `docs/api.md`.

## 👩🏽‍💻 Mitwirkende
Contributor: [Mia Henrichsmeyer](https://github.com/miahenri)

---
Dokumentieren Sie in diesem Beibootprojekt Ihre Entscheidungen gewissenhaft unter Zuhilfenahme von [Architectual Decision Records](https://adr.github.io) (ADR).

Hier ein paar ADR Beispiele aus dem letzten Semestern:
- https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2022-Moosgloeckchen/tree/main/docs/decisions
- https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2022-mweiershaeuser/tree/main/adr
- https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2022-twobiers/tree/main/adr
