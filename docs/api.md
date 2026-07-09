# Gesture Library API Documentation

## 1. Überblick
Die Library erkennt registrierte Gesten auf Basis von Landmark-Daten. In diesem Projekt werden diese Daten über MediaPipe eingelesen und an die Library übergeben. Dort wird ausgewertet, in welcher Position sich Hände befinden und ob diese Haltung einer registrierten Geste entspricht.

Perspektivisch sollen auch Arme beziehungsweise Körperposen in die Auswertung einbezogen werden. Außerdem können über vorgesehene Anknüpfungspunkte eigene weitere Gesten implementiert und in der Library registriert werden.

Die Anwendung selbst dient als Demonstration der Library. Für die eigentliche Nutzung wird hauptsächlich der Ordner `src/lib` benötigt sowie ein entsprechender Anknüpfungspunkt im Zielsystem, in diesem Projekt zum Beispiel `main.js`. Der Ordner `demo` enthält dagegen Code, der nur für die Live-Demo relevant ist: Dort werden MediaPipe initialisiert und die erkannten Daten auf dem Kamerabild visualisiert.

Die Definition und Erkennung der einzelnen Gesten bleibt intern in der Library gekapselt. Nutzer der Library müssen die konkrete Erkennungslogik nicht verändern, sondern können Gesten über die vorgesehene Schnittstelle registrieren oder eigene Gesten ergänzen.
Das Einlesen der Daten über die Webcam sowie die Ausgabe und Visualisierung der erkannten Daten sind dagegen Teil der Demo-Anwendung. Diese Aufgaben liegen außerhalb der eigentlichen Library, zum Beispiel in `main.js` und im Ordner `demo`.


## 2. Anwendungsszenarien
Die Library kann in Anwendungen eingesetzt werden, in denen eine Steuerung über Handgesten sinnvoll ist. Besonders geeignet ist sie für browserbasierte Prototypen, bei denen Interaktionen ohne Maus, Tastatur oder Touchscreen getestet werden sollen.

Ein mögliches Anwendungsszenario ist die Steuerung von Präsentationen. Dabei könnten Gesten wie „Thumbs Up“ oder „Thumbs Down“ genutzt werden, um zwischen Folien zu wechseln oder bestimmte Aktionen auszulösen. Auch eine „Pinch“-Geste könnte verwendet werden, um Inhalte auszuwählen oder Zoom-Funktionen zu steuern.

Ein weiteres Szenario ist die barrierearme oder kontaktlose Interaktion mit digitalen Oberflächen. Nutzer könnten einfache Gesten verwenden, um eine Anwendung zu bedienen, ohne direkt mit einem Gerät interagieren zu müssen. Dadurch eignet sich die Library vor allem für experimentelle Interfaces, Installationen oder Human-Computer-Interaction-Prototypen.

In der aktuellen Version liegt der Fokus auf statischen Handgesten. Dynamische Gesten wie Wischen, Ziehen oder Zwei-Hand-Zoom können später ergänzt werden, benötigen aber zusätzliche Bewegungsdaten über mehrere Frames.


## 3. Installation und Import
Um die Library in einem Projekt anzubinden, muss zunächst der `src/lib` Ordner übernommen werden und anschließend die darin enthaltenen Elemente im eigenen Projekt importiert werden. Etwa so:

```js
import {
  GestureRecognizer,
  createGestureUtils,
  pinchGesture,
  fistGesture,
  thumbsUpGesture,
  thumbsDownGesture,
} from "../src/lib/index.js";
```

Wichtig: Dabei ist zu beachten, dass nach diesen Schritten zwar die Library angebunden ist, jedoch noch keine Landmarks eingelesen werden, die verarbeitet werden können. Dies ist zusätzlich zu tun und kann zum Beispiel wie in der Demo über MediaPipe oder anderweitige ML-Librarys gelöst werden.


## 4. Grundlegende Anwendung
Die zentrale Klasse der Library ist der `GestureRecognizer`. Über diese Klasse werden Gesten registriert und anschließend anhand der übergebenen Landmark-Daten erkannt. Beim Erstellen des `GestureRecognizer` kann festgelegt werden, über wie viele Frames eine Geste erkannt werden muss, bevor sie als stabil gilt.

```js
const recognizer = new GestureRecognizer({
  requiredGestureFrames: 15,
});
```

Anschließend werden die Gesten registriert, die erkannt werden sollen. Die Gesten werden dabei über `registerGesture()` hinzugefügt. Der `GestureRecognizer` muss für neue Gesten nicht angepasst werden, solange diese dem vorgesehenen Aufbau einer Geste entsprechen.

```js
recognizer.registerGesture(pinchGesture);
recognizer.registerGesture(fistGesture);
recognizer.registerGesture(thumbsUpGesture);
recognizer.registerGesture(thumbsDownGesture);
```

