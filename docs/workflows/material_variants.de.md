---
icon: material/palette
---

# Workflow: Materialvarianten

Dieser Workflow zeigt, wie Sie Produktvarianten für Farbe und Oberfläche mithilfe des Variant Switch-Systems einrichten.

## Szenario

Sie haben ein Produkt (z. B. eine Wasserflasche), das in drei Ausführungen dargestellt werden soll: Mattschwarz, gebürstetes Aluminium und Roségold.

## Einrichtung

### 1. Produkt erstellen

1. Öffnen Sie das **Variant Switch**-Fenster.
2. Klicken Sie auf **+**, um ein neues Produkt mit dem Namen "Flasche" zu erstellen.
3. Ein Standardteil ("Basis") wird automatisch erstellt.

### 2. Teile definieren

Teilen Sie das Produkt in Komponenten auf:

1. Fügen Sie ein Teil namens "Körper" hinzu → weisen Sie die Körper-Kollektion zu.
2. Fügen Sie ein Teil namens "Cap" hinzu → weisen Sie die Cap-Kollektion zu.
3. Fügen Sie ein Teil namens "Label" hinzu → weisen Sie die Label-Kollektion zu.

### 3. Materialien zu Pools hinzufügen

Füllen Sie für jedes Teil den Materialpool:

1. Erweitern Sie "Body", um dessen Pool anzuzeigen.
2. Weisen Sie `Mat_Matte_Black` dem Slot 1 zu.
3. Weisen Sie `Mat_Aluminum` dem Slot 2 zu (wird automatisch erstellt).
4. Weisen Sie `Mat_Rose_Gold` dem Slot 3 zu (wird automatisch erstellt).
5. Wiederholen Sie dies für "Cap" und "Label" mit den jeweiligen Materialien.

### 4. Zustände erstellen

Fügen Sie für jede Variante einen Zustand hinzu:

1. Fügen Sie den Zustand "Matte Black" hinzu → setzen Sie den Pool-Index für alle Teile auf 1.
2. Fügen Sie den Zustand "Aluminum" hinzu → setzen Sie den Pool-Index für alle Teile auf 2.
3. Fügen Sie den Zustand "Rose Gold" hinzu → setzen Sie den Pool-Index für alle Teile auf 3.

## Vorschau

Klicken Sie auf das **Diamantsymbol** eines beliebigen Zustands, um diese Variante sofort im Ansichtsfenster anzuzeigen.

## Alle Varianten rendern

### Option A: Manuell

1. Aktivieren Sie jeden Zustand.
2. Rendern Sie mit ++f12++.

### Option B: Kaskadenintegration

1. Erstellen Sie pro Variante eine Ansichtsebene.
2. Weisen Sie in der Kaskade jeder Ansichtsebene den passenden Variantenschalter-Zustand zu.
3. Rendern Sie alle Ansichtsebenen auf einmal im Stapelverfahren.

### Option C: Kombiniert mit Kamerawinkeln

Erstellen Sie für jede Kombination (Variante × Winkel) eine Ansichtsebene (VL):

| Ansichtsebene | Variante | Kamera |
|------------|---------|--------|
| Black_Front | Mattschwarz | Cam_Front |
| Black_Side | Mattschwarz | Cam_Side |
| Alu_Front | Aluminium | Cam_Front |
| Alu_Side | Aluminium | Cam_Side |

Das Batch-Rendering verarbeitet alle Kombinationen mit Smart-Output-Tokens:

```
[variant]_[camera]_####.[file_format]
```
