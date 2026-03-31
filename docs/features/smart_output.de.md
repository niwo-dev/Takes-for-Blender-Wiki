# Smart Output

Das **Smart Output**-System bietet eine dynamische, tokenbasierte Auflösung von Dateipfaden für die Renderausgabe. Anstatt jeden Render manuell zu benennen, werden Token automatisch durch kontextspezifische Werte ersetzt.

## Smart Output aktivieren

1. Gehen Sie im Eigenschaften-Editor von Blender zum Bereich **Output**.
2. Aktivieren Sie den Schalter **Smart Output**.
3. Legen Sie Ihr **Verzeichnismuster** und **Dateinamenmuster** mithilfe von Tokens fest.

## Token-Syntax

Tokens werden in konfigurierbare Klammern gesetzt. Der Standardstil verwendet eckige Klammern:

```
[view_layer]_[camera]_####.[file_format]
```

Dies wird zu etwa folgendem aufgelöst: `Front_3-4_CamHero_0001.png`

### Klammer-Stile

Wählen Sie Ihren bevorzugten Stil unter **Addon-Einstellungen > Verhaltensoptionen > Syntax-Klammern**:

| Stil | Syntax | Beispiel |
|-------|--------|---------|
| Eckig | `[token]` | `[view_layer]_####` |
| Geschwungene | `{token}` | `{view_layer}_####` |
| Eckige | `<token>` | `<view_layer>_####` |
| Klammer | `(token)` | `(view_layer)_####` |
| Prozent | `%token%` | `%view_layer%_####` |
| Dollar | `$token$` | `$view_layer$_####` |
| Hash | `#token#` | `#view_layer#_####` |

## Verfügbare Tokens

### Kontext-Token

| Token | Löst auf | Beispiel |
|-------|-------------|---------|
| `scene` | Name der aktiven Szene | `Kitchen` |
| `view_layer` | Name der aktiven Ansichtsebene | `Front_3-4` |
| `camera` | Name der aktiven Kamera | `CamHero` |
| `group` | Name der VL-Gruppe | `Hero_Shots` |

### Animationstoken

| Token | Löst auf | Beispiel |
|-------|-------------|---------|
| `frame` | Aktuelle Bildnummer | `42` |
| `frame_start` | Startbild der Szene | `1` |
| `frame_end` | Endframe der Szene | `250` |
| `frame_range` | Start-End-Bereich | `1-250` |
| `action` | Aktive Szenenaktion | `CameraFly` |
| `tks_action` | Kaskaden-aufgelöste Aktion | `SpinX` |

### Render-Token

| Token | Löst auf | Beispiel |
|-------|-------------|---------|
| `engine` | Name der Render-Engine | `cycles` |
| `samples` | Anzahl der Samples | `128` |
| `res_x` | Auflösung X | `1920` |
| `res_y` | Auflösung Y | `1080` |
| `file_format` | Ausgabeformat | `png` |

### System-Token

| Token | Löst auf | Beispiel |
|-------|-------------|---------|
| `blend` | Name der Blend-Datei | `project` |
| `date` | Aktuelles Datum | `2026-03-29` |
| `time` | Aktuelle Uhrzeit | `14-30-00` |
| `sep` | Trennzeichen | `_` |

!!! tip "Spickzettel"
    Klicken Sie auf die Schaltfläche **Syntax-Token** (Buchsymbol) in der Kopfzeile des Ausgabefensters,
    um eine vollständige interaktive Token-Referenz mit allen Kategorien anzuzeigen.

## Trennzeichen

Verwenden Sie bis zu 5 unabhängige Trennzeichen-Token (`[sep1]` bis `[sep5]`) für verschiedene Trennzeichen:

- `[sep1]` = `_` für Ordner
- `[sep2]` = `-` für Variablen
- `[sep3]` = `.` für die Versionierung

Konfigurieren Sie die Trennzeichen in den **Addon-Einstellungen**.

## Bildnummern

Verwenden Sie Blenders native `####`-Syntax für aufgefüllte Bildnummern. Smart Output behält dies bei und zeigt eine Live-Vorschau mit der aktuellen Bildnummer an.
