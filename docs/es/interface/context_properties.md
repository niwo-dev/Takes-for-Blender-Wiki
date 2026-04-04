---
icon: material/tune-vertical
---

# Context Properties

**Localización:** *Properties Editor > pestaña Takes > Context*

El panel de Context Properties muestra los ajustes de anulación de cascade para el View Layer actualmente activo. Cada categoría de propiedad tiene su propio menú emergente accesible mediante los iconos de cascade en el árbol.

## Menús Emergentes del Cascade

Haz clic en cualquier icono de cascade en la fila del árbol para abrir su menú emergente (popover). Cada menú te permite establecer o limpiar una anulación en ese nivel específico de la jerarquía.

### Camera Popover

Asigna una cámara por View Layer:

- **Camera selector** — Desplegable que muestra solo los objetos de tipo cámara vinculados a la escena actual.
- **Camera preset** — Aplica un preajuste de cámara guardado (distancia focal, tamaño de sensor, etc.).
- **New / Rename** — Crea una cámara nueva o renombra la asignada.

!!! note "Guardia de Cámara"
    La interfaz de presets de cámara se deshabilita cuando el objeto seleccionado no es la
    cámara resuelta por la cascada. Un mensaje informativo indicará "Assign a camera in the cascade."

### World Popover

Asigna un entorno de mundo por View Layer:

- **World selector** — Elige de los bloques de datos de entorno disponibles.
- **World preset** — Aplica un preset de mundo guardado.
- **World rule** — Utiliza una regla basada en etiquetas para la selección automática del mundo.

### Action Popover

Ve y gestiona la asignación de la acción del cascade:

- **Current action** — La acción de la cascada resuelta para este View Layer.
- **Re-apply Cascade** — Restaura la acción de la cascada después de haberla limpiado manualmente.

### Compositor Popover

Asigna un árbol de nodos (node tree) para el compositing por View Layer.

### Output Popover

Configura ajustes de salida de render:

- **Output rule** — Regla de ruta de salida basada en etiquetas.
- **Render preset** — Ajustes de renderizado por View Layer.

## Resolución de las Anulaciones

Las anulaciones (overrides) se resuelven de arriba hacia abajo a través de la jerarquía de la cascada. El primer valor no vacío gana:

```
Global → Scene Group → Scene → VL Group → View Layer → VL Version
```

Un icono aparece **brillante** cuando se establece un valor en ese nivel, y **atenuado** cuando se hereda de un nivel padre.
