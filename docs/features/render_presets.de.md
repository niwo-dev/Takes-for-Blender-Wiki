# Render-Voreinstellungen

**Render-Voreinstellungen** sind JSON-basierte Momentaufnahmen der Blender-Rendereinstellungen, die über das Kaskadensystem einzelnen Ansichtsebenen zugewiesen werden können.

## Voreinstellungstypen

| Typ | Was wird erfasst? |
|------|-----------------|
| **Render** | Engine, Samples, Auflösung, Farbmanagement, Filmeinstellungen. |
| **Kamera** | Brennweite, Sensorgröße, Schärfentiefe, Clip-Abstände. |
| **Welt** | Umgebungsbeleuchtung, Hintergrundfarbe, AO-Einstellungen. |
| **Dateiausgabe** | Ausgabeformat, Farbtiefe, Komprimierung, Smart-Output-Pfade. |

## Voreinstellungen erstellen

1. Konfigurieren Sie Ihre Render-Einstellungen wie gewünscht im Eigenschaften-Editor von Blender.
2. Öffnen Sie das Voreinstellungs-Popover (Zahnrad-Symbol in der Kaskadenzeile).
3. Klicken Sie auf **Als Voreinstellung speichern** und geben Sie einen Namen ein.
4. Die Voreinstellung wird als JSON-Datei in Ihrem Benutzer-Voreinstellungsordner gespeichert.

## Voreinstellungen zuweisen

Voreinstellungen werden über die Kaskade zugewiesen – sie können auf jeder Ebene festgelegt werden:

- **Global** — Standard-Render-Einstellungen für das gesamte Projekt
- **Szenengruppe** — Gemeinsame Einstellungen für eine Gruppe von Szenen
- **Ansichtsebene** – Renderkonfiguration pro Aufnahme
- **VL-Version** – Versionsspezifische Anpassungen

## Dirty-Status

Wenn Sie die Render-Einstellungen nach dem Anwenden einer Voreinstellung ändern, erscheint ein **Dirty-Indikator**:

- **Übernehmen** – Speichern Sie die Änderungen an der Voreinstellung
- **Zurücksetzen** — Änderungen verwerfen und die Voreinstellungswerte wiederherstellen
- **Übernehmen & Synchronisieren** (++Alt++-Klick auf „Übernehmen“) — Speichern und auf alle Ebenen übertragen, die diese Voreinstellung verwenden

!!! note „Ebenenanzeigen“
    Voreinstellungs-Dropdown-Menüs zeigen ein `[Tier]`-Suffix (z. B. `[Addon]`, `[User]`)
    , um integrierte von benutzerdefinierten Voreinstellungen zu unterscheiden.
