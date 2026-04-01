---
icon: material/compass
---

# Navigation Panel

**Localización:** *Properties Editor > pestaña Takes*

El Navigation Panel es el centro de control principal para gestionar tu jerarquía de Takes. Contiene el Takes Tree, iconos de anulación en cascada y acceso al renderizado por lotes (batch rendering).

## Controles del Encabezado

El encabezado del panel muestra la versión del addon y proporciona botones de acceso rápido:

| Control | Descripción |
|---------|-------------|
| **Lock** | Bloquea el panel para prevenir cambios accidentales de estado. |
| **Autokey** | Alterna el auto-keying de Blender en todas las escenas simultáneamente. |
| **Timeline Sync** | Sincroniza la posición del cabezal de reproducción en todas las escenas. |
| **Warnings** | Muestra advertencias activas (presets faltantes, acciones desconectadas). |
| **Globals** | Abre los ajustes globales del cascade. |
| **Help** | Abre la documentación (esta wiki). |
| **Settings** | Visibilidad del árbol y opciones de diseño. |

## El Takes Tree

El Takes Tree es una lista jerárquica unificada que muestra toda la estructura de tu proyecto:

```
📁 Scene Group
  🎬 Scene
    📂 VL Group
      🔲 View Layer
        📌 VL Version
```

### Elementos de Fila

Cada fila de View Layer muestra iconos de anulación de cascade. Estos iconos muestran de un vistazo qué propiedades están anuladas en ese nivel:

- **Ghost** — Estado del Rest State
- **Tag** — Color de etiqueta asignado
- **Variant** — Estado activo del Variant Switch
- **Action** — Asignación de acción del cascade
- **Compositor** — Anulación de árbol de nodos (node tree)
- **World** — Anulación del entorno (world)
- **Camera** — Asignación de cámara
- **Output** — Etiqueta/Regla de salida
- **Render** — Ajuste preestablecido de render (preset)

!!! tip "Desbordamiento de Iconos del Cascade"
    Cuando el panel es estrecho, los iconos de cascade se colapsan automáticamente en un botón
    de desbordamiento **⋯**. Al hacer clic en él, se abre un menú emergente mostrando todos los iconos.

### Líneas del Árbol

Las líneas de indentación configurables muestran la jerarquía visualmente. Los colores de las etiquetas pueden ser heredados por las líneas del árbol para una rápida identificación.

## Menú de Ajustes

Haz clic en el **ícono de engranaje** para acceder a los ajustes de visualización del árbol:

| Ajuste | Descripción |
|---------|-------------|
| **Show Tag Color** | Colorea las líneas de sangría del árbol por asignación de etiquetas. |
| **Line Width** | Líneas de indentación Delgadas / Medias / Gruesas. |
| **Icon Visibility** | Activa/desactiva iconos individuales del cascade. |
| **Preview Size** | Tamaño de las vistas previas integradas del VL (24/32/40 px). |

## Advertencias (Warnings)

El Navigation Panel muestra advertencias cuando se detectan problemas:

- **Missing Preset** — Una referencia a un preset de cascade apunta a un archivo JSON eliminado.
- **Dangling Action** — Una acción está a punto de perderse porque el Auto-Assign está desactivado.
