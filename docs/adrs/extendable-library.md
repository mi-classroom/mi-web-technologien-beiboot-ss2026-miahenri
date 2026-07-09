# Aufbau einer erweiterbaren Gesture Library

* Status: accepted
* Workload: 6h
* Decider: [Mia Henrichsmeyer](https://github.com/miahenri)
* Issue: [3](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2026-miahenri/issues/3)
* Date: 2026-09-07

## Context and Problem Statement
Nachdem in Issue #2 erste Gesten prototypisch erkannt wurden, sollte die Gestenerkennung in eine erweiterbare Library-Struktur überführt werden. In der ersten Umsetzung lagen Erkennungslogik, Demo-Code und teilweise Hilfsfunktionen noch eng beieinander. Dadurch wäre es bei weiteren Gesten schnell unübersichtlich geworden und neue Gesten hätten Änderungen an bestehender Logik erfordert.

Ziel war es deshalb, die eigentliche Gesture Library von der Demo-Anwendung zu trennen. Die Library soll registrierte Gesten auf Basis von Landmark-Daten erkennen und unabhängig davon bleiben, wie diese Daten eingelesen oder visualisiert werden. Das Einlesen der Daten über MediaPipe, der Webcam-Zugriff und die Canvas-Visualisierung sollen dagegen Teil der Demo bleiben.

Außerdem sollten neue Gesten hinzugefügt werden können, ohne den zentralen `GestureRecognizer` verändern zu müssen. Dafür musste eine feste Gestenschnittstelle definiert werden, über die einzelne Gesten registriert und geprüft werden können.

## Decision Outcome
Die Anwendung wurde in eine Demo-Struktur und eine Library-Struktur aufgeteilt.

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

Die eigentliche Library liegt im Ordner `src/lib`. Dort befinden sich der `GestureRecognizer`, gemeinsame Hilfsfunktionen und die einzelnen Gesten. Die Demo-spezifischen Bestandteile wurden in `src/demo` ausgelagert. Dazu gehören die Initialisierung von MediaPipe sowie das Zeichnen der Landmark-Daten auf dem Canvas.

Der `GestureRecognizer` kennt keine konkreten Gesten mehr. Stattdessen werden Gesten über `registerGesture()` registriert. Jede Geste besitzt eine feste Struktur mit einer eindeutigen `id`, einem lesbaren `name` und einer `detect(input)`-Funktion.

Neue Gesten werden in einer eigenen Datei im Ordner `src/lib/gestures/` angelegt, im Gesten-Index exportiert und anschließend im Zielsystem registriert. Der `GestureRecognizer` muss dafür nicht angepasst werden.

Aktuell umgesetzte Gesten:

| Geste       | ID            | Beschreibung                                   |
| ----------- | ------------- | ---------------------------------------------- |
| Pinch       | `pinch`       | Daumen und Zeigefinger liegen nah beieinander. |
| Fist        | `fist`        | Die Finger sind zur Faust geschlossen.         |
| Thumbs Up   | `thumbs-up`   | Der Daumen zeigt nach oben.                    |
| Thumbs Down | `thumbs-down` | Der Daumen zeigt nach unten.                   |

## Implementation

### Library-Struktur
Die Gestenerkennung wurde in den Ordner `src/lib` ausgelagert. Über `src/lib/index.js` gibt es einen zentralen Einstiegspunkt, über den der `GestureRecognizer`, die Hilfsfunktionen und die vorhandenen Gesten importiert werden können. Die einzelnen Gesten liegen jeweils in eigenen Dateien im Ordner `src/lib/gestures/`.

### GestureRecognizer und Gestenschnittstelle
Der `GestureRecognizer` enthält keine fest eingebauten Gesten mehr. Stattdessen werden Gesten über `registerGesture()` registriert und anschließend mit `detect(input)` geprüft. Jede Geste folgt einer festen Schnittstelle mit `id`, `name` und `detect(input)`. Dadurch können neue Gesten ergänzt werden, ohne den `GestureRecognizer` selbst zu verändern.

### Trennung von Demo und Library
Der Demo-Code wurde aus der Library herausgehalten. Die Datei `demo/mediapipe.js` ist für das Initialisieren der MediaPipe-Modelle zuständig. Die Datei `demo/drawing.js` enthält die Funktionen zum Zeichnen der Hand- und Pose-Landmarks auf dem Canvas.

Die Datei `main.js` verbindet die Demo-Bestandteile mit der Library. Sie startet die Kamera, erzeugt das Input-Objekt für die Gestenerkennung und gibt das Ergebnis in der Oberfläche aus.

Die Library selbst liest keine Webcam-Daten ein und initialisiert auch kein MediaPipe. Sie erwartet bereits vorhandene Landmark-Daten als Input.

Genauere Informationen zur Struktur und Implementierung der Library sind in der API Dokumentation unter `docs/api.md` zu finden.

## Positive Consequences
**Erweiterbarkeit:**
* Neue Gesten können hinzugefügt werden, ohne den `GestureRecognizer` zu verändern.
* Jede Geste liegt in einer eigenen Datei und kann dadurch gezielt bearbeitet werden.

**Struktur:**
* MediaPipe-Initialisierung und Canvas-Zeichnung liegen außerhalb der eigentlichen Library.
* Die Library kann grundsätzlich auch mit anderen Quellen für Landmark-Daten verwendet werden.
* Der zentrale Einstiegspunkt `src/lib/index.js` vereinfacht die Verwendung der Library.

**Wartbarkeit:**
* Der Code ist übersichtlicher, weil nicht alle Gesten in einer großen Datei liegen.
* Gemeinsame Hilfsfunktionen liegen in `utils.js` und müssen nicht in jeder Geste neu geschrieben werden.
* Änderungen an einer Geste beeinflussen andere Gesten weniger stark.

## Negative Consequences
* Durch die Aufteilung entstehen mehr Dateien und Imports.
* Für neue Gesten müssen mehrere Stellen angepasst werden, zum Beispiel die neue Gesture-Datei, der Gesten-Index und gegebenenfalls der zentrale Library-Export.
* Die Reihenfolge der Registrierung kann relevant sein, wenn mehrere Gesten gleichzeitig erkannt werden könnten.

## Links
* API-Dokumentation: `docs/api.md`
* Library-Code: `src/lib`
* Demo-Code: `src/demo`
