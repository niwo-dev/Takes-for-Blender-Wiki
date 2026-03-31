# Kontexteigenschaften

**Speicherort:** *Eigenschaften-Editor > Registerkarte "Aufnahmen“ > Kontext*

Der Bereich "Kontexteigenschaften“ zeigt die Einstellungen für die Kaskadenüberschreibung der aktuell aktiven Ansichtsebene an. Jede Eigenschaftskategorie verfügt über ein eigenes Popover, das über die Kaskadensymbole in der Baumstruktur aufgerufen werden kann.

## Kaskaden-Popovers

Klicken Sie auf ein beliebiges Kaskadensymbol in einer Baumzeile, um das zugehörige Popover zu öffnen. In jedem Popover können Sie eine Überschreibung auf dieser spezifischen Hierarchieebene festlegen oder aufheben.

### Kamera-Popover

Weisen Sie eine Kamera pro Ansichtsebene zu:

- **Kameraauswahl** — Dropdown-Menü, das nur Kameraobjekte anzeigt, die mit der aktuellen Szene verknüpft sind.
- **Kamera-Voreinstellung** — Wenden Sie eine gespeicherte Kamera-Voreinstellung an (Brennweite, Sensorgröße usw.).
- **Neu / Umbenennen** — Erstellen Sie eine neue Kamera oder benennen Sie die zugewiesene um.

!!! note "Camera Guard“
    Die Benutzeroberfläche für Kameravoreinstellungen ist deaktiviert, wenn das ausgewählte Objekt nicht die
    kaskadenaufgelöste Kamera ist. Eine Informationsmeldung zeigt "Weisen Sie eine Kamera in der Kaskade zu.“ an.

### Welt-Popover

Weisen Sie eine Weltumgebung pro Ansichtsebene zu:

- **Welt-Auswahl** — Wählen Sie aus den verfügbaren Welt-Datenblöcken aus.
- **Welt-Voreinstellung** — Wenden Sie eine gespeicherte Welt-Voreinstellung an.
- **Welt-Regel** — Verwenden Sie eine tag-basierte Regel für die automatische Welt-Auswahl.

### Aktions-Popover

Zeigen Sie die Zuweisung der Kaskadenaktion an und verwalten Sie sie:

- **Aktuelle Aktion** — Die aufgelöste Kaskadenaktion für diese Ansichtsebene.
- **Kaskade erneut anwenden** — Stellen Sie die Kaskadenaktion nach manuellem Löschen wieder her.

### Compositor-Popover

Weisen Sie einen Compositor-Knotenbaum pro Ansichtsebene zu.

### Ausgabe-Popover

Konfigurieren Sie die Render-Ausgabeeinstellungen:

- **Ausgaberegel** — Tag-basierte Regel für den Ausgabepfad.
- **Render-Voreinstellung** — Render-Einstellungen pro Ansichtsebene.

## Überschreibungsauflösung

Überschreibungen werden top-down durch die Kaskadenhierarchie aufgelöst. Der erste nicht leere Wert hat Vorrang:

```
Global → Scene Group → Scene → VL Group → View Layer → VL Version
```

Ein Symbol erscheint **hell**, wenn auf dieser Ebene ein Wert festgelegt ist, und **abgedunkelt**, wenn es von einer übergeordneten Ebene geerbt wurde.
