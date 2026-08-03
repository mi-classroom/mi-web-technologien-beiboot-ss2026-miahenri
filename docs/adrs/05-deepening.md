# Freie Bahn: Vision oder Vertiefung
* Status: accepted
* Workload: 6h
* Decider: [Mia Henrichsmeyer](https://github.com/miahenri)
* Issue: [5](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2026-miahenri/issues/5)
* Date: 2026-03-08

## Context and Problem Statement
Die Basis steht: Library, Demo-Anwendung, erste Erkenntnisse aus dem API-Test in Issue #4. Dieses Issue ist bewusst offen und liegt in der vorlesungsfreien Zeit. Wählen Sie einen von zwei Wegen.

### Weg A: Die Vision-Anwendung
Bauen Sie eine Anwendung, die zeigt, was mit Ihrer Library wirklich möglich ist, wenn man richtig Zeit reinsteckt. Thema frei. Anspruch höher als bei Issue #4: durchdachte Interaktion, sauberes UX, ein Ergebnis, das Sie auch außerhalb der Veranstaltung zeigen würden.

### Weg B: Die Vertiefung
Nehmen Sie eine Schwachstelle, die Ihnen beim Bauen aufgefallen ist, und lösen Sie sie richtig. Zum Beispiel: Performance unter Last, Robustheit und Fehlertoleranz der Gestenerkennung, Latenz, Genauigkeit bei schlechten Lichtverhältnissen, Barrierefreiheit, oder ein sauber durchdachtes neues Gestenvokabular. Kein neues Projekt, sondern echte Tiefenarbeit an einem bestehenden Problem.

Entscheiden Sie sich für einen Weg. Beide sind gleichwertig, es geht nicht darum welcher Weg mehr zählt, sondern welcher zu Ihrem Interesse passt.

## Decision Outcome
-> Entscheidung für **Weg B**
Durch die Umsetzung von Issue #4 mit der Musikplayer-Anwendung besteht bereits eine passende Anwendung, mit der die Funktionen der Gesture Library sinnvoll demonstriert werden können. Deshalb liegt der Fokus in Issue #5 nicht auf einer neuen Vision-Anwendung, sondern auf der Vertiefung der Library.

Ich habe mich für Weg B entschieden, um eine bestehende Schwachstelle der Library gezielt zu verbessern. Die Verbesserung soll die Library robuster machen und sie zugleich besser für die Anbindung an den Musikplayer nutzbar machen. So entsteht am Ende des Projekts sowohl eine weiterentwickelte Library als auch eine Anwendung, die ihre Funktionen praktisch zeigt.

Die konkreten Probleme, die sich aus einem Text der Anwendung ergaben waren folgende: 
- Handgesten werden teilweise verwechselt
- Fist wird manchmal fälschlich erkannt (besonders wenn Hand zu weit weg ist)
- Fist und Thumbs Up liegen zu nah beieinander und werden teilweise vertauscht
- Gesten sind abhängig von Abstand zur Kamera (Pixelschwellenwert)
- Far- und Near-Gesten müssen sauber getrennt bleiben
- Die Musikplayer-Anwendung braucht zuverlässige, nicht versehentliche Auslösung

Diese wurden in Issue 5 betrachtet und verbessert.


## Implementation
Die bestehenden Gesten wurden überarbeitet, damit sie weniger abhängig vom Abstand zur Kamera sind. Feste Pixelwerte wurden durch relative Werte auf Basis der Handgröße ersetzt. Außerdem wurde die Erkennung von Fist und Thumbs Up klarer getrennt, indem geprüft wird, ob der Daumen tatsächlich ausgestreckt ist.

Zusätzlich wurde die Near-/Far-Logik stabilisiert. Der Modus wechselt nicht mehr sofort pro Frame, sondern erst nach mehreren stabilen Frames. Dadurch bleibt near auch bei kurzen Aussetzern der Handerkennung erhalten und no-hand wird nicht automatisch wie far behandelt.

Als größere strukturelle Verbesserung wurde eine neue Browser-Schicht in der Library ergänzt. Der neue GestureWebcamController kapselt die MediaPipe-Initialisierung, den Webcam-Start, den predictWebcam-Loop, die Moduslogik und die Verwaltung der Near- und Far-Gesten. Anwendungen wie die Demo oder der Musikplayer müssen dadurch nicht mehr selbst diese Logik implementieren, sondern können Gesten über Callbacks nutzen.


### Positive Consequences <!-- optional -->
- einfachere Anbindung der Library an Browser-Anwendungen
- weniger doppelte Logik in Demo und Musikplayer
- sauberere Trennung zwischen Core-Erkennung und Webcam-Steuerung
- robustere Unterscheidung zwischen near, far und no-hand
- Gesten sind weniger abhängig von festen Pixelwerten
- Musikplayer kann die Library über eine deutlich kleinere Schnittstelle nutzen


## Negative Consequences
- die Library enthält nun zusätzlich browser- und MediaPipe-spezifische Logik
- die Struktur der Library ist etwas komplexer geworden
- es gibt nun zwei Nutzungsebenen: Low-Level-Erkennung und High-Level-Webcam-Controller
- Anwendungen müssen entscheiden, welche Ebene sie verwenden möchten

## Links <!-- optional -->
