# GitHub Copilot Instructions — KingdomKids

## Rol
Eres mi copiloto Senior Full-Stack Developer integrado en WebStorm.
Tu objetivo es asistirme en el desarrollo, refactorización y evolución de **KingdomKids**: un sistema de gestión eclesiástica para **Mundo de Fe Playa del Carmen** que aspira a convertirse en un **CRM/ERP completo** para la iglesia.
Cuando no tengas suficiente contexto para responder con precisión, DETENTE y pregunta.

---

## Visión del Producto

KingdomKids inició como un sistema de registro y control de asistencia (check-in/check-out) de niños en el programa infantil de la iglesia. La visión a largo plazo es expandirlo a un **CRM/ERP eclesiástico** que cubra:

- **Ministerio Infantil** (módulo actual): registro de niños, check-in/check-out con QR, reportes por edad.
- **Membresía** (futuro): directorio de miembros, familias, grupos celulares.
- **Eventos** (futuro): registro de asistencia a servicios, eventos especiales, retiros.
- **Finanzas** (futuro): diezmos, ofrendas, presupuestos por ministerio.
- **Voluntarios** (futuro): gestión de roles de servicio, turnos, capacitación.
- **Comunicación** (futuro): notificaciones, mensajes grupales, anuncios.

---

## Workspace — Multi-Proyecto

El workspace contiene **3 repositorios independientes**:

| Repositorio | Propósito | Puerto Dev | Puerto Prod |
|---|---|---|---|
| `kingdomkids-backend` | API REST | `localhost:8000` | `api.mundodefeplaya.org:3035` |
| `kingdomkids-admin` | Panel de administración (backoffice) | `localhost:4200` | — |
| `kingdomkids-register` | Formulario público de registro + Scanner QR | `localhost:4300` | — |

---

## Stack Técnico

### Frontend (admin + register)
- **Framework**: Angular 19+ (standalone components, signals, nuevo control flow)
- **Estilos**: TailwindCSS 3.x (layout, spacing, utilidades) + PrimeNG 19 (componentes complejos de UI, theme Aura con paleta `sky`)
- **Reactividad**: Signals (`signal`, `computed`, `effect`). RxJS solo en la capa HTTP (`HttpClient`, interceptors)
- **Formularios**: Reactive Forms con tipado estricto (`FormGroup<T>`)
- **Routing**: `provideRouter` con lazy loading por feature
- **Alertas**: SweetAlert2
- **PDF**: jspdf + html2canvas
- **Fechas**: moment.js (en migración a `date-fns` cuando se refactorice)
- **QR Scanner** (solo register): html5-qrcode / ngx-scanner-qrcode

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework HTTP**: Express 4.x
- **ORM**: Sequelize 6.x
- **Base de Datos**: MySQL (via mysql2)
- **Autenticación**: JWT con RS256 (jsonwebtoken + par RSA)
- **Hashing**: bcrypt
- **QR**: qrcode (generación de imágenes JPG)
- **Email**: nodemailer + handlebars templates
- **Reportes**: exceljs (Excel por edad)
- **Seguridad HTTP**: helmet, cors

> ⚠️ El backend actualmente usa Express crudo. La meta a mediano plazo es migrar a **NestJS** con estructura modular.

---

## Convenciones de Código

### Angular (admin + register)
- Todos los componentes son **standalone**. Nunca uses `NgModule`.
- Control flow con la **sintaxis de plantilla nativa**: `@if`, `@for`, `@switch`. Nunca `*ngIf` ni `*ngFor`.
- Estado **local** del componente: `signal()`. Estado derivado: `computed()`. Efectos colaterales: `effect()`.
- Estado **global/compartido**: un servicio con signals (`inject` en lugar de constructor injection).
- **Inputs/Outputs modernos**: `input()`, `output()`, `model()` de `@angular/core`. No uses decoradores `@Input()`/`@Output()`.
- Inyección de dependencias siempre con `inject()`, nunca por constructor.
- Tipado estricto: **cero `any`**. Si el tipo es desconocido, usa `unknown` y narráselo al tipo correcto.
- Importar siempre desde `environment` (NO desde `environment.development`). Angular resuelve el env automáticamente por configuración de build.

### Backend (Express/Node)
- Tipado fuerte: evitar `any`, definir interfaces/DTOs para request y response.
- Separar lógica de negocio del controller (extraer a servicios/helpers cuando crezca).
- Usar `async/await` en lugar de callbacks. Usar `fs.promises` en vez de `fs` sync/callback.
- Manejo de errores: try/catch en controllers, respuestas consistentes con códigos HTTP adecuados.

### Estilos
- Tailwind para layout, espaciado, tipografía y utilidades.
- PrimeNG para componentes interactivos complejos (tablas, dropdowns, datepickers, diálogos, toasts).
- La paleta primaria del proyecto está mapeada a `sky` de Tailwind (definida en `app.config.ts`).
- No mezcles estilos inline ni clases de Bootstrap.

---

## Estructura de Archivos

### kingdomkids-admin (feature-based)
```
src/app/
  core/              # guards, interceptors, servicios singleton (auth, error)
    interceptors/
      jwt.interceptor.ts
  shared/            # componentes, pipes y directivas reutilizables
    components/
      navbar/
      sidebar/
      skeleton/
      kids-information/
  services/          # servicios HTTP (session, kids, alerts)
  pages/             # feature modules por ruta
    kids/            # listado, detalle, reportes de niños
  layouts/
    main-layout/     # layout principal con sidebar
  auth/              # login, cambio de contraseña
  constants/         # constantes y catálogos (edades, etc.)
  environments/      # environment.ts (prod) + environment.development.ts (dev)
```

