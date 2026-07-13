# Von der Library zur Anwendung: Die eigene API auf dem Prüfstand
* Status: accepted
* Workload: 4h
* Decider: [Mia Henrichsmeyer](https://github.com/miahenri)
* Issue: [4](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2026-miahenri/issues/4)
* Date: 2026-13-07

### Notiz - Wichtig!
Ich habe für die Umsetzung dieses Issues ein Projekt verwendet, das bereits von mir selbst erarbeitet wurde und somit nicht neu war. Dadurch ist die Anwendung nun größer als "eine kleine eigenständige Anwendung". Die ursprüngliche Aufgabe war es zwar eine kleine neue Anwendung zu bauen, jedoch hat sich mein altes Projekt aufgrund des Barrierefreiheitsfokus so gut für die Anbindung geeignet, dass ich entschieden habe, diese Anwendung zu verwenden. 

Da sich das alte Projekt (ein barrierearmer Musikplayer für Menschen mit motorischen Einschränkungen) auf alternative Steuermöglichkeiten fokussiert hat und die Überlegung, Gestensteuerung einzubinden, schon damals bestand, habe ich hier eine Chance gesehen verschiedene Projekte, die gut zueinander passen zu verknüpfen. 
Der Musikplayer hatte bereits Funktionen über Shortcuts eingebaut, die nun auch über Gestensteuerung verfügbar sind. Dies passt gut zu dem Gedanken hinter dem Projekt, da sich hier auf die Nutzergruppe der motorisch eingeschränkten Menschen konzentriert wurde, die kleinere Knöpfe vielleicht nicht immer treffgenau bedienen können. Gerade für Menschen, die z.B. einen Tremor haben, sich aber ansonsten noch gut bewegen können, eignet sich eine Gestensteuerung hervorragend.

Da ich nicht sicher war, ob diese Lösung nun 100% die Aufgabe erfüllt, habe ich sie noch nicht im main Branch gepusht. Die Lösung für diesen Issue liegt momentan also im Branch ['feat/issue4'](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2026-miahenri/tree/feat/issue4).

## Context and Problem Statement
In Issue #3 haben Sie eine Library mit strukturierter API gebaut. Jetzt kommt die Bewährungsprobe: Wie gut funktioniert diese API, wenn man sie tatsächlich benutzt?

Bauen Sie eine kleine eigenständige Anwendung, die Ihre Gesture Library als externe Abhängigkeit behandelt. Die Anwendung darf ausschließlich über die öffentliche API mit der Library kommunizieren. Kein Zugriff auf interne Strukturen, keine Abkürzungen.

Wichtiger als die Anwendung selbst ist die Reflexion, die dabei entsteht. Was fehlte in der API? Was war unintuitiv? Was mussten Sie an der Library ändern oder ergänzen, damit die Anwendung funktioniert? Dokumentieren Sie diese Erkenntnisse gewissenhaft — das ist der eigentliche Lerngegenstand dieses Issues.

## Decision Outcome
Die Musikplayer-Anwendung wurde als eigenständige Beispielanwendung eingebunden (liegt im Repo noch in Branch 'feat/issue4'). Die bestehende Player-Logik wurde so angepasst, dass zentrale Aktionen in eigene Funktionen ausgelagert wurden. Dadurch können Buttons, Tastatursteuerung und Gestensteuerung dieselben Funktionen verwenden.

Die Musikplayer-Anwendung importiert die Gesture Library ausschließlich über den öffentlichen Einstiegspunkt (index.js) und es wird nicht direkt auf interne Dateien zugegriffen.

Beispiele für gemeinsame Player-Aktionen:

| Aktion            | Auslösung über Tastatur/Button | Auslösung über Geste |
| ----------------- | ------------------------------ | -------------------- |
| Play / Pause      | Button oder Leertaste          | Pinch                |
| Ton stummschalten | Taste `M`                      | Fist                 |
| Lauter            | Pfeil nach oben                | Thumbs Up            |
| Leiser            | Pfeil nach unten               | Thumbs Down          |
| Nächster Track    | Button                         | Right Arm Up         |
| Vorheriger Track  | Button                         | Left Arm Up          |

**Problem:** Bei der Anbindung der Library wurde ein API-Problem sichtbar: Die Methode `detect(input)` gibt eine Geste über mehrere Frames hinweg mit dem Status `stable` zurück. Wenn man die Gesten nun an Funktionen anbindet, würde die Funktion mehrmals hintereinander ausgeführt werden, da nur geprüft wird, ob die Geste `stable` ist.

**Lösung:** Das Ergebnisobjekt enthält nun zusätzlich das Feld `justBecameStable`. Dieses Feld ist nur in dem Frame `true`, in dem eine Geste zum ersten Mal (pro Ausführung) stabil erkannt wurde.


## Implementation
Die Kamera- und Landmarkerkennung wurde in einer eigenen Datei der Beispielanwendung angebunden. Dort werden MediaPipe und die Gesture Library initialisiert. Die erkannte Geste wird anschließend über eine Callback-Funktion an den Musikplayer übergeben.

Im Musikplayer selbst wurden zentrale Steuerfunktionen angelegt, zum Beispiel für Play/Pause, Lautstärke, Mute und Trackwechsel. Diese Funktionen werden sowohl von den vorhandenen Buttons und Tastatureingaben als auch von der Gestensteuerung verwendet.

Um das Auslösen mehrfacher Funktionen zu verhindern, wurde die Library so erweitert, dass im Gesture-Result zusätzlich `justBecameStable` als Boolean Element enthalten ist. Dieses Feld gibt an, ob eine Geste gerade neu stabil geworden ist.

Die Anwendung kann dadurch Aktionen gezielt nur dann auslösen, wenn `justBecameStable` `true` ist.

## Alternatives Considered
* **Direkt auf `status: "stable"` reagieren**
  * einfach umzusetzen
  * Problem: Aktionen werden mehrfach ausgelöst

* **Cooldown in der Anwendung**
  * schnelle Lösung im Musikplayer
  * Problem: nur lokale Lösung
  * Problem tritt auch in anderen Anwendungen auf

* **`justBecameStable` in der Library**
  * gewählte Lösung
  * klares Signal beim ersten stabilen Erkennen
  * weniger Zusatzlogik in der Anwendung

## Positive Consequences
* Die Anwendung kommuniziert nur über die öffentliche API mit der Library
* Buttons, Tastatursteuerung und Gestensteuerung können dieselben Player-Funktionen verwenden
* Gesten lösen Aktionen nicht mehr mehrfach pro gehaltener Geste aus
* `justBecameStable` macht den Unterschied zwischen „Geste wird gehalten“ und „Geste wurde gerade neu erkannt“ sichtbar

## Negative Consequences
* Das Ergebnisobjekt der Library wird durch ein weiteres Feld etwas umfangreicher
* Anwendungen müssen verstehen, wann sie `stable` und wann sie `justBecameStable` verwenden sollten
* Die Library übernimmt mehr Verantwortung für Zustandswechsel zwischen Gesten

## Links
* API-Dokumentation: `docs/api.md`
* Beispielanwendung: `src/example` (Liegt auf Branch 'feat/issue4')