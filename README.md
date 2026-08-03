# Begleitendes Projekt zum Modul Web Technologien im Sommersemester 2026
Zum Modul Web Technologien gibt es ein begleitendes Projekt. Im Rahmen dieses Projekts werden wir von Veranstaltung zu Veranstaltung ein Projekt sukzessive weiter entwickeln und uns im Rahmen der Veranstaltung den Fortschritt anschauen, Code Reviews machen und Entwicklungsschritte vorstellen und diskutieren. Als organisatorischen Rahmen für das Projekt nutzen wir GitHub Classroom.

## Gestenbasierte Steuerung im Browser
Dieses Projekt ist eine browserbasierte Anwendung zur Erkennung von Hand- und Körpergesten mit MediaPipe. Die Webcam-Daten werden ausgewertet und an eine eigene Gesture Library übergeben, die registrierte Gesten erkennt und stabilisiert.

Die Library liegt im Ordner `src/lib/` und besteht aus zwei Ebenen:

| Ebene         | Aufgabe                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Low-Level API | Gesten aus vorhandenen Landmark-Daten erkennen                                                 |
| Browser API   | Webcam starten, MediaPipe initialisieren, Modus erkennen und Gesten über Callbacks zurückgeben |

Die Demo-Anwendung in `src/main.js` zeigt die Live-Erkennung der Gesten und visualisiert Hand- und Pose-Daten. Zusätzlich gibt es im Ordner `src/example/` eine Musikplayer-Anwendung, die die Library praktisch nutzt.

## Aktuelle Funktionen
* Webcam-basierte Hand- und Pose-Erkennung mit MediaPipe
* eigene Gesture Library mit registrierbaren Gesten
* High-Level-Anbindung über `GestureWebcamController`
* Unterscheidung zwischen `near`, `far` und `no-hand`
* Stabilisierung erkannter Gesten über mehrere Frames
* einmalige Auslösung stabiler Gesten über `justBecameStable`
* Beispielanwendung: Musikplayer-Steuerung über Gesten
* erweiterbare Struktur für eigene Gesten

Aktuell implementierte Gesten:

| Geste        | Modus  | Beispielaktion im Musikplayer |
| ------------ | ------ | ----------------------------- |
| Pinch        | `near` | Play/Pause                    |
| Fist         | `near` | Ton an/aus                    |
| Thumbs Up    | `near` | Lauter                        |
| Thumbs Down  | `near` | Leiser                        |
| Left Arm Up  | `far`  | Vorheriger Track              |
| Right Arm Up | `far`  | Nächster Track                |
| Both Arms Up | `far`  | Loop an/aus                   |

## Projektstruktur

```txt
src/
├── main.js
├── style.css
├── demo/
│   └── drawing.js
├── example/
│   └── ...
└── lib/
    ├── browser/
    │   ├── GestureWebcamController.js
    │   └── mediapipe.js
    ├── gestures/
    │   ├── armsUp.js
    │   ├── fistGesture.js
    │   ├── pinchGesture.js
    │   └── thumbsGestures.js
    ├── GestureRecognizer.js
    ├── gestures.js
    ├── index.js
    └── utils.js
```

## Deployment
Das Projekt ist über Github Pages deployt und läuft [hier](https://mi-classroom.github.io/mi-web-technologien-beiboot-ss2026-miahenri/).
Die Musikplayer Anwendung kann [hier](https://mi-classroom.github.io/mi-web-technologien-beiboot-ss2026-miahenri/src/example/src/player.html) getestet werden.

## Projekt lokal ausführen

### Voraussetzungen

Für das Projekt wird Node.js benötigt. Außerdem muss der Browser Zugriff auf eine Webcam haben.

### Repository herunterladen

```bash
git clone <repository-url>
cd <repository-name>
```

### Abhängigkeiten installieren und Entwicklungsserver starten

Das Projekt nutzt Vite. Die Anwendung kann deshalb mit folgenden Befehlen gestartet werden:

```bash
npm install
npm run dev
```

Vite gibt danach im Terminal eine lokale Adresse aus, zum Beispiel:

```txt
http://localhost:5173/
```

Diese Adresse im Browser öffnen.

## Demo testen

1. Im Browser die lokale Vite-Adresse öffnen.
2. Auf den Startbutton klicken.
3. Den Zugriff auf die Webcam erlauben.
4. Eine Hand oder den Körper vor die Kamera halten.
5. Die Anwendung zeigt erkannte Landmark-Daten, den aktuellen Modus und erkannte Gesten an.

## Musikplayer testen

Die Musikplayer-Anwendung befindet sich im Ordner `src/example/`. Sie nutzt die Gesture Library über den `GestureWebcamController`.

In der Anwendung können Audiodateien ausgewählt und anschließend über Buttons, Tastatur oder Gesten gesteuert werden.

Beispiele:

* `Pinch`: Play/Pause
* `Fist`: Ton an/aus
* `Thumbs Up`: Lauter
* `Thumbs Down`: Leiser
* `Right Arm Up`: Nächster Track
* `Left Arm Up`: Vorheriger Track

## Dokumentation

Die Dokumentation zur API befindet sich unter:

```txt
docs/api.md
```

Die Architecture Decision Records befinden sich unter:

```txt
docs/adrs/
```

Dort werden zentrale technische Entscheidungen, Alternativen und Konsequenzen dokumentiert.

## Mitwirkende

Contributor: [Mia](https://github.com/miahe)

---

Dokumentieren Sie in diesem Beibootprojekt Ihre Entscheidungen gewissenhaft unter Zuhilfenahme von [Architecture Decision Records](https://adr.github.io) (ADR).

ADR-Beispiele aus früheren Semestern:

* https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2022-Moosgloeckchen/tree/main/docs/decisions
* https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2022-mweiershaeuser/tree/main/adr
* https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2022-twobiers/tree/main/adr
