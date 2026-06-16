# OCG CommandCode — Handoff para próxima sesión

## Estado actual

El proyecto ya usa `ocg` como comando principal y `OCG CommandCode` como nombre visible del provider en OpenCode.

También quedó limpiada la instalación para usar storage nuevo en:

- `%APPDATA%\ocg\` en Windows
- `~/Library/Application Support/ocg/` en macOS
- `${XDG_CONFIG_HOME:-~/.config}/ocg/` en Linux

No se desea migración desde instalaciones legacy `opencg-cli`.

## Qué se hizo

### Branding / rename

- Provider visible en OpenCode: `OCG CommandCode`
- Mensajes CLI visibles alineados con `OCG`
- Autostart visible alineado con `OCG CommandCode`
- Slug interno actualizado a `opencode-ocg`

### Capacidades de modelos

Se verificó cómo OpenCode decide badges:

- `reasoning: true` => muestra “Permite razonamiento”
- `modalities.input` => muestra texto / imagen / audio / video / pdf
- `variants` sólo afecta niveles explícitos, no el badge base de reasoning

El shim ya expone metadatos curados para varios modelos de Command Code:

- reasoning en Kimi / DeepSeek V4 / GLM-5 / MiniMax / MiMo
- hints multimodales conservadores para Kimi y MiMo

### Refresh de modelos

- `ocg refresh-models`
- `ocg refresh-models --probe`
- `ocg refresh-models --full`
- `ocg refresh-models --parallel N`

Ya existe advertencia de consumo de créditos/tokens para probes reales.

### Bugfix importante

Se detectó un bug real en `ocg start --background`:

- confiaba demasiado en `shim.pid`
- podía anunciar “lanzado” aunque el puerto ya estaba ocupado
- eso dejaba viva una instancia vieja y OpenCode terminaba hablando con el proceso equivocado
- el síntoma visible era: `Token del shim inválido o faltante`

Se corrigió para que:

- revise `/health` antes de arrancar
- detecte conflicto de puerto/token
- espere que la nueva instancia responda antes de marcar éxito

## Commits relevantes

- `7293f3f` — `rename provider name`
- `f512786` — `feat: surface reasoning metadata in opencode`
- `7fe3036` — `refactor: migrate legacy opencg identifiers to ocg`

> OJO: el commit `7fe3036` fue luego ajustado localmente para eliminar migración legacy y dejar instalación limpia.

## Qué falta hacer

### 1. Commit pendiente

Hay cambios locales sin commit al momento de este handoff:

- eliminación de compat/migración legacy `opencg-cli`
- fix de `ocg start --background` para puerto ocupado / token conflict
- mensajes nuevos en i18n para esos casos

Antes de seguir, revisar:

```powershell
git status --short
git diff --stat
```

### 2. Validación funcional recomendada

Probar esta secuencia:

```powershell
ocg stop
ocg start --background
ocg status
ocg doctor
```

Luego probar conflicto real:

1. dejar un proceso ocupando `127.0.0.1:4310`
2. correr `ocg start --background`
3. confirmar que ahora NO diga “lanzado” falsamente

### 3. Verificar OpenCode

Revisar en:

- `C:\Users\diego\.config\opencode\opencode.json`

Confirmar:

- provider `cmdshim`
- nombre `OCG CommandCode`
- header `x-ocg-token`
- modelos con `reasoning: true` donde corresponda
- `modalities.input` correctas

### 4. Posible mejora siguiente

Si todo queda estable, la siguiente fase lógica sería:

- mejorar `ocg stop` para encontrar y cerrar la instancia real aunque el PID guardado esté stale

Hoy el start ya detecta conflicto mejor, pero el stop todavía depende bastante del PID.

## Hallazgo importante de debugging

En una prueba real, el puerto `4310` estaba ocupado por una instancia vieja lanzada con:

- `bin/commandcode-shim.js serve`

Eso explicaba:

- doble “start --background”
- PID nuevo muerto
- puerto tomado por proceso viejo
- error final de token en OpenCode

## Archivos más importantes a revisar

- `src/cli/main.js`
- `src/shared/i18n.js`
- `src/opencode/config.js`
- `src/shared/catalog.js`
- `src/shared/commandcode-thinking.js`
- `src/runtime/server.js`
- `src/config/paths.js`
- `src/config/store.js`
- `src/autostart/index.js`
- `src/autostart/windows.js`
- `src/autostart/macos.js`
- `src/autostart/linux.js`

## Nota para el próximo agente

NO asumir que el problema del token viene de OpenCode.
Primero verificar:

1. qué proceso escucha en `127.0.0.1:4310`
2. si el PID guardado existe de verdad
3. si `/health` responde con el token actual de `secrets.json`
4. si hay una instancia vieja corriendo desde otro entrypoint
