# Fuentes Volvo

Este proyecto usa "Volvo Novum" y "Volvo Broad Spread" como fuentes de marca, con
fallback a Inter/Helvetica/Arial mientras no estén disponibles como webfont.

Si consigues los archivos oficiales (por ejemplo desde el portal de marca de
Volvo Group), colócalos en esta carpeta con estos nombres exactos para que
`style.css` los cargue automáticamente vía `@font-face`:

- `VolvoNovum-Regular.woff2` (peso 400)
- `VolvoNovum-Medium.woff2` (peso 500)
- `VolvoNovum-Bold.woff2` (peso 700)
- `VolvoBroadSpread-Bold.woff2` (peso 700, solo para títulos)

No se requiere ningún cambio de código: si los archivos no existen, el sitio
sigue funcionando normalmente con la fuente de respaldo.
