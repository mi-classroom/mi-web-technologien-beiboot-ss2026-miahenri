# Erkennung von ersten Gesten
* Status: accepted
* Workload: 6h
* Decider: [Mia Henrichsmeyer](https://github.com/miahenri)
* Issue: [2](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2026-miahenri/issues/2)
* Date: 2026-02-06

## Context and Problem Statement
### Schritt 1
Erstellen Sie ein Mapping typischer Interaktionsmuster auf mögliche Gesten und bewerten Sie, wie gut sich diese mit den Daten aus Issue #1 tatsächlich umsetzen lassen. Das Ergebnis ist keine fertige Implementierung, sondern eine fundierte Grundlage für die Entscheidungen in Schritt 2.

### Schritt 2
Wählen Sie ein bis zwei Gesten aus Ihrer Tabelle aus und implementieren Sie diese prototypisch. Entwickeln Sie dafür einen ersten Algorithmus oder eine Heuristik, die aus den Rohkoordinaten eine diskrete, benannte Geste macht.

Fragen, die Sie dabei leiten sollten: Wie stabilisieren Sie das Signal? Wie verhindern Sie False Positives? Wie unterscheiden Sie eine Absicht von einer zufälligen Bewegung?

## Decision Outcome
| Funktion | Geste nah | Benötigte Daten | Geste weit | Benötigte Daten |
|---|---|---|---|---|
| Vor | Zeigefinger zeigt nach rechts | Handpose und Hand-/Fingerkoordinaten | Arm zeigt nach rechts | Armkoordinaten |
| Zurück | Zeigefinger zeigt nach links | Handpose und Hand-/Fingerkoordinaten | Arm zeigt nach links | Armkoordinaten |
| Hoch | Daumen hoch | Handpose | Arm/Unterarm nach oben halten | Armkoordinaten |
| Runter | Daumen runter | Handpose | Arm/Unterarm nach unten halten | Armkoordinaten |
| Zoom in | Reverse-Pinch-Geste | Finger- und Handkoordinaten, eventuell Handpose | Hände vor dem Körper zusammenführen und Arme anschließend diagonal auseinanderziehen | Arm- und Handkoordinaten |
| Zoom out | Pinch-Geste | Handkoordinaten | Hände vor dem Körper diagonal zusammenführen | Arm- und Handkoordinaten |
| Start | Offene Hand direkt vor die Kamera halten | Handpose | Beide Arme nach oben halten | Armkoordinaten und eventuell Körperpose |
| Stop | Faust vor die Kamera halten | Handpose | Noch festzulegen; möglicherweise gleiche Geste wie Start | Armkoordinaten und eventuell Körperpose |

Zu implementierende Gesten: 
- Pinch Geste (Zoom out) - Die Geste ist als Start gut geeignet, da man eigentlich nur mit zwei HandLandmarks arbeiten muss (Daumenspitze(4) und Zeigefingerspitze (8)). Die Umsetzung ist vergleichsweise einfach, da man hier nur den Abstand der beiden Fingerspitzen berechnen und auswerten muss.
- Faust vor Kamera halten (Stopp) - Diese Geste bietet sich gut für den Anfang an, da man auch hier nur auf die Entfernung der unterschiedlichen Punkte schaut und diese berechnen muss. 
Beide Gesten beziehen sich außerdem erstmal nur auf eine Hand, sodass man sich nicht mit mehreren Händen befassen muss für die erste Implementierung der Gesten. 

## Implementation
### Pinch Geste
Bei der Pinch Geste werden die beiden Fingerspitzen des Daumens und des Zeigefingers erkannt. Der Abstand zwischen den beiden wird berechnet und wenn er unter dem threshold von 30 Pixeln liegt wird getestet, ob eine Pinch Geste vorliegt. Wenn das Bild nach 15 Gesture Frames immernoch eine Pinch Geste anzeigt, wird die Geste als "erkannt" angezeigt.

### Faust Geste
Für die Faust Geste werden zunächst die Fingerspitzen aller Finger erkannt und in einem Array gespeichert. Für jedes Element des Arrays wird dann der Abstand zum Handgelenk berechnet, da dieser bei einer Faust Geste deutlich kleiner wird. Aus den 5 Abständen wird anschließend die Durchschnittsentfernung berechnet und wenn diese unter dem threshold von 80 Pixeln liegt, wird die Faust Geste getestet. Die Entfernung des Daumens (Spitze) zum ersten Knöchel des zeigefingers (6) wird nochmal zusätzlich gemessen, da diese Punkte sich bei einer Faust (in dieser Annahme) berühren bzw sehr nah sind. Wenn sowohl Durschnittsentfernuhng der Fingerspitzen als auch die Entfernung von Daumenspitze zu Knöchel des Zeigefingers für mindetsens 15 Gesture Frames unter dem Vergleichswert liegt, wird die Faus Geste als "erkannt" angezeigt.

### Positive Consequences <!-- optional -->
**Datenqualität:**
* False Positives eher weniger 
* Gesten werden teilweise vertauscht bzw. wenn man eine Faust macht wird häufig ein Pinch erkannt
* Auf weiterer Entfernung werden Gesten erkannt, obwohl sie gar nicht verwendet wurden (konnte gelöst werden durch Anbindung von unterschiedlichen Modi für nah und weit)
* Gesten können immer nur auf der "First Hand" erkannt werden, sobald eine zweite Hand im Bild auftaucht und eine Geste macht wird diese nicht erkannt
* Ansonsten (Hand vorne im Bild und relativ gerade) ist die Gestenerkennung soweit zuverlässig 


## Links <!-- optional -->
