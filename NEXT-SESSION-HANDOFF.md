# Next session handoff

## Done

- Project renamed and normalized around `ocg` / OpenCommandGo clean install.
- Provider label in OpenCode is `OCG CommandCode`.
- Model refresh supports catalog-only sync, `--probe`, `--full`, `--parallel`, and confirmation gating for token-spending probes.
- Runtime exposes watchdog-assisted background start, `/shutdown`, log files, and reset flow.
- README was aligned with the current runtime commands and release workflow files.
- Focused tests were added for CLI refresh parsing and watchdog restart counting.

## Verified current state

- Main tracked behavior lives in:
  - `C:\Users\diego\OneDrive\Documentos\commandcode-go-around\src\cli\main.js`
  - `C:\Users\diego\OneDrive\Documentos\commandcode-go-around\src\runtime\server.js`
  - `C:\Users\diego\OneDrive\Documentos\commandcode-go-around\src\watchdog\index.js`
- Existing workflow files:
  - `C:\Users\diego\OneDrive\Documentos\commandcode-go-around\.github\workflows\ci.yml`
  - `C:\Users\diego\OneDrive\Documentos\commandcode-go-around\.github\workflows\publish.yml`
  - `C:\Users\diego\OneDrive\Documentos\commandcode-go-around\.github\workflows\auto-release.yml`

## Still missing / next phase

1. Real CLI integration tests for `ocg start --background`, `ocg stop`, `ocg logs`, and watchdog recovery.
2. Stronger verification around OpenCode capability badges versus what upstream Command Code exposes.
3. Optional cleanup/refactor of `src/runtime/server.js`, which is still carrying too many responsibilities.
4. Decide if release automation policy should stay tag-driven + develop auto-release exactly as committed.

## Important constraints

- Do not add migration logic; keep installation clean.
- Do not run build steps after changes.
- Probe/full model verification spends Command Code Go credits/tokens by design.
