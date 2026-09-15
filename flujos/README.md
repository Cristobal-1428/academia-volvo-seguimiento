# Archivos de flujo (PDF / imagen)

Pon aquí los PDFs o imágenes con el diagrama de flujo de cada fase. Ejemplos
de nombre: `fase-1.pdf`, `fase-1-diagrama.png`.

Luego, en `data.json`, referencia el archivo en la fase correspondiente:

```json
{
  "id": 1,
  "nombre": "Fase 1: Levantamiento As-Is de la Academia",
  "flujoPdf": "flujos/fase-1.pdf"
}
```

o, si es una imagen (PNG/JPG/SVG) en vez de un PDF:

```json
{
  "id": 1,
  "flujoImagen": "flujos/fase-1.png"
}
```

Reglas:

- Si `flujoPdf` está presente, se muestra el PDF embebido (grande, a la
  derecha) más un link para abrirlo en una pestaña nueva.
- Si no hay `flujoPdf` pero sí `flujoImagen`, se muestra la imagen.
- Si no hay ninguno de los dos, se usa la lista de pasos en `flujo`
  (el formato de texto numerado que ya existía).
- Puedes borrar `flujoPdf`/`flujoImagen` de una fase en cualquier momento
  para volver a la lista de texto.