Für die Erkennung wird ein Input-Objekt erstellt. Dieses enthält die erkannten Hand-Landmarks, den aktuellen Interaktionsmodus und Hilfsfunktionen, die von den einzelnen Gesten verwendet werden können.

```js
const gestureInput = {
  hands: handResults.landmarks ?? [],
  mode: "near",
  utils: gestureUtils,
};
```

Dieses Input-Objekt wird anschließend an die Methode `detect()` übergeben. Die Library prüft dann die registrierten Gesten und gibt ein Ergebnisobjekt zurück. Dieses Ergebnis kann zum Beispiel verwendet werden, um eine Ausgabe in der Oberfläche zu aktualisieren oder eine Aktion auszulösen.

```js
const result = recognizer.detect(gestureInput);
```


## 5. Öffentliche API


### Gesture Recognizer
Der GestureRecognizer ist die zentrale Klasser der Library und verwaltet die registrierten Gesten. Hier werden die Landmark-Daten auf vorhandene Gesten geprüft und die erkannten Gesten über mehrere Frames stabilisiert. 

### Konstruktor
```js
const recognizer = new GestureRecognizer({
  requiredGestureFrames: 15,
});
```
Im Kontruktor wird ein neuer GestureRecognizer angelegt. Mit requiredGestureFrames wird festgelegt, über wie viele Frames die Geste gehalten werden muss, damit sie vom GestureRecognizer sicher erkannt wird.

### registerGesture(gesture)
```js
recognizer.registerGesture(thumbsUpGesture);
```

Neue Gesten werden über registerGesture registriert. So können neue Gesten ergänzt werden ohne den Recognizer zu verändern. 
Um eine neue Geste zu registrieren, muss eine feste Struktur eingehalten werden: 

```js
export const customGesture = {
  id: "custom-gesture",
  name: "Custom Gesture",

  detect(input) {
    const hand = input.hands[0];

    if (!hand) {
      return null;
    }

    const isDetected = true; // hier steht die eigene Erkennungslogik

    if (!isDetected) {
      return null;
    }

    return {
      isActive: true,
      details: "Custom Gesture wurde erkannt",
    };
  },
};
```
Eine Geste besteht aus einer eindeutigen technischen ID, einem lesbaren Namen und einer detect-Funktion. Die detect-Funktion erhält das Input-Objekt der Library und gibt entweder null oder ein Ergebnisobjekt zurück. null bedeutet, dass die Geste im aktuellen Frame nicht erkannt wurde.

### detect(input)
Die Methode `detect(input)` ist für die eigentliche Gestenerkennung zuständig. Sie erhält ein Input-Objekt mit den aktuellen Landmark-Daten und prüft diese gegen alle registrierten Gesten.

In der Demo wird `detect(input)` pro Videoframe aufgerufen, sobald sich die Anwendung im Nahmodus befindet. Der `GestureRecognizer` geht dabei die registrierten Gesten durch und prüft, ob eine der Gesten im aktuellen Frame erkannt wird.

```js
const result = recognizer.detect(gestureInput);
```

Das übergebene `gestureInput` enthält die Daten, die von den einzelnen Gesten zur Auswertung benötigt werden:

```js
const gestureInput = {
  hands: handResults.landmarks ?? [],
  mode: "near",
  utils: gestureUtils,
};
```

Wenn eine Geste erkannt wird, wird sie nicht sofort als stabil gewertet. Stattdessen zählt der `GestureRecognizer`, wie viele Frames hintereinander dieselbe Geste erkannt wurde. Erst wenn die Anzahl der erkannten Frames den Wert `requiredGestureFrames` erreicht, erhält das Ergebnis den Status `stable`.

Wird keine registrierte Geste erkannt, gibt `detect(input)` ein Ergebnis mit dem Status `no-gesture` zurück und der interne Erkennungszustand wird zurückgesetzt.

#### Output Format
```bash
{
  status: "stable",
  message: "Thumbs Up | Daumen zeigt nach oben",
  gesture: {
    id: "thumbs-up",
    name: "Thumbs Up",
    isActive: true,
    details: "Daumen zeigt nach oben",
    stable: true,
    frames: 15
  }
}
```
#### detect Output
Die Methode `detect(input)` gibt ein Ergebnisobjekt zurück. Dieses Objekt beschreibt, ob eine Geste erkannt wurde, welchen Status die Erkennung aktuell hat und welche Zusatzinformationen zur erkannten Geste vorliegen.

```js id="wk2y14"
{
  status: "stable",
  message: "Thumbs Up | Daumen zeigt nach oben",
  gesture: {
    id: "thumbs-up",
    name: "Thumbs Up",
    isActive: true,
    details: "Daumen zeigt nach oben",
    stable: true,
    frames: 15
  }
}
```

`status` beschreibt den aktuellen Zustand der Erkennung. Der Wert `checking` bedeutet, dass eine Geste erkannt wurde, aber noch nicht über genügend aufeinanderfolgende Frames stabil ist. Der Wert `stable` bedeutet, dass dieselbe Geste lange genug erkannt wurde. Der Wert `no-gesture` bedeutet, dass im aktuellen Frame keine registrierte Geste erkannt wurde.

