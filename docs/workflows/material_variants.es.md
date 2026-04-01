---
icon: material/palette
---

# Flujo de Trabajo: Variantes de Materiales

Este flujo de trabajo enseña cómo configurar variantes de color o acabado para un producto utilizando el sistema Variant Switch.

## Escenario

Tienes un producto (por ejemplo, una botella de agua) que necesita ser renderizado en tres acabados distintos: Negro Mate, Aluminio Cepillado y Oro Rosa.

## Configuración

### 1. Crear el Producto (Product)

1. Abre el panel **Variant Switch**.
2. Presiona ++ctrl+n++ o haz clic en **+** para crear un nuevo Product llamado "Botella".
3. Una Parte (Part) predeterminada ("base") se creará automáticamente.

### 2. Definir las Partes (Parts)

Divide el producto en sus componentes:

1. Añade un Part llamado "Cuerpo" → asigna la colección pertinente (ej. colección del cuerpo de la botella).
2. Añade un Part llamado "Tapa" → asigna la colección de la tapa.
3. Añade un Part llamado "Etiqueta" → asigna la colección de la etiqueta.

### 3. Agregar Materiales a los Pools

Para cada Part, rellena el pool de materiales:

1. Expande "Cuerpo" para ver su pool.
2. Asigna `Mat_Matte_Black` a la ranura (slot) 1.
3. Asigna `Mat_Aluminum` a la ranura 2 (se crea automáticamente un nuevo slot tras asignar el primero).
4. Asigna `Mat_Rose_Gold` a la ranura 3.
5. Repite este mismo proceso para la Tapa y la Etiqueta con sus respectivos materiales.

### 4. Crear los Estados (States)

Añade un State (Estado) diferente para cada versión o variante en general:

1. Añade State "Matte Black" → establece base de pool index 1 paralela para cada división de parts secundaria nativa.
2. Añade State "Aluminum" → establece el inicio index primario del pool general oficial 2 para las variables generalizadas operativas asociadas en subnivel de partes oficiales originarias generalizadas nativas conectadas pre-establecidas.
3. Añade State "Rose Gold" → conecta general preestablecido al index 3.

## Visualizando los cambios previos operables base oficial de variante

Al seleccionar oprimiendo generalizado unificado originario del **diamante** posicionado directamente encima y en línea por tu modelo de `State`, forzarás y observarás la reconfiguración y estado interactivo central sin intermediario directo visible general aplicando nativamente y sustituyéndolos variables inmediatamente para revisión primaria general.

## Operaciones Oficiales Primarias Múltiples Finales Generadas Operativas Paralelas Oficial (Rendering All Variants Oficial Generalizado de Mote)

### Opción A Inicial Original: Trabajo Tradicional

1. Configura manualmente por "Toggle" y fija general un State particular interactivo local.
2. Dispara tu proceso original presionado ++f12++ interactivo inicial secundario paralelo oficial. 

### Opción B Inicial Originaria: Integrado Directo y Automatizado con la Cascada Global Central

1. Elabora a nivel paralelo un View Layer dependiente originario global para aplicar a un variante.
2. A cada VL, integra de modo interactivo primario subordinado local de inicio una relación paralela vinculatoria seleccionable a Variant Switch State asociado operativo oficial.
3. Dirige tu lote de render original (Batch Render) a nivel generalizado conectando localmente su base para las opciones y estados.

### Opción C Oficial Múltiple de Cierre Interconectada Integrando Tomas de Cámara Parciales Únicas (Combinación por matriz secundaria generalizada a opciones de visualización oficial integrada global)

Formula visualizaciones integrando la duplicidad base (configuración original vinculada global a cámara oficial y variant):

| Escenario Oficial y VL Asignable Inicial General | Material Directo y Estado Inicial (Variant) | Óptica (Camera) |
|------------|---------|--------|
| Black_Front | Matte Black | Cam_Front |
| Black_Side | Matte Black | Cam_Side |
| Alu_Front | Aluminum | Cam_Front |
| Alu_Side | Aluminum | Cam_Side |

El Batch Render gestiona absolutamente todas la variable operativa cruzada usando sintaxis directa a través del Smart Output con la nomenclatura siguiente:

```
[variant]_[camera]_####.[file_format]
```
