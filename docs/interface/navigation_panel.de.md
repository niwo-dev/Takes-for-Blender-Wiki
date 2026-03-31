# Navigationsbereich

**Position:** *Eigenschaften-Editor > Registerkarte "Takes“*

Der Navigationsbereich ist die zentrale Schaltstelle für die Verwaltung Ihrer Takes-Hierarchie. Er enthält den Takes-Baum, Symbole für die Kaskadenüberschreibung und den Zugriff auf das Batch-Rendering.

## Steuerelemente in der Kopfzeile

In der Kopfzeile des Bereichs werden die Addon-Version angezeigt und Schnellzugriffstasten bereitgestellt:

| Steuerelement | Beschreibung |
|---------|-------------|
| **Sperren** | Sperrt das Fenster, um versehentliche Statusänderungen zu verhindern. |
| **Autokey** | Schaltet Blenders automatische Keying-Funktion für alle Szenen gleichzeitig ein oder aus. |
| **Timeline-Synchronisierung** | Synchronisiert die Position des Abspielkopfes über alle Szenen hinweg. |
| **Warnungen** | Zeigt aktive Warnungen an (fehlende Voreinstellungen, hängende Aktionen). |
| **Globale Einstellungen** | Öffnet die globalen Kaskadeneinstellungen. |
| **Hilfe** | Öffnet die Dokumentation (dieses Wiki). |
| **Einstellungen** | Optionen zur Sichtbarkeit und Gestaltung des Baums. |

## Der Takes-Baum

Der Takes-Baum ist eine einheitliche hierarchische Liste, die Ihre gesamte Projektstruktur anzeigt:

```
📁 Scene Group
  🎬 Scene
    📂 VL Group
      🔲 View Layer
        📌 VL Version
```

### Zeilenelemente

Jede Zeile der Ansichtsebene zeigt Symbole für Kaskadenüberschreibungen an. Diese Symbole zeigen auf einen Blick, welche Eigenschaften auf dieser Ebene überschrieben werden:

- **Ghost** — Status "Ruhezustand“
- **Tag** — Zugewiesenes Farb-Tag
- **Variante** — Status des aktiven Varianten-Schalters
- **Aktion** — Zuweisung einer Kaskadenaktion
- **Compositor** — Überschreibung des Knotenbaums
- **Welt** — Überschreibung der Welt/Umgebung
- **Kamera** — Kamerazuweisung
- **Ausgabe** — Ausgabe-Tag/Regel
- **Render** — Render-Voreinstellung

!!! tip "Kaskaden-Symbol-Überlauf“
    Wenn das Fenster schmal ist, werden die Kaskadensymbole automatisch zu einer Überlauf-Schaltfläche
    **⋯** zusammengefasst. Ein Klick darauf öffnet ein Popover, das alle Symbole vollständig anzeigt.

### Baumlinien

Konfigurierbare Einrückungslinien stellen die Hierarchie visuell dar. Tag-Farben können von Baumlinien übernommen werden, um eine schnelle Identifizierung zu ermöglichen.

## Popover "Einstellungen“

Klicken Sie auf das **Zahnrad-Symbol**, um die Einstellungen für die Baumdarstellung aufzurufen:

| Einstellung | Beschreibung |
|---------|-------------|
| **Tag-Farbe anzeigen** | Einrückungslinien im Baum nach Tag-Zuweisung einfärben. |
| **Linienbreite** | Dünne / Mittlere / Breite Einrückungslinien. |
| **Symbol-Sichtbarkeit** | Einzelne Kaskadensymbole ein- oder ausschalten. |
| **Vorschau-Größe** | Miniaturbildgröße für Inline-VL-Vorschauen (24/32/40 px). |

## Warnungen

Das Navigationsfenster zeigt Warnungen an, wenn Probleme erkannt werden:

- **Voreinstellung fehlt** — Eine Kaskaden-Voreinstellung verweist auf eine gelöschte JSON-Datei.
- **Hängende Aktion** — Eine Aktion geht verloren, da die automatische Zuweisung deaktiviert ist.
