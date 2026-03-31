# Arbeitsablauf: Animationsvarianten

Dieser Arbeitsablauf zeigt, wie man verschiedene Animationsaufnahmen pro Ansichtsebene einrichtet – zum Beispiel ein Produkt, das sich dreht, neigt und explodiert, jeweils auf einer eigenen Ansichtsebene mit unabhängigen Kameras.

## Einrichtung

### 1. Ansichtsebenen erstellen

Erstellen Sie eine Ansichtsebene pro Animationszustand:

1. Öffnen Sie die Aufnahmen-Struktur.
2. Klicken Sie für jede Animation auf **+** → **Ansichtslayer hinzufügen**.
3. Benennen Sie sie aussagekräftig: „Drehen“, „Neigen“, „Explodieren“.

### 2. Gruppieren

1. Wählen Sie den ersten Ansichtslayer aus.
2. Drücken Sie **+**Ctrl+G**, um eine Gruppe namens „Animationen“ zu erstellen.
3. Verschieben Sie die anderen Ansichtslayer in diese Gruppe.

### 3. Kameras zuweisen

Jede Animation benötigt wahrscheinlich einen eigenen Kamerawinkel:

1. Klicken Sie auf das Kamerasymbol in jeder VL-Zeile.
2. Weisen Sie die entsprechende Kamera zu.

## Animieren

### 4. Pro Ansichtsebene animieren

1. Wechseln Sie zur Ansichtsebene „Spin“, indem Sie im Baum darauf klicken.
2. Die Kaskade weist dieser VL automatisch eine eigene Aktion zu.
3. Animieren Sie Ihre Objekte. Keyframes werden in der VL-spezifischen Aktion gespeichert.
4. Wechseln Sie zu „Tilt“ – die Objekte springen zurück in ihren Ruhezustand.
5. Erstellen Sie eine andere Animation auf dieser VL.

!!! Tipp „Ruhezustand“
    Das Ruhezustandssystem sorgt dafür, dass Objekte in ihre Standardpose zurückkehren,
    wenn Sie von einer animierten VL wegwechseln. Dies geschieht automatisch.

### 5. Alle Animationen rendern

1. Aktivieren Sie die Mehrfachauswahl in der Seitenleiste.
2. Wählen Sie alle Animations-View-Layers aus.
3. Klicken Sie auf die Schaltfläche „Render“.
4. Smart Output benennt jede Ausgabedatei automatisch nach dem VL-Namen.

## Ergebnis

Jedes View Layer verfügt über:

- einen eigenen Kamerawinkel
- eine eigene Animationsaktion
- einen eigenen Ausgabedateinamen
- alles verwaltet über eine einheitliche Baumstruktur
