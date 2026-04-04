---
icon: material/magnify-scan
---

# Inspector Panel

**Localización:** *Properties Editor > pestaña Takes > Inspector*

El Inspector Panel proporciona una lista de seguimiento (watchlist) por objeto que muestra qué objetos son gestionados por el sistema cascade, sus acciones asignadas, slots y subdatos (materiales, node trees, shape keys).

## Gestionado vs. Anclado (Managed vs. Pinned)

Los objetos en la lista de seguimiento tienen uno de dos estados:

Managed (Gestionado)
:   Sigue el sistema de cascade. La acción del objeto es asignada automáticamente por la cascada del View Layer activo.

Pinned (Anclado)
:   Exento de la gestión del cascade. El objeto mantiene su propia acción independientemente de los cambios de View Layer. Ancla un objeto haciendo clic en el **ícono de chincheta (pin)** en su fila.

!!! warning "Desanclar"
    Al desanclar un objeto que tiene una acción, se mostrará un diálogo de confirmación,
    porque esa acción será reemplazada por la asignación del cascade.

## Lista de seguimiento (Watchlist)

La lista de seguimiento muestra todos los objetos relevantes para el View Layer actual:

| Columna | Descripción |
|--------|-------------|
| **Pin** | Alternar estado gestionado/anclado. |
| **Name** | Nombre del objeto (haz clic para seleccionarlo en el visor). |
| **Iconos de Sub-datos** | Iconos compactos para cada bloque de datos animado (material, node tree, etc.). |

### Modo Compacto

En modo compacto, los iconos de sub-datos aparecen como una fila de iconos pequeños junto a cada objeto:

- **Ícono brillante** — El bloque de datos tiene una acción asignada
- **Ícono atenuado** — No hay acción en este bloque de datos

Haz clic en cualquier icono de sub-datos para abrir un menú emergente para la gestión de acciones y slots por bloque de datos.

## Filtros

Filtra la lista de seguimiento usando los botones del encabezado:

- **Filtro Pinned** — Muestra solo los objetos anclados
- **Filtro Unpinned** — Muestra solo los objetos gestionados

Los iconos de filtro se desactivan (en gris) cuando su recuento es cero.

## Acciones & Slots

Selecciona un objeto en la lista para ver sus detalles de acción y slots en la sección inferior del Inspector:

- **Lista de Acciones** — Muestra todas las acciones que hacen referencia a este objeto
- **Lista de Slots** — Muestra todos los slots dentro de la acción activa
- **Renombrar integrado** — Haz doble clic en el nombre de una acción o slot para renombrarlo