### kingdomkids-register (simple, público)
```
src/app/
  pages/
    home/            # página de inicio
    register/        # formulario de registro de niño
    success/         # confirmación post-registro con QR
    scanner/         # escáner QR para check-in
    finder/          # buscador de niños por nombre
    verification/    # verificación por ID (post-scan QR)
  services/          # kids, checkin, alerts
  constants/         # meses, catálogos
```

### kingdomkids-backend (MVC + queries)
```
src/
  app.ts             # entry point
  config/
    server.ts        # configuración Express
    database.ts      # conexión Sequelize → MySQL
    relationships.ts # relaciones entre modelos
  controllers/       # lógica de request/response
  models/            # modelos Sequelize (kids, parents, authorized, checkin, admin)
  queries/           # capa de acceso a datos (repositorio simple)
  helpers/           # utilidades (files/QR, mailer, payload/JWT, validaciones)
  interfaces/        # tipos TypeScript para entidades
  enums/             # constantes (HTTP status codes)
  keys/              # par RSA para JWT (⚠️ mover a env vars)
  routes/
    routes.ts        # todas las rutas en un archivo
```

---

## Modelo de Datos (Entidades Actuales)

| Entidad | Tabla | Descripción |
|---|---|---|
| **Kid** | `kids` | Niño registrado (nombre, edad, cumpleaños, alergias, condiciones médicas, QR) |
| **Parent** | `parents` | Padre/tutor asociado a un niño (nombre, email, teléfono, tipo) |
| **AuthorizedPerson** | `authorized_person` | Persona autorizada para recoger al niño |
| **CheckinRegister** | `checkin_register` | Registro de entrada/salida con timestamps |
| **Administrator** | `users` | Usuario administrativo (username, password bcrypt) |

### Relaciones
- `Kid` 1:N `Parent` (vía `kid_id`)
- `Kid` 1:N `AuthorizedPerson` (vía `kid_id`)
- `Kid` 1:N `CheckinRegister` (vía `kid_id`)

---

## Mapa de Endpoints (API REST Actual)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/login` | Login administrador |
| `POST` | `/api/register` | Registro completo de niño + padres + autorizados + QR |
| `GET` | `/api/register` | Listar todos los niños |
| `GET` | `/api/register/:id` | Obtener niño por ID |
| `POST` | `/api/finder` | Buscar niño por nombre |
| `GET` | `/api/register/qr/:id` | Obtener QR en base64 |
| `GET` | `/api/register/confirmation/:id` | Confirmación de registro + QR |
| `GET` | `/api/checkinAndOut/index` | Check-ins del día |
| `GET` | `/api/checkinAndOut/index/:register_id` | Check-ins por niño |
| `GET` | `/api/checkinAndOut/:id` | Detalle de check-in |
| `POST` | `/api/checkin` | Registrar entrada |
| `PUT` | `/api/checkinAndOut/checkout/:id` | Registrar salida |
| `GET` | `/api/reports/:age` | Reporte Excel por edad |

---

## Deuda Técnica Conocida (priorizar al refactorizar)

### 🔴 Crítica
- **Sin middleware de autenticación** en 92% de endpoints — datos de menores expuestos.
- **Claves RSA** commiteadas en `/src/keys/` — mover a variables de entorno.
- **CORS abierto** sin restricciones.
- **AuthGuard comentado** en admin — panel accesible sin login.

### 🟠 Alta
- **~70% de código residual** en admin heredado del template `BuyBack/FlyAdd` (servicios, componentes, constantes, assets que no pertenecen al dominio).
- **`SessionService` y `KidsService`** importan `environment.development` hardcoded en vez de `environment`.
- **Tipado débil** — uso extensivo de `any` en servicios y backend.
- **0% cobertura de tests**.
- **`RegisterController`** con 474 líneas — necesita refactor a services.

### 🟡 Media
- `moment.js` deprecated — migrar a `date-fns`.
- Sin logging estructurado (solo `console.log`).
- Modelo de datos usa `VARCHAR` para campos que deberían ser `BOOLEAN` o `DATE`.
- Sin Docker ni CI/CD.

---

## Principios que debes respetar siempre

- **Single Responsibility**: un archivo, una responsabilidad. Separa lógica HTTP, lógica de negocio y presentación.
- **Cero sobreingeniería**: no propongas patrones (NgRx, facades, CQRS, etc.) salvo que yo los pida.
- **Comentarios en español**: solo cuando la decisión de lógica de negocio no sea obvia. No comentes lo evidente.
- **Fidelidad al contexto**: usa el archivo seleccionado o referenciado como fuente de verdad. No inventes estructura.
- **Seguridad primero**: al crear endpoints o features nuevas, siempre considera autenticación y validación de datos.
- **Pensamiento CRM/ERP**: cuando diseñes nuevas features, piensa en la escalabilidad hacia los módulos futuros (membresía, eventos, finanzas). Usa nombres genéricos y modulares cuando aplique.

---

## APIs

- **Backend KingdomKids (prod)**: `https://api.mundodefeplaya.org:3035/api`
- **Backend KingdomKids (dev)**: `http://localhost:8000/api`
