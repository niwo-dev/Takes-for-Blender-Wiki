# Einstellungen

**Pfad:** *Bearbeiten > Einstellungen > Erweiterungen > Takes for Blender*

Oder klicken Sie auf das **Zahnrad-Symbol** in der Kopfzeile des Navigationsbereichs und wählen Sie **Einstellungen öffnen**.

## Allgemein

| Einstellung | Standard | Beschreibung |
|---------|---------|-------------|
| **Einstellungen automatisch speichern** | Ein | Einstellungen zwischen Sitzungen als JSON speichern. |
| **Debug-Protokollierung** | Aus | Protokollierung nach Themen in täglichen Protokolldateien aktivieren. |

## Funktionen

| Einstellung | Standard | Beschreibung |
|---------|---------|-------------|
| **VL-Aktionen automatisch zuweisen** | Ein | Kaskadenaktionen automatisch pro Ansichtsebene zuweisen. |
| **Referenzaktion automatisch erstellen** | Ein | Keyframes automatisch in den Referenzzustand spiegeln. |
| **Aktionen automatisch umbenennen** | Ein | Aktionen entsprechend der Kaskaden-Namenskonvention umbenennen. |
| **Voreingestellter Automatisierungsmodus** | Manuell | Wie Änderungen an Voreinstellungen behandelt werden (automatisch übernehmen, synchronisieren, manuell). |
| **Sound bei Batch-Rendering** | Keine | Benachrichtigungston bei Abschluss des Batch-Renderings. |

## Verhalten

| Einstellung | Standard | Beschreibung |
|---------|---------|-------------|
| **Syntax-Klammern** | Eckig `[]` | Token-Trennzeichenstil für Smart Output. |
| **Trennzeichen** | `sep1`=`_` | Bis zu 5 konfigurierbare Trennzeichen-Token. |

## Debug-Protokollierung

Wenn aktiviert, schreibt die Debug-Protokollierung in tägliche Protokolldateien mit detaillierter Themenfilterung:

| Thema | Unterthemen |
|-------|-----------|
| **Kern** | VL-Umschalter, Kaskade |
| **UI** | Inspektor |
| **Ops** | Animation |
| **Funktionen** | Referenzzustand, Variantenumschalter |
| **Render** | Batch-Render |

Schaltflächen zum Umschalten auf Ebene (Debug, Info, Warnung, Fehler) filtern Meldungen, bevor eine Zeichenfolgenformatierung erfolgt.

!!! Hinweis „Protokollspeicherort“
    Protokolle werden als `takes_for_blender_YYYY-MM-DD.log` im
    konfigurierten Protokollverzeichnis gespeichert. Dateien, die älter als 7 Tage sind, werden automatisch gelöscht.
