---
icon: material/image-multiple
---

# Batch-Rendering

Das **Batch-Rendering**-System automatisiert das Rendern über mehrere Ansichtsebenen hinweg und wendet dabei für jede Ebene kaskadierende Überschreibungen (Kameras, Welten, Aktionen, Voreinstellungen, Varianten) an.

## Rendermodi

Takes for Blender unterstützt zwei Render-Modi:

=== "Vordergrund"
    Rendert innerhalb der aktuellen Blender-Sitzung. Du siehst das Render-Fenster und den Fortschritt in Echtzeit, aber Blender ist während des Renderns gesperrt.

 - Klicke auf die Schaltfläche **Render** (:material-image:) in der Seitenleiste.
    - Der Fortschritt wird pro VL mit Statusanzeigen angezeigt.
    - Drücken Sie ++esc++, um abzubrechen.

=== "Hintergrund"
    Rendert in separaten, headless Blender-Unterprozessen. Blender bleibt vollständig interaktiv, während die Rendervorgänge im Hintergrund laufen.

 - Klicken Sie auf die Schaltfläche **Desktop** (:material-desktop-classic:) in der Seitenleiste.
    - Die Baumansicht wird fortlaufend aktualisiert, sobald ein VL fertiggestellt ist.
    - Ein Abschlusssignal ertönt, wenn alle Aufgaben beendet sind.

## Render-Warteschlange

Die Render-Warteschlange zeigt den Status jeder Ansichtsebene an:

| Status | Beschreibung |
|--------|-------------|
| **Ausstehend** | Wartet auf das Rendern. |
| **Wird gerendert** | Wird derzeit verarbeitet. |
| **Speichern** | Ausgabedatei wird auf die Festplatte geschrieben. |
| **Fertig** | Erfolgreich abgeschlossen. |
| **Fehlgeschlagen** | Es ist ein Fehler aufgetreten (für Details mit der Maus darüberfahren). |
| **Abgebrochen** | Aufgrund einer Stapelabbruchaktion übersprungen. |

## Auswahlmodi

- **Einzelne VL** — Rendert nur die aktive Ansichtsebene (Standard).
- **Mehrfachauswahl** — Wenn die Mehrfachauswahl aktiviert ist, werden alle ausgewählten Ansichtsebenen gerendert.

!!! tip "Render Order"
    Der Batch-Renderer folgt der Reihenfolge der Baumansicht (von oben nach unten, wie angezeigt),
    nicht der internen Szenen-/VL-Reihenfolge von Blender.

## Wiederherstellung

Wenn ein Batch-Rendering hängen bleibt:

1. **Alt+Klick** auf die Schaltfläche "Render", um einen erzwungenen Reset durchzuführen.
2. Dadurch werden alle internen Flags gelöscht und unterdrückte Handler wiederhergestellt.

## Ausgabe

Ausgabepfade werden über das [Smart Output](smart_output.md)-Token-System aufgelöst. Die Ausgabe jeder Ansichtsebene wird automatisch basierend auf dem konfigurierten Muster benannt.
