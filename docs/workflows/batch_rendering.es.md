---
icon: material/play-box-multiple
---

# Flujo de Trabajo: Renderizado por Lotes (Batch Rendering)

Este flujo de trabajo cubre la configuración y ejecución de un renderizado por lotes completo a través de múltiples View Layers mediante anulaciones (overrides) en cascada y Smart Output.

## Requisitos Previos

- Escena con múltiples View Layers configurados
- Anulaciones en cascada asignadas (cámaras, mundos, presets)
- Patrones predefinidos en Smart Output

## Configurar Smart Output

### 1. Definir el Patrón de Salida

1. Vete a **Properties > Output**.
2. Habilita **Smart Output**.
3. Establece el Patrón de Directorio (Directory Pattern):

    ```
    //renders/[scene]/[view_layer]/
    ```

4. Establece el Patrón de Nombre de Archivo (File Name Pattern):

    ```
    [view_layer]_[camera]_####.[file_format]
    ```

### 2. Asignar Render Presets

Para una calidad consistente a través de todos los VLs:

1. Configura tus ajustes de render (motor, muestras, resolución).
2. Guárdalo como un "render preset" a través del popover de cascada.
3. Asígnalo a nivel **Global** para todos los VLs, o por VL Group para diferentes niveles de calidad.

## Ejecutando el Batch

### Modo Primer Plano (Foreground)

1. Abre la barra lateral con el Takes Tree.
2. Clickea el botón **Render**.
3. La lista de tareas procesa la cola de acuerdo al orden en el árbol para cada proyecto final originario nativamente:
    - Alternación generalizada oficial para escena/VL.
    - Resoluciones principales del overrides por cascada (cámara, mundo, acción original interactiva y sub-estado general originario).
    - Aplica la opción nativa del render preset preestablecido.
    - Se genera el Render oficial visual nativo y el guardado va la ruta base originaria conectada predefinida por las estructuras base nativas directas y originarias establecidas local y previamente en Smart Output.
4. El progreso es marcado por cada nivel del proyecto final originario oficial y el render es encolado mediante barras y señales de porcentaje.

### Modo Segundo Plano (Background)

1. Clickea en el botón original en forma particular de **Escritorio/Desktop** general alternativo secundario para empezar en este formato.
2. Blender se mantiene funcional (en un estado interactivo sin bloqueo visual total) permitiendo interacciones paralelas mientras la tarea oficial de computo secundario opera un render paralelo.
3. Las miniaturas operativas del View Layer actualizan procesualmente al terminar las fases de procesamiento oficial generalizadas originarias a tú edición activa interconectada local.

## Monitoreo del Progreso

La cola interactiva lateral en modo render te señala activamente y a la vista:

- Una barra nativamente orientada a un avance procedimental pre-calculado para visualizar progreso por VL (View Layer).
- El estado preestablecido genérico por la sección principal y base actualizando oficialmente por fases locales generadas: `Pending`, `Rendering`, `Saving`, `Done`, `Failed`, `Cancelled`.
- Indicación original tipo pop-up del por qué sucedió (y a leer internamente de modo fácil) mostrando la descripción física de un mensaje de falla general o predeterminado inicial activo.

## Estructura Final Nativa Base en Sistema Físico Oficial de Exportación Final de Salida Originaria Creada (Output Structure)

Con los patrones indicados general predeterminados al modo oficial primario, tu archivo local a nivel central lucirá: 

```
renders/
├── Kitchen/
│   ├── Front_3-4/
│   │   ├── Front_3-4_CamHero_0001.png
│   │   └── Front_3-4_CamHero_0250.png
│   └── Top_Down/
│       ├── Top_Down_CamTop_0001.png
│       └── Top_Down_CamTop_0250.png
└── Bathroom/
    └── ...
```

## Tips Adicionales Integrados

!!! tip "Sonido Principal Secundario Predeterminado Confirmatorio Generado Originalmente"
    Un menú oficial generalizado de tu **Preferences > Features** ajusta tus opciones de notificación confirmando finalización por alerta paralela oficial generalizada para render secundario background finalizado base oficial. Esta incluye soportes nativos de PC genérico al lado general operativo e internos del audio físico particular custom a través del canal (`.wav`).

!!! tip "Verificaciones (Preview Before Render originario inicial general base oficial operativo)"
    A través de **++alt++-click** en tu visual genérico de render a un extremo inferior del lado general paralelo de cualquier VL nativo individual, permites de inmediato precargar inicial a manera oficial secundaria general de tú salida inmediata oficial previa renderizada inicial nativa guardada localmente generada sin iniciar y bloquear de inicio un flujo general preestablecido al render activo principal operativo inicial local. 

!!! warning "Guarda el proyecto Primero Inicial Oficial Paralelo Originario (Save First / Prevención oficial interactiva generalizable primaria nativa originaria local operativa secundaria)"
    Tus tareas secundarias de Background exigirán un archivo final `blend` con registro previo (grabado previo) oficial preestablecido antes que el proyecto operativo pueda fluir oficial. Render oficial genérico primario frontal fluye independientemente con toda modificación flotante sin estar salvada a la unidad principal operativa local inicial originaria conectada.
