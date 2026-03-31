# FAQ

## Allgemeines

??? Frage "Welche Blender-Version benötige ich?"
    "Takes for Blender" erfordert **Blender 5.1** oder neuer. Es basiert auf
    dem in Blender 5.0 eingeführten "Slotted Action"-System.

??? Frage "Funktioniert es mit EEVEE und Cycles?"
    Ja. Die Kaskaden- und Batch-Render-Systeme sind engineunabhängig.
    Render-Voreinstellungen erfassen enginespezifische Einstellungen automatisch.

??? Frage "Kann ich es mit anderen Add-ons verwenden?"
    Im Allgemeinen ja. Takes for Blender nutzt die Standard-Blender-API und
    nimmt keine Monkey-Patches an Kernfunktionen vor. Sollten Konflikte auftreten,
    bitte diese melden.

## Takes & Cascade

??? Frage "Was passiert mit meiner Animation, wenn ich die Ansichtsebenen wechsle?"
    Objekte springen in ihren Ruhezustand (neutrale Pose), wenn sie keine
    Animation auf der Ziel-Ansichtsebene haben. Ist dies der Fall, wird die Cascade-Aktion
    automatisch angewendet.

??? Frage "Warum ist mein Kaskaden-Symbol abgeblendet?"
    Ein abgeblendetes Symbol bedeutet, dass der Wert von einer übergeordneten Ebene **geerbt** wurde.
    Ein helles Symbol bedeutet, dass er auf dieser Ebene **explizit festgelegt** wurde.
    Alt+Klick, um eine Überschreibung zu löschen.

??? Frage "Kann ich unterschiedliche Frame-Bereiche pro Ansichtsebene haben?"
    Frame-Bereiche sind in Blender eine Eigenschaft auf Szenenebene. Verwenden Sie verschiedene
    Szenen, wenn Sie unterschiedliche Frame-Bereiche benötigen.

## Inspektor

??? Frage "Warum ist meine Liste rot?"
    Eine rote Markierung in der Beobachtungsliste weist auf eine Warnung wegen einer **hängenden Aktion** hin –
    ein Objekt verfügt über Animationsdaten, die nicht von der Kaskade verwaltet werden.
    Heften Sie das Objekt an oder aktivieren Sie "Auto-Assign", um das Problem zu beheben.

??? Frage "Was ist der Unterschied zwischen "Managed" und "Pinned"?"
    **Managed**-Objekte folgen der Kaskade – ihre Aktion wird
    automatisch zugewiesen. **Pinned**-Objekte behalten ihre eigene Aktion unabhängig
    von Wechseln der Ansichtsebene.

## Batch-Rendering

??? Frage "Warum hat mein Rendering nicht begonnen?"
    Überprüfen Sie Folgendes:

 1. Die Datei ist gespeichert (erforderlich für den Hintergrundmodus).
    2. In der Kaskade ist eine Kamera zugewiesen.
    3. Das Batch-System ist nicht hängengeblieben (Alt+Klick auf die Schaltfläche "Render", um zurückzusetzen).

??? Frage "Kann ich nur bestimmte View Layers rendern?"
    Ja. Aktivieren Sie die Mehrfachauswahl in der Baum-Seitenleiste, wählen Sie die gewünschten VLs aus
    und klicken Sie dann auf "Render". Nur ausgewählte VLs werden in die Warteschlange gestellt.

??? Frage "Wo werden meine Renderings gespeichert?"
    Ausgabepfade werden durch das Smart-Output-Muster bestimmt.
    Überprüfen Sie **Eigenschaften > Ausgabe**, um das aktuelle Muster anzuzeigen.
    Die Token-Auflösung erfolgt zum Zeitpunkt des Renderings.

## Variantenwechsel

??? Frage "Kann ich den Swap- und den Pool-Modus mischen?"
    Jedes Teil verwendet jeweils nur einen Modus. Verschiedene Teile innerhalb desselben
    Produkts können unterschiedliche Modi verwenden.

## Fehlerbehebung

??? Frage "Das Add-on wird nach der Installation nicht angezeigt."
    Stellen Sie sicher, dass Sie es aus dem `.zip` installiert haben, ohne es zu extrahieren.
    Überprüfen Sie die Blender-Konsole (Fenster > Systemkonsole umschalten) auf Fehler.

??? Frage: "Es kommt zu Abstürzen beim Wechseln der Ansichtsebenen."
    Dies deutet in der Regel auf einen Konflikt mit dem Depsgraph-Handler eines anderen Add-ons hin.
    Versuchen Sie, andere Add-ons zu deaktivieren, um das Problem einzugrenzen. Aktivieren Sie die Debug-Protokollierung
    und fügen Sie die Protokolldatei bei Ihrer Meldung bei.
