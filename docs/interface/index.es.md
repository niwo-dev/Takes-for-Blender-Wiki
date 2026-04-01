---
icon: material/view-dashboard
---

# Interfaz

La interfaz de Takes for Blender se encuentra en la barra lateral del **Properties Editor**. Consiste en cuatro paneles principales accesibles a través de la barra de pestañas en la parte superior del Navigation Panel.

## Descripción General del Panel

| Panel | Propósito |
|-------|---------|
| [**Navigation Panel**](navigation_panel.md) | El centro de control principal — Cambio de Take/VL, vista de árbol, iconos de cascade y acceso al batch render. |
| [**Inspector Panel**](inspector_panel.md) | Lista de seguimiento (watchlist) por objeto que muestra objetos gestionados/anclados (pinned), sus acciones, slots y subdatos. |
| [**Context Properties**](context_properties.md) | Propiedades de anulación (override) de cascade por View Layer — cámaras, mundos, compositors, acciones y presets. |
| [**Variant Tree**](variant_tree.md) | Gestión de variantes de producto — productos, estados, partes y pools de materiales. |

## Pestañas de Navegación

El encabezado del Navigation Panel contiene tres botones que alternan entre las vistas de Context, Link e Inspector:

- **Context** — El Takes Tree y los ajustes por VL
- **Link** — Vinculación y gestión de colecciones
- **Inspector** — Lista de seguimiento de objetos y gestión de acciones/slots

!!! tip "Atajos de Teclado"
    Muchas operaciones del árbol soportan atajos de teclado:

    - ++ctrl+n++ — Añadir nuevo elemento (según el contexto)
    - ++shift+d++ — Duplicar (copia completa)
    - ++alt+d++ — Duplicar (copia vinculada)
    - ++ctrl+g++ — Crear grupo
    - ++alt+g++ — Desagrupar
    - ++del++ o ++x++ — Eliminar con confirmación
    - ++f2++ — Renombrar
