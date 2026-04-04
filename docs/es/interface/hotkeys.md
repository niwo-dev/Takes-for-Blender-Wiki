---
icon: material/keyboard
---

# Atajos de Teclado (Hotkeys)

Todos los atajos de teclado están activos cuando el cursor se encuentra sobre la **barra lateral del 3D Viewport** (N-panel).
Los atajos de teclado que comparten la misma tecla en diferentes listas son **focus-aware** — solo la lista actualmente visible/activa responderá.

---

### Genéricos (Todas las Listas)

| Atajo | Acción | Notas |
|----------|--------|-------|
| <kbd>Ctrl</kbd> + <kbd>I</kbd> | **Invertir Selección** | Solo activo cuando el modo multi-selección está habilitado. Invierte la selección actual dentro de la lista que tiene el foco. |

---

### Navigation Panel (Takes Tree)

| Atajo | Acción | Notas |
|----------|--------|-------|
| <kbd>DEL</kbd> / <kbd>X</kbd> | **Eliminar Elemento** | Elimina la Escena, View Layer, o Grupo seleccionado. Muestra un diálogo de confirmación. En el modo multi-selección, borra en lote todos los elementos seleccionados. |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | **Añadir** | Abre el menú de añadir (Add) para crear una nueva escena o View Layer. |
| <kbd>F2</kbd> | **Renombrar** | Abre un diálogo para renombrar el elemento seleccionado. |
| <kbd>Ctrl</kbd> + <kbd>G</kbd> | **Agrupar** | Agrupa los elementos seleccionados en un Scene Group o VL Group. |
| <kbd>Alt</kbd> + <kbd>G</kbd> | **Desagrupar** | Elimina el elemento seleccionado de su grupo. |
| <kbd>Ctrl</kbd> + <kbd>T</kbd> | **Reasignar (Retarget)** | Abre el diálogo de retargeting para la escena o View Layer seleccionado. |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>I</kbd> | **Establecer Referencia (Set Reference)** | Establece el valor de referencia predeterminado (reference default) para el elemento seleccionado. |

---

### Variant Tree

| Atajo | Acción | Notas |
|----------|--------|-------|
| <kbd>DEL</kbd> / <kbd>X</kbd> | **Eliminar Elemento** | Elimina el Producto, State, Part, o Material de Pool seleccionado. Obliga a mantener al menos 1 State y 1 Part por producto. |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | **Añadir Inteligente (Smart Add)** | Añadir consciente del contexto: detecta automáticamente qué crear según la selección actual. Si se selecciona un encabezado de State o un State, añade un State. Si se selecciona un Part o Material de Pool, añade un Material de Pool. Si se selecciona un Product, muestra el menú completo de añadir. |
| <kbd>F2</kbd> | **Renombrar** | Abre un diálogo para renombrar el Producto, State, o Part seleccionado. |

---

### Modo Multi-Selección

El modo multi-selección se activa haciendo clic en el conmutador **☐** en la fila de estadísticas (stats row) de cualquier lista.

| Atajo | Acción | Notas |
|----------|--------|-------|
| <kbd>Shift</kbd> + Clic (alternar) | **Seleccionar Todo** | Selecciona todos los elementos visibles. Respeta los filtros de tipo activos. |
| <kbd>Alt</kbd> + Clic (alternar) | **Invertir** | Invierte la selección actual. |
| <kbd>Ctrl</kbd> + <kbd>I</kbd> | **Invertir** | Igual que Alt+Click — atajo de teclado para invertir. |
| Clic ícono de stat | **Filtro de Tipo** | Filtra las casillas a un tipo específico (ej. solo Scenes, solo States). Haz clic de nuevo para limpiarlo. |
