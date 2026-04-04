---
icon: material/movie-open
---

# Takes

Ein **Take** ist eine benannte Gruppe von Ansichtsebenen, die eine bestimmte Konfiguration Ihrer Szene darstellen – einen Kamerawinkel, eine Beleuchtungskonfiguration, eine Materialvariante oder einen Animationszustand.

## Konzept

In Film und Fotografie ist ein "Take" eine Version einer Aufnahme. "Takes" für Blender erweitert dieses Konzept auf das Ansichtsebenensystem von Blender und bietet Ihnen:

- **Unabhängige Kamerazuweisungen** pro Ansichtsebene
- **Unabhängige Umgebungen** pro Ansichtsebene
- **Unabhängige Compositor-Knotenbäume** pro Ansichtsebene
- **Unabhängige Render-Voreinstellungen** pro Ansichtsebene
- **Unabhängige Animationsaktionen** pro Ansichtsebene

## Organisation

Takes sind in einer Hierarchie innerhalb des Takes-Baums organisiert:

| Ebene | Zweck | Beispiel |
|-------|---------|---------|
| **Szenengruppe** | Organisation auf oberster Ebene | "Innenraum", "Außenbereich" |
| **Szene** | Blender-Szene | "Küche", "Badezimmer" |
| **VL-Gruppe** | Logische Gruppierung von VLs | "Hero Shots", "Detail Shots" |
| **Ansichtsebene** | Die eigentliche Render-Einheit | "Front 3/4", "Top Down" |
| **VL-Version** | Benannte Snapshots von VL-Einstellungen | "v1 warm", "v2 cool" |

## Takes erstellen

### Eine Ansichtsebene hinzufügen

1. Klicken Sie in der Baum-Seitenleiste auf **+**.
2. Wählen Sie **Ansichtslayer hinzufügen**.
3. Der neue VL erbt die Einstellungen des aktiven Ansichtslayers.

### Ansichtslayer gruppieren

1. Wählen Sie einen Ansichtslayer in der Baumstruktur aus.
2. Drücken Sie ++ctrl+g++, um eine VL-Gruppe zu erstellen, die diesen enthält.
3. Ziehen Sie weitere Ansichtslayer in die Gruppe.

### VL-Versionen

Erstellen Sie benannte Snapshots der Kaskadeneinstellungen einer Ansichtsebene:

1. Wählen Sie eine Ansichtsebene aus.
2. Klicken Sie auf **+** → **Version hinzufügen**.
3. Jede Version speichert ihre eigenen Kamera-, Welt-, Aktions- und Voreinstellungsüberschreibungen.

!!! tip "Quick Switching"
    Wechseln Sie zwischen Ansichtsebenen-Versionen, um verschiedene Konfigurationen sofort zu vergleichen,
    ohne Ansichtsebenen duplizieren zu müssen.
