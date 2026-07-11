# Recomendaciones para KingdomKids CRM/ERP — Mundo de Fe Playa del Carmen

> Documento de hoja de ruta estratégica. Prioridades ordenadas por impacto y viabilidad técnica.

---

## 🔴 Prioridad Crítica — Antes de cualquier nueva feature

Estas correcciones son **requisito bloqueante** para considerar el sistema "profesional". Afectan la seguridad de datos de menores.

### 1. Autenticación en todos los endpoints
- Agregar middleware `authenticateJWT` a **todos** los endpoints que exponen datos de niños.
- Separar rutas públicas (registro, confirmación QR) de rutas protegidas (admin, reportes).
- Implementar roles: `ADMIN`, `VOLUNTEER` (solo check-in/out), `VIEWER` (solo lectura).

### 2. Variables de entorno para secretos
- Mover las claves RSA de `/src/keys/` a variables de entorno (`process.env.JWT_PRIVATE_KEY`).
- Usar un archivo `.env` con `dotenv` y documentar `.env.example` en el repositorio.
- Nunca commitear secretos — agregar `/src/keys/` y `.env` al `.gitignore`.

### 3. CORS restrictivo
- Definir lista blanca de orígenes permitidos (dominios de admin y register).
- Bloquear cualquier otro origen en producción.

### 4. Activar AuthGuard en el panel admin
- Descomentar y refactorizar el guard existente.
- Proteger todas las rutas del panel excepto `/login`.

---

## 🟠 Prioridad Alta — Fundamentos del CRM/ERP

### 5. Módulo de Membresía (Personas)
El corazón de cualquier CRM eclesiástico. Sin esto, los demás módulos no tienen contexto.

**Entidades sugeridas:**
- `Member` — nombre completo, foto, fecha de nacimiento, género, estado civil, fecha de bautismo, fecha de conversión.
- `Family` — agrupa miembros en unidades familiares (útil para relacionar padres con hijos ya registrados en KingdomKids).
- `CellGroup` — grupo celular al que pertenece el miembro, con líder asignado.
- `MemberStatus` — `ACTIVE`, `INACTIVE`, `VISITOR`, `NEW_CONVERT`.

**Relación con módulo infantil:** vincular `Kid.parents` con `Member` para evitar duplicación de datos.

### 6. Control de Asistencia General (Servicios y Eventos)
Ampliar el modelo de check-in más allá de niños.

- Registrar asistencia a servicios dominicales, grupos celulares, eventos especiales.
- Vincular asistencia con `Member` para generar estadísticas de participación.
- Dashboard con métricas: promedio de asistencia semanal, tendencia mensual, nuevos visitantes.

### 7. Gestión de Voluntarios
- Catálogo de ministerios/departamentos (infantil, alabanza, ujieres, etc.).
- Asignación de voluntarios a ministerios con rol y fecha de inicio.
- Registro de turnos por servicio (quién sirvió, en qué ministerio, en qué fecha).
- Historial de servicio por persona.

### 8. Refactor de Backend a NestJS (Módulos)
Antes de agregar más features, la migración a NestJS facilitará enormemente la escalabilidad.

**Estructura modular sugerida:**
```
src/
  auth/
  kids/
  members/
  families/
  cell-groups/
  events/
  attendance/
  volunteers/
  finances/
  notifications/
  reports/
```

---

## 🟡 Prioridad Media — Funcionalidades de Valor

### 9. Módulo de Finanzas (Diezmos y Ofrendas)
- Registro de contribuciones: diezmo, ofrenda, ofrenda especial, misiones.
- Vinculado al `Member` para historial por persona.
- Reportes mensuales, anuales y por tipo de contribución.
- Generación de **recibo/comprobante PDF** para el contribuyente.
- ⚠️ Requiere cifrado adicional y control de acceso estricto (rol `FINANCE`).

### 10. Módulo de Comunicación
- Envío de notificaciones a grupos (por ministerio, por célula, a todos los miembros).
- Integración con **WhatsApp Business API** (Twilio o Meta directamente) — canal principal en México.
- Integración con email (ya tienen nodemailer — ampliar templates).
- Anuncios internos con fecha de expiración.

### 11. Dashboard Ejecutivo
Panel principal para pastores/líderes con KPIs en tiempo real:

