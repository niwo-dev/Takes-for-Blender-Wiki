# Inspektor-Panel

**Speicherort:** *Eigenschaften-Editor > Registerkarte "Takes“ > Inspektor*

Das Inspektor-Panel bietet eine objektbezogene Beobachtungsliste, die anzeigt, welche Objekte vom Kaskadensystem verwaltet werden, sowie deren zugewiesene Aktionen, Slots und Unterdaten (Materialien, Knotenbäume, Shape-Keys).

## Verwaltet vs. Fixiert

Objekte in der Beobachtungsliste können einen von zwei Zuständen haben:

Verwaltet
:   Folgt dem Kaskadensystem. Die Aktion des Objekts wird automatisch durch die Kaskade der aktiven Ansichtsebene zugewiesen.

Fixiert
:   Von der Kaskadenverwaltung ausgenommen. Das Objekt behält seine eigene Aktion unabhängig von Wechseln der Ansichtsebene bei. Fixieren Sie ein Objekt, indem Sie auf das **Fixiersymbol** in seiner Zeile klicken.

!!! warning "Entpinnen“
    Beim Entpinnen eines Objekts, das eine Aktion hat, wird ein Bestätigungsdialog angezeigt,
    da die Aktion durch die Kaskadenzuweisung ersetzt wird.

## Beobachtungsliste

Die Beobachtungsliste zeigt alle Objekte an, die für die aktuelle Ansichtsebene relevant sind:

| Spalte | Beschreibung |
|--------|-------------|
| **Anheften** | Status "Verwaltet/Angeheftet“ umschalten. |
| **Name** | Objektname (zum Auswählen im Ansichtsfenster anklicken). |
| **Symbole für Unterdaten** | Kompakte Symbole für jeden animierten Datenblock (Material, Knotenbaum usw.). |

### Kompaktmodus

Im Kompaktmodus erscheinen die Symbole für Unterdaten als Reihe kleiner, typabhängiger Symbole neben jedem Objekt:

- **Helles Symbol** — Dem Datenblock ist eine Aktion zugewiesen
- **Abgedunkeltes Symbol** — Keine Aktion für diesen Datenblock

Klicken Sie auf ein beliebiges Symbol für Unterdaten, um ein Popover für die Verwaltung von Aktionen und Slots pro Datenblock zu öffnen.

## Filter

Filtern Sie die Beobachtungsliste mithilfe der Schaltflächen in der Kopfzeile:

- **Angehefteter Filter** — Zeigt nur angeheftete Objekte an
- **Nicht angehefteter Filter** — Zeigt nur verwaltete Objekte an

Filtersymbole sind deaktiviert (ausgegraut), wenn ihre Anzahl null beträgt.

## Aktionen & Slots

Wählen Sie ein Objekt in der Beobachtungsliste aus, um dessen Aktions- und Slot-Details im unteren Bereich des Inspektors anzuzeigen:

- **Aktionsliste** — Zeigt alle Aktionen an, die auf dieses Objekt verweisen
- **Slots-Liste** — Zeigt alle Slots innerhalb der aktiven Aktion an
- **Inline-Umbenennung** — Doppelklicken Sie auf einen Aktions- oder Slot-Namen, um ihn umzubenennen
