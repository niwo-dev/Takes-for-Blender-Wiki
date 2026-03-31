---
icon: material/play-box-multiple
---

# Arbeitsablauf: Stapelrendering

Dieser Arbeitsablauf behandelt die Einrichtung und Durchführung eines vollständigen Stapelrenderings über mehrere Ansichtsebenen hinweg mit kaskadierenden Überschreibungen und Smart Output.

## Voraussetzungen

- Szene mit mehreren konfigurierten Ansichtsebenen
- Zugewiesene kaskadierende Überschreibungen (Kameras, Welten, Voreinstellungen)
- Definierte Smart-Output-Muster

## Smart Output einrichten

### 1. Ausgabemuster definieren

1. Gehen Sie zu **Eigenschaften > Ausgabe**.
2. Aktivieren Sie **Smart Output**.
3. Legen Sie das Verzeichnismuster fest:

    ```
    //renders/[scene]/[view_layer]/
    ```

4. Legen Sie das Dateinamenmuster fest:

    ```
    [view_layer]_[camera]_####.[file_format]
    ```

### 2. Render-Voreinstellungen zuweisen

Für einheitliche Qualität in allen VLs:

1. Konfigurieren Sie Ihre Render-Einstellungen (Engine, Samples, Auflösung).
2. Speichern Sie diese als Render-Voreinstellung über das Kaskaden-Popover.
3. Weisen Sie sie auf **globaler** Ebene für alle VLs oder pro VL-Gruppe für verschiedene Qualitätsstufen zu.

## Batch ausführen

### Vordergrundmodus

1. Öffnen Sie die Seitenleiste "Takes Tree".
2. Klicken Sie auf die Schaltfläche **Render**.
3. Die Warteschlange verarbeitet jede VL in der Reihenfolge der Baumstruktur:
    - Wechselt den Szenen-/VL-Kontext
    - Wendet Kaskaden-Überschreibungen an (Kamera, Welt, Aktion, Varianten)
    - Wendet die Render-Voreinstellung an
    - Rendert und speichert im Smart-Output-Pfad
4. Der Fortschritt wird pro VL in der Render-Warteschlangenliste angezeigt.

### Hintergrundmodus

1. Klicken Sie stattdessen auf die Schaltfläche **Desktop**.
2. Blender bleibt interaktiv, während die Renderings im Hintergrund ablaufen.
3. Die Miniaturansichten in der Baumansicht werden aktualisiert, sobald ein VL fertiggestellt ist.

## Fortschritt überwachen

Die Seitenleiste der Render-Warteschlange zeigt:

- Fortschrittsbalken pro VL
- Statusanzeige (Ausstehend, Wird gerendert, Wird gespeichert, Fertig, Fehlgeschlagen, Abgebrochen)
- Bei fehlgeschlagenen Elementen wird ein Tooltip mit dem Fehlergrund angezeigt

## Ausgabestruktur

Mit den oben genannten Mustern sieht Ihr Ausgabeordner wie folgt aus:

```
renders/
├── Kitchen/
│   ├── Front_3-4/
│   │   ├── Front_3-4_CamHero_0001.png
│   │   └── Front_3-4_CamHero_0250.png
│   └── Top_Down/
│       ├── Top_Down_CamTop_0001.png
│       └── Top_Down_CamTop_0250.png
└── Bathroom/
    └── ...
```

## Tipps

!!! tip "Fertigstellungssignal"
    Legen Sie unter **Einstellungen > Funktionen** einen Benachrichtigungston fest, um benachrichtigt zu werden,
    wenn Hintergrund-Renderings abgeschlossen sind. Unterstützt Systemtöne und benutzerdefinierte `.wav`-Dateien.

!!! tip "Vorschau vor dem Rendern"
    Verwenden Sie ++Alt++-Klick auf das Render-Symbol neben einem beliebigen VL, um eine Vorschau
    der zuletzt gerenderten Ausgabe anzuzeigen, ohne erneut zu rendern.

!!! warning "Zuerst speichern"
    Hintergrund-Renderings erfordern, dass die `.blend`-Datei gespeichert wird.
    Vordergrund-Renderings arbeiten mit dem aktuellen Speicherstand.
