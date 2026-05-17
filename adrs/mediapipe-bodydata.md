# MediaPipe als ML-Library für die Erkennung von Körperdaten
* Status: accepted
* Workload: 2h
* Decider: [Mia Henrichsmeyer](https://github.com/miahenri)
* Issue: [1](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2026-miahenri/issues/1#issue-4464005758)
* Date: 2026-17-05

## Context and Problem Statement
Wählen Sie eine ML-Library Ihrer Wahl (z.B. MediaPipe, TensorFlow.js, hand-pose-detection) und machen Sie Körperdaten live im Browser sichtbar. Keine Abstraktion, keine eigene Library – nur Rohdaten auf dem Screen.


## Considered Options
* MediaPipe
* TensorFlow.js
* OpenCV.js

## Decision Outcome
Im Kern wurde sich abschließend für MediaPipe entschieden, weil hier sowohl Einstieg und Setup am simpelsten waren als auch (gerade für Hände) passende Rohdaten angezeigt werden. Pro Hand werden 21 Punkte erkannt und als Rohdaten live angezeigt. OpenCV bietet keine fertigen Körper/Hand-Landmarks an wie MediaPipe es tut. TensorFlow.js bietet eine gute Alternative zu MediaPipe. Anhand des Setups und Einstiegs wurde sich hier allerdings für MediaPipe entschieden.

### Positive Consequences <!-- optional -->
* Zusätzlich zu den JSON Rohdaten gut sichtbare Punkte auf dem Kamerabild

## Pros and Cons of the Options <!-- optional -->

### OpenCV
* ist gut geeignet für klassische Bildverarbeitung
* kann Bewegungen, Konturen, Farben oder Bildbereiche analysieren
* für Finger-, Hand- oder Pose-Erkennung müsste sehr viel selbst gebaut werden
* für den Issue wären die Rohdaten weniger aussagekräftig als MediaPipe-Landmarks


### TensorFlow.js
* bietet mehrere fertige Modelle für Pose- oder Handerkennung
* Rohdaten wie Keypoints oder Posen können ebenfalls auf dem Screen angezeigt werden
* Setup ist meistens komplexer als bei MediaPipe
* oft müssen mehrere Pakete installiert und Backends wie WebGL eingebunden werden


### MediaPipe
* ist für Echtzeit-Erkennung über Kamera/Webcam geeignet
* liefert direkt verwertbare Rohdaten wie Hand-Landmarks, Koordinaten und Handedness
* eignet sich gut für spätere bewegungs- oder gestenbasierte Interaktion
* relativ einfacher Einstieg mit Vite und @mediapipe/tasks-vision
* erfüllt die Akzeptanzkriterien gut, weil Rohdaten direkt als JSON und als Punkte im Bild angezeigt werden können


## Links <!-- optional -->
* [MediaPipe](https://mediapipe.org)
* [TensorFlow.js](https://www.tensorflow.org/js)
* [OpenCV](https://opencv.org)