`message` enthält eine kurze lesbare Beschreibung des aktuellen Erkennungsergebnisses. Diese Nachricht kann direkt für eine einfache Ausgabe in der Oberfläche verwendet werden.

`gesture` enthält genauere Informationen zur erkannten Geste. Dazu gehören unter anderem die technische `id`, der lesbare `name`, zusätzliche `details` und Informationen zur Stabilität der Erkennung. Wenn keine Geste erkannt wurde, ist `gesture` `null`.

`stable` gibt innerhalb des `gesture`-Objekts an, ob die erkannte Geste bereits als stabil gilt. Eine Geste ist stabil, wenn sie über die festgelegte Anzahl an Frames erkannt wurde.

`frames` gibt an, über wie viele aufeinanderfolgende Frames dieselbe Geste bereits erkannt wurde. Dieser Wert wird genutzt, um kurze Fehl- oder Zufallserkennungen zu reduzieren.


## 6. Eigene Gesten hinzufügen
Neue Gesten können ergänzt werden, ohne den `GestureRecognizer` selbst zu verändern. Dafür wird eine neue Geste als eigenes Modul im Ordner `src/lib/gestures/` angelegt und anschließend über die bestehenden Export-Dateien verfügbar gemacht.

### 1. Neue Gesture-Datei anlegen
Zuerst wird im Ordner `src/lib/gestures/` eine neue Datei für die Geste erstellt, zum Beispiel:

```txt
src/lib/gestures/customGesture.js
```

Darin wird die Geste als Objekt definiert und exportiert:

```js
export const customGesture = {
  id: "custom-gesture",
  name: "Custom Gesture",

  detect(input) {
    const hand = input.hands[0];

    if (!hand) {
      return null;
    }

    const isDetected = true; // eigene Erkennungslogik

    if (!isDetected) {
      return null;
    }

    return {
      isActive: true,
      details: "Custom Gesture wurde erkannt",
    };
  },
};
```

### 2. Geste im Gesten-Index exportieren
Damit die neue Geste von außen importiert werden kann, wird sie in `src/lib/gestures/index.js` exportiert:

```js
export { customGesture } from "./customGesture.js";
```

### 3. Geste über die Library verfügbar machen
Falls die Geste über den zentralen Einstiegspunkt der Library verfügbar sein soll, wird sie zusätzlich in `src/lib/index.js` exportiert:

```js
export { customGesture } from "./gestures/index.js";
```

Alternativ kann sie gemeinsam mit den anderen Gesten aus dem Gesten-Index weitergegeben werden.

### 4. Geste im Zielsystem registrieren
Im Zielsystem, zum Beispiel in `main.js`, wird die neue Geste importiert und beim `GestureRecognizer` registriert:

```js
import {
  GestureRecognizer,
  customGesture,
} from "./lib/index.js";

const recognizer = new GestureRecognizer({
  requiredGestureFrames: 15,
});

recognizer.registerGesture(customGesture);
```

Sobald die Geste registriert ist, wird sie bei jedem Aufruf von `detect(input)` mit geprüft.

### 5. Wichtig beim Ergänzen neuer Gesten
Der `GestureRecognizer` muss für neue Gesten nicht angepasst werden. Neue Gesten sollten lediglich die festgelegte Gestenschnittstelle einhalten und eine eindeutige `id`, einen lesbaren `name` sowie eine `detect(input)`-Funktion besitzen.

Wenn mehrere Gesten gleichzeitig erkannt werden könnten, ist die Reihenfolge der Registrierung relevant. Die registrierten Gesten werden nacheinander geprüft, und die erste passende Geste wird als Ergebnis zurückgegeben.


## 7. Vorhandene Gesten
| Beispiel  | Geste           | ID            | Beschreibung                                   |
| ----------- | ----------- | ------------- | ---------------------------------------------- |
| 👌        | **Pinch**       | `pinch`       | Daumen und Zeigefinger liegen nah beieinander. |
| ✊        | **Fist**        | `fist`        | Die Finger sind zur Faust geschlossen.         |
| 👍        | **Thumbs Up**   | `thumbs-up`   | Der Daumen zeigt nach oben.                    |
| 👎        | **Thumbs Down** | `thumbs-down` | Der Daumen zeigt nach unten.                   |


## 8. Abgrenzung zur Demo
Die API-Dokumentation bezieht sich auf die Gesture Library im Ordner `src/lib`. Die Demo-Anwendung in `src/main.js` und `src/demo` zeigt lediglich eine mögliche Nutzung der Library. Dort werden MediaPipe initialisiert, Webcam-Daten eingelesen und die erkannten Landmark-Daten visualisiert. Diese Demo-spezifischen Bestandteile sind nicht Teil der eigentlichen Library-API.