| Métrica | Descripción |
|---|---|
| Asistencia total del domingo | Adultos + niños |
| Nuevos visitantes del mes | Miembros con status `VISITOR` |
| Tasa de retención | % visitantes que regresan |
| Niños registrados activos | Con check-in en últimas 4 semanas |
| Voluntarios activos | Sirvieron en el último mes |
| Total de células activas | Con reunión en los últimos 15 días |

### 12. Seguimiento Pastoral (CRM Core)
- **Pipeline de integración**: Visitante → Nuevo Convertido → En Discipulado → Miembro Activo.
- Registro de interacciones pastorales (visitas, llamadas, oraciones).
- Alertas automáticas cuando un miembro lleva N semanas sin asistir.
- Asignación de miembro a un pastor/líder de seguimiento.

---

## 🔵 Prioridad Baja — Madurez del Sistema

### 13. Aplicación Móvil (PWA primero)
- Convertir `kingdomkids-register` en una **PWA** con capacidad offline para el escáner QR.
- Considerar una app React Native / Flutter a futuro para voluntarios.

### 14. Multi-tenencia (Multi-iglesia)
Si la visión es vender/licenciar el sistema a otras iglesias:
- Agregar campo `church_id` / `tenant_id` a todas las entidades.
- Subdominio por iglesia: `iglesia.kingdomkids.app`.
- Panel super-admin para gestión de tenants.

### 15. API Pública y Webhooks
- Documentar la API con **Swagger/OpenAPI** (`@nestjs/swagger` cuando migren a NestJS).
- Webhooks para integraciones externas (sistemas de contabilidad, Planning Center, etc.).

### 16. Auditoría y Logs
- Tabla `audit_log` que registre quién hizo qué y cuándo en cada entidad sensible.
- Logging estructurado con **Winston** o **Pino** (reemplazar `console.log`).
- Monitoreo de errores con **Sentry**.

---

## 🛠️ Infraestructura y DevOps Recomendada

### 17. Containerización
```yaml
# docker-compose.yml sugerido
services:
  api:        # kingdomkids-backend (Node/NestJS)
  admin:      # kingdomkids-admin (Angular SSR o Nginx)
  register:   # kingdomkids-register (Angular + Nginx)
  db:         # MySQL 8
  redis:      # Cache de sesiones y rate limiting
```

### 18. CI/CD
- **GitHub Actions** para lint + build + tests en cada PR.
- Deploy automático a producción en merge a `main`.
- Separar ambientes: `development`, `staging`, `production`.

### 19. Backups Automáticos
- Backup diario de la base de datos MySQL a un bucket (S3 / Cloudflare R2).
- Retención mínima de 30 días.

### 20. Rate Limiting y Protección
- `express-rate-limit` en el backend para prevenir abuso.
- Protección contra bots en el formulario de registro público.
- HTTPS forzado en todos los endpoints.

---

## 📐 Arquitectura de Datos Recomendada (Largo Plazo)

```
┌─────────────────────────────────────────┐
│              PERSONAS                   │
│  Member ──── Family ──── CellGroup      │
│     │                                   │
│     └──── Kid (ministerio infantil)     │
└─────────────────────────────────────────┘
         │              │
┌────────┴──────┐  ┌────┴────────────────┐
│  PARTICIPACIÓN │  │    SERVICIO         │
│  Attendance    │  │    Volunteer        │
│  CheckinReg    │  │    Ministry         │
└───────────────┘  └─────────────────────┘
         │
┌────────┴──────────────────────────────┐
│           FINANZAS                    │
│  Contribution ──── ContributionType   │
└───────────────────────────────────────┘
```

---

## ✅ Orden de Implementación Sugerido

| Fase | Items | Duración estimada |
|------|-------|-------------------|
| **0 — Seguridad** | #1, #2, #3, #4 | 1–2 semanas |
| **1 — Fundamentos** | #5 (Membresía), #8 (NestJS) | 4–6 semanas |
| **2 — Asistencia** | #6 (Eventos), #11 (Dashboard) | 3–4 semanas |
| **3 — Comunidad** | #7 (Voluntarios), #12 (Seguimiento) | 4–5 semanas |
| **4 — Finanzas** | #9, con auditoría #16 | 3–4 semanas |
| **5 — Comunicación** | #10 (WhatsApp/Email) | 2–3 semanas |
| **6 — Infraestructura** | #17, #18, #19, #20 | 1–2 semanas |
| **7 — Escala** | #14 (Multi-tenencia), #15 (API pública) | 6–8 semanas |

---

*Documento generado: Julio 2026 — KingdomKids para Mundo de Fe Playa del Carmen*

