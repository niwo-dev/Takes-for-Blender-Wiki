# Takes

Ein **Take** ist eine benannte Gruppe von Ansichtsebenen, die eine bestimmte Konfiguration Ihrer Szene darstellen – einen Kamerawinkel, eine Beleuchtungskonfiguration, eine Materialvariante oder einen Animationszustand.

## Konzept

In Film und Fotografie ist ein „Take“ eine einzelne Version einer Aufnahme. „Takes“ für Blender erweitert dieses Konzept auf das Ansichtsebenensystem von Blender und bietet Ihnen:

- **Unabhängige Kamerazuweisungen** pro Ansichtsebene
- **Unabhängige Umgebungen** pro Ansichtsebene
- **Unabhängige Compositor-Knotenbäume** pro Ansichtsebene
- **Unabhängige Render-Voreinstellungen** pro Ansichtsebene
- **Unabhängige Animationsaktionen** pro Ansichtsebene

## Organisation

Takes sind in einer Hierarchie innerhalb des Takes-Baums organisiert:

| Ebene | Zweck | Beispiel |
|-------|---------|---------|
| **Szenengruppe** | Organisation auf oberster Ebene | „Innenraum“, „Außenbereich“ |
| **Szene** | Blender-Szene | „Küche“, „Badezimmer“ |
| **VL-Gruppe** | Logische Gruppierung von VLs | „Hero Shots“, „Detail Shots“ |
| **Ansichtslayer** | Die eigentliche Render-Einheit | „Front 3/4“, „Top Down“ |
| **VL-Version** | Benannte Snapshots von VL-Einstellungen | „v1 warm“, „v2 cool“ |

## Takes erstellen

### Eine Ansichtsebene hinzufügen

1. Klicken Sie in der Seitenleiste auf **+**.
2. Wählen Sie **Ansichtsebene hinzufügen**.
3. Die neue VL erbt die Einstellungen der aktiven Ansichtsebene.

### Ansichtsebenen gruppieren

1. Wählen Sie eine Ansichtsebene in der Struktur aus.
2. Drücken Sie ++Strg+g++, um eine VL-Gruppe zu erstellen, die diese enthält.
3. Ziehen Sie weitere Ansichtsebenen in die Gruppe.

### VL-Versionen

Erstellen Sie benannte Snapshots der Kaskadeneinstellungen einer Ansichtsebene:

1. Wählen Sie eine Ansichtsebene aus.
2. Klicken Sie auf **+** → **Version hinzufügen**.
3. Jede Version speichert ihre eigenen Kamera-, Welt-, Aktions- und Voreinstellungsüberschreibungen.

!!! tip „Schnellwechsel“
    Wechseln Sie zwischen VL-Versionen, um verschiedene Konfigurationen sofort zu vergleichen,
    ohne View Layers duplizieren zu müssen.
