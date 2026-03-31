# Variant Switch

Das **Variant Switch**-System verwaltet Produktvarianten – unterschiedliche Materialkonfigurationen, Oberflächen oder Farboptionen – mit materialabhängigem Austausch und kaskadierender Zustandsverwaltung.

## Konzept

Bei der Produktvisualisierung muss oft dasselbe Produkt in verschiedenen Oberflächen (Gold, Silber, Mattschwarz) oder Konfigurationen dargestellt werden. Variant Switch automatisiert den Materialaustausch.

## Hierarchie

| Element | Beschreibung |
|---------|-------------|
| **Produkt** | Der Container der obersten Ebene (z. B. "Uhr“, "Flasche“). |
| **Status** | Eine benannte Variante (z. B. "Gold“, "Silber“). Zum Anzeigen der Vorschau anklicken. |
| **Teil** | Eine Komponente, die mit einer Sammlung verknüpft ist (z. B. "Gehäuse“, "Armband“). |
| **Pool** | Für jedes Teil verfügbare Material-Slots. |

## Verwendung

### Ein Produkt erstellen

1. Öffnen Sie das Fenster **Variant Switch**.
2. Klicken Sie auf **+** oder drücken Sie ++Strg+n++, um ein Produkt hinzuzufügen.
3. Es wird automatisch ein Standardteil ("Basis“) mit einem leeren Pool-Slot erstellt.

### Zustände hinzufügen

1. Wählen Sie das Produkt aus.
2. Fügen Sie einen neuen Zustand hinzu (z. B. "Gold“).
3. Jeder Zustand speichert einen Pool-Index pro Teil, der festlegt, welches Material verwendet werden soll.

### Materialien zuweisen

1. Erweitere ein Teil, um dessen Materialpool anzuzeigen.
2. Weise dem ersten leeren Platz ein Material zu – ein neuer Platz wird automatisch erstellt.
3. Verwende Blenders native Materialauswahl (Neu, Duplizieren, Verknüpfung aufheben).

### Vorschau von Varianten

Klicken Sie auf das **Rauten-Symbol** eines beliebigen inaktiven Zustands, um diese Variante sofort im Ansichtsfenster anzuwenden. Der aktive Zustand wird als ausgefüllter Kreis angezeigt.

## Variantenmodi

Variant Switch unterstützt drei Modi:

=== "Swap“
    Direkter Materialaustausch. Der einfachste Modus – Material A wird zu Material B.

=== "Preset“
    Wendet eine Materialvoreinstellung über JSON direkt an. Das Material bleibt dasselbe, aber seine Eigenschaften ändern sich.

=== "Pool“
    Wähle aus einer Materialpalette auf Produktebene aus. Jedes Teil verfügt über einen Pool von Materialien, die nach Zustand indiziert sind.

## Integration mit Cascade

Variant Switch-Zustände werden als Teil der Cascade aufgelöst. Jede Ansichtsebene (oder eine übergeordnete Ebene) kann festlegen, welcher Variantenzustand aktiv ist, wodurch unterschiedliche Varianten pro Kamerawinkel ermöglicht werden.

!!! tip "Variant Tags“
    Weisen Sie Zuständen Tags aus der Kategorie "Variant“ zu, um die Organisation
    und die Auflösung der Smart-Ausgabe über das `{variant_tag}`-Token zu ermöglichen.
