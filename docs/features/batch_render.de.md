# Stapelrendering

Das **Stapelrendering**-System automatisiert das Rendern über mehrere Ansichtsebenen hinweg und wendet dabei für jede Ebene kaskadierende Überschreibungen (Kameras, Welten, Aktionen, Voreinstellungen, Varianten) an.

## Rendermodi

Takes for Blender unterstützt zwei Rendermodi:

=== „Vordergrund“
    Rendert innerhalb der aktuellen Blender-Sitzung. Sie sehen das Renderfenster und den Fortschritt in Echtzeit, aber Blender ist während des Renderns gesperrt.

 - Klicken Sie auf die Schaltfläche **Render** (:material-image:) in der Seitenleiste.
    - Der Fortschritt wird pro VL mit Statusanzeigen angezeigt.
    - Drücken Sie ++esc++, um abzubrechen.

=== „Hintergrund“
    Rendert in separaten, headless Blender-Unterprozessen. Blender bleibt vollständig interaktiv, während die Rendervorgänge im Hintergrund laufen.

 - Klicken Sie in der Seitenleiste auf die Schaltfläche **Desktop** (:material-desktop-classic:).
    - Die Baumansicht wird fortlaufend aktualisiert, sobald ein VL abgeschlossen ist.
    - Ein Abschlusssignal ertönt, wenn alle Aufgaben beendet sind.

## Render-Warteschlange

Die Render-Warteschlange zeigt den Status jeder Ansichtsebene an:

| Status | Beschreibung |
|--------|-------------|
| **Ausstehend** | Wartet auf das Rendern. |
| **Rendern** | Wird derzeit verarbeitet. |
| **Speichern** | Ausgabedatei wird auf die Festplatte geschrieben. |
| **Fertig** | Erfolgreich abgeschlossen. |
| **Fehlgeschlagen** | Es ist ein Fehler aufgetreten (mit der Maus darüberfahren für Details). |
| **Abgebrochen** | Aufgrund einer Stapelabbruchaktion übersprungen. |

## Auswahlmodi

- **Einzelne VL** — Rendert nur die aktive Ansichtsebene (Standard).
- **Mehrfachauswahl** — Wenn die Mehrfachauswahl aktiviert ist, werden alle ausgewählten Ansichtsebenen gerendert.

!!! Tipp „Renderreihenfolge“
    Der Batch-Renderer folgt der Reihenfolge in der Baumansicht (von oben nach unten, wie angezeigt),
    nicht der internen Szenen-/VL-Reihenfolge von Blender.

## Wiederherstellung

Wenn ein Batch-Rendering hängen bleibt:

1. **Alt+Klick** auf die Schaltfläche „Render“, um einen erzwungenen Reset durchzuführen.
2. Dadurch werden alle internen Flags gelöscht und unterdrückte Handler wiederhergestellt.

## Ausgabe

Ausgabepfade werden über das Token-System [Smart Output](smart_output.md) aufgelöst. Die Ausgabe jeder Ansichtsebene wird automatisch basierend auf dem konfigurierten Muster benannt.
