## MICTLAN ARENA

Web pública para esports con:
- Tablas de torneos y scrims
- Rankings de kills individuales y equipos
- Próximos scrims y torneos

Incluye un panel de administración oculto para actualizar en tiempo real lo que ve el público.

## Ejecutar en local

1) Instala dependencias y arranca el servidor:

```bash
npm run dev
```

2) Abre la web pública:
- http://localhost:3000

## Panel Admin (oculto)

- Ruta: http://localhost:3000/mictlan-control
- Requiere `ADMIN_TOKEN` en variables de entorno (no se guarda en el repo).

En Windows PowerShell (sesión actual):
```powershell
$env:ADMIN_TOKEN="tu-token-seguro"
npm run dev
```

En macOS/Linux:
```bash
ADMIN_TOKEN="tu-token-seguro" npm run dev
```

El panel te pedirá el token para cargar/guardar el estado. Al guardar, la web pública se actualiza en vivo (SSE).

## Datos

- Persisten en: `data/state.json`
- Endpoints:
  - Público: `/api/public/state` y `/api/public/stream`
  - Admin (protegido): `/api/admin/state`
