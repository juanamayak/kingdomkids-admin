# Plan de Mejoras — KingdomKids Admin hacia CRM/ERP
**Mundo de Fe Playa del Carmen · Angular 19 + TailwindCSS + PrimeNG 19**
*Documento generado: Julio 2026*

---

## Contexto

El panel admin actualmente tiene **un solo módulo operativo**: `kids` — con lista, filtros, detalle y reporte Excel. El sidebar, el layout y el routing ya están estructurados de forma modular. La base es buena. El trabajo es darle forma de plataforma real.

**Principio guía de este plan:** maximizar el valor visual y funcional del frontend **sin tocar el backend** (salvo los casos marcados explícitamente como necesarios). Todos los nuevos módulos de navegación pueden construirse como pantallas `coming soon` con datos simulados mientras el backend madura.

---

## 🔴 Prioridad 1 — Correcciones que bloquean el aspecto profesional

### 1.1 Activar AuthGuard

**Problema:** El panel es accesible sin login. Cualquier persona con la URL entra.
**Solución:** Descomentar y conectar el `AuthGuard` en `app.routes.ts` y `features.routes.ts`.
**Backend:** ✅ No requiere cambios — el login y JWT ya existen.

```typescript
// features.routes.ts — agregar canActivate
{
  path: 'kids',
  canActivate: [authGuard],
  children: [...]
}
```

---

### 1.2 Corregir imports de environment

**Problema:** `SessionService` y `KidsService` importan `environment.development` hardcodeado.
**Solución:** Reemplazar en ambos servicios:

```typescript
// ❌ Actualmente
import { environment } from '../../../environments/environment.development';

// ✅ Correcto
import { environment } from '../../../environments/environment';
```

---

### 1.3 Limpiar componentes residuales del template BuyBack/FlyAdd

**Problema:** `shared/components/` tiene `clients-information`, `contract-details`, `dialogs`, `signature-pad` — ninguno pertenece al dominio de la iglesia.
**Solución:** Eliminar esos 4 directorios. No están siendo usados en ninguna ruta activa.
**Impacto:** Reduce ~70% del ruido en el proyecto y aclara la arquitectura real.

---

## 🟠 Prioridad 2 — Darle forma de CRM/ERP al panel (sin nuevo backend)

### 2.1 Dashboard principal con KPIs reales

**Ruta:** `/dashboard`
**Descripción:** Pantalla de bienvenida con métricas del estado actual del sistema.

**Datos disponibles hoy (solo con endpoints existentes):**
- Total niños registrados → `GET /api/register`
- Check-ins del día → `GET /api/checkinAndOut/index`

**KPIs a mostrar:**

| Métrica | Fuente de datos | Cálculo |
|---|---|---|
| Niños registrados totales | `GET /api/register` | `kids.length` |
| Check-ins hoy | `GET /api/checkinAndOut/index` | `checkins.length` |
| Niños presentes ahora | `GET /api/checkinAndOut/index` | Filtrar donde `checkout_time == null` |
| Niños con alergias | `GET /api/register` | Filtrar `allergy != null` |
| Niños miembros MDF | `GET /api/register` | Filtrar `is_member == true` |

**Implementación:**
- Componente nuevo: `features/dashboard/pages/dashboard/dashboard.component.ts`
- Servicio reutiliza `KidsService` y `CheckinService` (si existe, o crear uno simple)
- Cards con el patrón KPI del style guide: `bg-white rounded-lg border border-gray-200 p-6`
- Gráfico de distribución por edades con **PrimeNG Chart** (Chart.js incluido) — dato calculado en frontend

**Backend:** ✅ No requiere cambios.

---

### 2.2 Vista de Check-ins del día (nuevo módulo)

**Ruta:** `/kids/checkins`
**Descripción:** Tabla en tiempo real de quién entró y quién ya salió en la sesión del día.

**Endpoints existentes a consumir:**
- `GET /api/checkinAndOut/index` — lista del día
- `PUT /api/checkinAndOut/checkout/:id` — registrar salida desde el admin

**Columnas de la tabla:**
- Nombre del niño
- Hora de entrada
- Hora de salida (o badge "En sala")
- Acción: botón "Registrar salida" si no tiene checkout

