# Batch Render

El sistema **Batch Render** automatiza el proceso de renderizado en múltiples View Layers, aplicando los overrides del cascade (cámaras, mundos, acciones, presets de render y variantes) en cada uno.

## Modos de Renderizado

Takes for Blender soporta dos tipos de colas para render:

=== "Foreground" (Primer Plano)
    Renderiza dentro de la sesión actual de Blender. Puedes ver la ventana de render final en tiempo real, pero el uso de Blender queda bloqueado durante este estado.

    - Clic en el botón **Render** (:material-image:) en la barra lateral del árbol.
    - El estado procesual se ve por cada VL con un indicador.
    - Presiona ++esc++ para cancelar.

=== "Background" (Segundo Plano)
    Ejecuta renders a través de subprocesos independientes (headless) de Blender. Tú puedes seguir usando Blender y trabajar en la escena mientras avanza otra parte en paralelo.

    - Clic en el botón **Desktop** (:material-desktop-classic:) de la barra de control.
    - La vista de árbol se actualiza progresivamente confirmando cuando está terminada.
    - Un sonido de completado sonará al finalizar la cola.

## Cola de Render

La cola muestra el estatus de cada View Layer individual:

| Estatus | Descripción |
|--------|-------------|
| **Pending** | Pendiente por procesar en el batch. |
| **Rendering** | Al momento trabajando visualmente. |
| **Saving** | Al momento guardando archivo al disco. |
| **Done** | Terminación exitosa en el árbol. |
| **Failed** | ¡Ocurrió un error (pon ratón en el VL para leer)! |
| **Cancelled** | Marcación cancelada de la ejecución. |

## Opciones de Selección

- **Único View Layer** — Solo genera render el View Layer activo globalmente (predeterminado).
- **Multi-select** — Al activarlo (vía las celdas laterales), renderizarás masivamente los View Layers marcados.

!!! tip "Orden del render"
    El Batch Render rastrea siempre de arriba a bajo dentro de su estructura original de visión; y ***no*** al marco numérico preestablecido original tras la creación interna inicial nativa.

## Recuperación

Si tu batch render tiene fallos bloqueados:

1. Usa la combinación **Alt+Click** sobre el botón principal en la tabla para reiniciarlo.
2. Esto destruye señales pendientes u otros manejadores desarticulados de fondo.

## Salidas de Guardado (Output)

La meta de origen finaliza trabajando el subsistema [Smart Output](smart_output.md) junto su formato. Todo nivel independiente es asignado con su nomenclatura por cada regla específica.
