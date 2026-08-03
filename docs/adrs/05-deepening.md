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


### Positive Consequences <!-- optional -->


## Links <!-- optional -->