**Badges de estado** (ya definidos en el style guide):
```html
<!-- Presente sin salida -->
<span class="bg-amber-100 text-amber-700 ...">En sala</span>

<!-- Salida registrada -->
<span class="bg-emerald-100 text-emerald-700 ...">Completado</span>
```

**Backend:** ✅ No requiere cambios.

---

### 2.3 Sidebar rediseñado con estructura de CRM/ERP

El sidebar actual tiene un solo item funcional. Rediseñarlo para reflejar la visión completa de la plataforma, con módulos futuros en estado `disabled` o con badge "Próximamente".

**Estructura propuesta:**

```
PANEL PRINCIPAL
  └── Dashboard

MINISTERIO INFANTIL
  ├── Registro de niños       ← activo
  ├── Check-ins del día       ← activo (nuevo)
  └── Reportes                ← activo

MEMBRESÍA (próximamente)
  ├── Directorio de miembros  ← disabled
  └── Familias                ← disabled

EVENTOS (próximamente)
  └── Control de asistencia   ← disabled

VOLUNTARIOS (próximamente)
  └── Directorio              ← disabled

ADMINISTRACIÓN
  └── Configuración           ← pantalla vacía o coming soon
```

**Implementación en `sidebar.component.ts`:**
- Extender el tipo `MenuItem` para incluir `disabled?: boolean` y `badge?: string`
- Renderizar items deshabilitados con `opacity-50 cursor-not-allowed`
- Agregar sección separadora con label por grupo (ya existe el patrón `text-white/40 uppercase`)
- No requiere cambios en routing — los ítems disabled simplemente no navegan

**Backend:** ✅ No requiere cambios.

---

### 2.4 Página de detalle de niño mejorada

**Ruta:** `/kids/:id` (ya existe como `kids-information`)
**Mejoras sobre la vista actual:**

1. **Header de perfil** con avatar generado por iniciales (patrón del style guide)
2. **Timeline de check-ins** — consumir `GET /api/checkinAndOut/index/:register_id`
3. **Sección de contactos** — padres y personas autorizadas como cards, no como tabla plana
4. **Badges de alertas médicas** — si tiene alergia o condición médica, mostrar prominentemente en el header (no solo en un campo de texto)

**Backend:** ✅ No requiere cambios.

---

### 2.5 Módulo de Reportes como vista independiente

**Ruta:** `/kids/reportes`
**Descripción:** Centralizar todas las acciones de exportación en una sola pantalla.

**Funciones disponibles con el backend actual:**
- Exportar Excel por edad → `GET /api/reports/:age`
- Exportar PDF de lista completa → lógica en frontend con `jspdf` + `html2canvas` (ya instalado)
- Filtro por rango de fechas → lógica en frontend filtrando sobre `GET /api/register`

**Layouts sugerido:**
- Cards por acción de exportación (no botones sueltos)
- Selector de parámetros por card (edad, fechas)
- Estado de carga con `p-progressbar` mientras se genera

**Backend:** ✅ No requiere cambios.

---

### 2.6 Navbar mejorada con identidad de la iglesia

**Mejoras:**
1. Mostrar logo de Mundo de Fe (ya existe en `public/logotipo-mundodefe.png`)
2. Menú de usuario con nombre del admin logueado (extraído del JWT via `SessionService`)
3. Botón de cerrar sesión en el dropdown del avatar
4. Indicador de fecha y hora del último acceso

**Backend:** ✅ No requiere cambios — el JWT ya contiene el payload del usuario.

---

## 🟡 Prioridad 3 — Mejoras de calidad interna

### 3.1 Tipado estricto en servicios

`KidsService` y `SessionService` usan `any` extensivamente. Crear interfaces en `core/interfaces/`:
- `Kid` — con todos los campos que devuelve `GET /api/register`
- `CheckinRegister` — con campos de `GET /api/checkinAndOut`
- `SessionPayload` — estructura del JWT decodificado

### 3.2 AlertsService centralizado

Actualmente las alertas de SweetAlert2 están llamadas directamente en componentes. Extraer a `core/services/alerts.service.ts` (si no existe aún) con métodos:
- `confirm(message)` → retorna `Promise<boolean>`
- `success(message)` → void
- `error(message)` → void

### 3.3 Skeleton loaders en todas las listas

