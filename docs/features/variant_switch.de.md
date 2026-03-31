# Variant Switch

Das **Variant Switch**-System verwaltet Produktvarianten – unterschiedliche Materialkonfigurationen, Oberflächen oder Farboptionen – mit materialabhängigem Austausch und kaskadierender Zustandsverwaltung.

## Konzept

Bei der Produktvisualisierung muss dasselbe Produkt häufig in verschiedenen Oberflächen (Gold, Silber, Mattschwarz) oder Konfigurationen dargestellt werden. Variant Switch automatisiert den Materialaustauschprozess.

## Hierarchie

| Element | Beschreibung |
|---------|-------------|
| **Produkt** | Der Container der obersten Ebene (z. B. „Uhr“, „Flasche“). |
| **Zustand** | Eine benannte Variante (z. B. „Gold“, „Silber“). Zum Anzeigen der Vorschau anklicken. |
| **Teil** | Eine Komponente, die mit einer Sammlung verknüpft ist (z. B. „Gehäuse“, „Armband“). |
| **Pool** | Für jedes Teil verfügbare Materialplätze. |

## Verwendung

### Ein Produkt erstellen

1. Öffnen Sie das Fenster **Variant Switch**.
2. Klicken Sie auf **+** oder drücken Sie ++Strg+n++, um ein Produkt hinzuzufügen.
3. Es wird automatisch ein Standardteil („Basis“) mit einem leeren Pool-Slot erstellt.

### Zustände hinzufügen

1. Wählen Sie das Produkt aus.
2. Fügen Sie einen neuen Zustand hinzu (z. B. „Gold“).
3. Jeder Zustand speichert einen Pool-Index pro Teil, der festlegt, welches Material verwendet werden soll.

### Materialien zuweisen

1. Erweitern Sie ein Teil, um dessen Material-Pool anzuzeigen.
2. Weisen Sie dem ersten leeren Slot ein Material zu – ein neuer Slot wird automatisch erstellt.
3. Verwenden Sie Blenders nativen Material-Selektor (Neu, Duplizieren, Verknüpfung aufheben).

### Vorschau von Varianten

Klicken Sie auf das **Rauten-Symbol** eines beliebigen inaktiven Zustands, um diese Variante sofort auf das Ansichtsfenster anzuwenden. Der aktive Zustand wird als ausgefüllter Kreis angezeigt.

## Variantenmodi

Variant Switch unterstützt drei Modi:

=== „Swap“
    Direkter Materialaustausch. Der einfachste Modus – Material A wird zu Material B.

=== „Preset“
    Wendet eine Materialvoreinstellung über JSON direkt an. Das Material bleibt dasselbe, aber seine Eigenschaften ändern sich.

=== „Pool“
    Wähle aus einer Materialpalette auf Produktebene aus. Jedes Teil verfügt über einen Materialpool, der nach Zuständen indiziert ist.

## Integration mit Cascade

Variant Switch-Zustände werden als Teil der Kaskade aufgelöst. Jede Ansichtsebene (oder eine höhere Ebene) kann festlegen, welcher Variantenzustand aktiv ist, wodurch unterschiedliche Varianten pro Kamerawinkel ermöglicht werden.

!!! Tipp „Variant Tags“
    Weisen Sie Zuständen Tags aus der Kategorie „Variant“ zu, um die Organisation
    und die Auflösung der Smart-Ausgabe über das Token `{variant_tag}` zu ermöglichen.