El componente `skeleton` ya existe en `shared/components/skeleton`. Usarlo consistentemente en todos los estados de carga, incluyendo la nueva vista de check-ins y el dashboard.

### 3.4 Estado vacío (Empty State) estandarizado

Cuando una tabla no tiene datos, mostrar un componente de estado vacío consistente:
```html
<div class="flex flex-col items-center gap-3 py-12 text-slate-400">
  <i class="pi pi-inbox text-4xl"></i>
  <p class="text-sm">No hay registros para mostrar</p>
</div>
```

---

## 🔵 Prioridad 4 — Módulos "Coming Soon" (placeholders reales)

Construir pantallas vacías para los módulos futuros. Esto cumple dos propósitos:
1. El panel se ve como un CRM completo desde ya
2. Las rutas y la estructura están listas para cuando el backend avance

**Módulos a crear como placeholder:**

| Módulo | Ruta | Descripción del placeholder |
|---|---|---|
| Membresía | `/members` | "Próximamente — Directorio de miembros" |
| Eventos | `/events` | "Próximamente — Control de asistencia a servicios" |
| Voluntarios | `/volunteers` | "Próximamente — Gestión de equipos de servicio" |
| Finanzas | `/finances` | "Próximamente — Registro de diezmos y ofrendas" |

**Componente `coming-soon` reutilizable:**
```
shared/components/coming-soon/coming-soon.component.ts
  - input: moduleName (string)
  - input: moduleIcon (string — clase pi)
  - input: moduleColor (string — clase tailwind)
  - Muestra el badge del módulo, un mensaje y la fecha estimada
```

---

## ¿Cuándo sí se necesita tocar el backend?

Solo en estos dos casos justificados:

### B1. Autenticación en endpoints (crítico)
Para que `AuthGuard` funcione correctamente, el backend debe proteger los endpoints con `authenticateJWT`. Actualmente el guard puede activarse en el frontend, pero los datos siguen siendo accesibles sin token desde cualquier cliente.

**Endpoints mínimos a proteger:**
- `GET /api/register` y `GET /api/register/:id`
- `GET /api/checkinAndOut/*`
- `GET /api/reports/:age`

**Endpoints que deben quedar públicos:**
- `POST /api/login`
- `POST /api/register` (registro de niños desde el formulario público)
- `GET /api/register/confirmation/:id`

**Estimado de trabajo backend:** 2–3 horas — solo agregar middleware en `routes.ts`.

### B2. Endpoint de Dashboard (deseable, no bloqueante)
Un endpoint `GET /api/dashboard/stats` que devuelva los conteos en una sola llamada en vez de 2–3 requests separados. Mejora performance del dashboard.

**Alternativa sin backend:** Hacer las 2–3 llamadas en paralelo con `forkJoin` en el `DashboardService` — funciona perfectamente para el volumen actual.

---

## Orden de implementación sugerido

| Fase | Tarea | Esfuerzo estimado | Backend |
|---|---|---|---|
| **0** | 1.1 Activar AuthGuard | 30 min | ❌ No (frontend) / ⚠️ Después agregar en backend |
| **0** | 1.2 Corregir imports de environment | 10 min | ❌ No |
| **0** | 1.3 Limpiar componentes residuales | 15 min | ❌ No |
| **1** | 2.3 Sidebar con estructura CRM | 2 h | ❌ No |
| **1** | 2.1 Dashboard con KPIs | 3 h | ❌ No |
| **1** | 2.6 Navbar con identidad | 1 h | ❌ No |
| **2** | 2.2 Vista check-ins del día | 2 h | ❌ No |
| **2** | 2.4 Detalle de niño mejorado | 2 h | ❌ No |
| **2** | 2.5 Módulo de reportes | 1.5 h | ❌ No |
| **3** | 3.1 Tipado estricto | 2 h | ❌ No |
| **3** | 3.2–3.4 Calidad interna | 1.5 h | ❌ No |
| **4** | 2.x Módulos coming soon | 2 h | ❌ No |
| **∞** | B1 Proteger endpoints backend | 2–3 h | ✅ Sí |

**Total estimado sin tocar backend: ~20 horas de desarrollo frontend.**

---

*Plan generado: Julio 2026 · KingdomKids Admin · Mundo de Fe Playa del Carmen*

