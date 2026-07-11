# Mejoras — Módulo de Niños Registrados

> Análisis basado en el código actual de `kids.component.ts`, `kids-information.component.ts`,
> `kids.service.ts`, `register.controller.ts` y `kids.query.ts`.
> Las mejoras están ordenadas por impacto real en el día a día operativo.

---

## 🔴 Crítico — Problemas que afectan hoy en producción

### 1. `kids.service.ts` importa el environment de desarrollo
```typescript
// ❌ Actual
import {environment} from "../../environments/environment.development";

// ✅ Correcto
import {environment} from "../../environments/environment";
```
En un build de producción, Angular resolverá el archivo correcto automáticamente.
Si esto no se corrige, el panel admin apuntará siempre a `localhost:8000` en producción.

**Archivo:** `src/app/services/kids.service.ts` — línea 2.

---

### 2. Datos del niño viajan en `localStorage` en base64 (no es seguro ni robusto)
```typescript
// ❌ Actual — cualquiera puede decodificar btoa()
localStorage.setItem(this.kidsService.kidToken, btoa(JSON.stringify(kid)));
```
- `btoa()` **no es cifrado**, solo codificación. Datos sensibles de menores (alergias, condiciones médicas) quedan expuestos en el navegador.
- Si el usuario recarga la página de detalle con una pestaña limpia, el dato puede estar desactualizado porque viene del listado cacheado, no de la API.

**Solución:** Navegar con el ID en la URL (`/kids/detail/:id`) y que el componente de detalle haga `GET /api/register/:id` directamente.

```typescript
// ✅ Propuesto
this.router.navigate(['/kids/detail', kid.id]);
```

---

### 3. Tipado `any` masivo en el componente y servicio
Todo el módulo usa `any` para los datos del niño:
```typescript
public kids: any;           // kids.component.ts
public kidInformation: any; // kids-information.component.ts
```
Sin una interfaz definida, TypeScript no puede detectar errores en tiempo de compilación.

**Solución:** Crear `src/app/interfaces/kid.interface.ts` con las entidades tipadas.

---

## 🟠 Alta — Funcionalidades faltantes clave

### 4. No existe página de edición del registro de un niño
El panel solo muestra información del niño (modo lectura). Si un padre cambia de teléfono, tiene alergia nueva, o hay un error en el registro, **no hay forma de corregirlo desde el admin**.

**Funcionalidad necesaria:**
- Formulario de edición para los campos del niño (nombre, apellido, cumpleaños, alergias, condiciones).
- Edición de datos de padres/tutores (teléfono, email).
- Edición de personas autorizadas (agregar, editar, eliminar).

**Endpoint requerido en backend:**
```
PUT /api/register/:id          → actualizar datos del niño
PUT /api/parents/:id           → actualizar datos del padre
DELETE /api/authorized/:id     → eliminar persona autorizada
```

---

### 5. No existe baja/desactivación de un registro
Si un niño deja de asistir o hubo un registro duplicado, no hay forma de desactivarlo.

**Solución:** Agregar campo `status` (`ACTIVE` / `INACTIVE`) al modelo `kids`.
- El listado filtra por `ACTIVE` por defecto.
- El admin puede cambiar el status desde el detalle del niño.
- Nunca borrar registros — solo desactivar (auditoría).

---

### 6. ~~El filtro de descarga Excel solo descarga por edad, no hay descarga general~~ ✅ COMPLETADO
~~Si quieres exportar **todos** los niños registrados, no es posible directamente.~~

**Implementado:**
- Opción "Todos" (`value: null`) agregada al selector de edades en `kids-ages.ts`.
- Nuevo método `getKidsAllReport()` en `kids.service.ts` apunta a `GET /api/reports/all`.
- `getExcelReport()` detecta `selectedAge === null` y llama al endpoint correcto.
- Nombre del archivo descriptivo: `KingdomKids-Todos-{unix}.xlsx` / `KingdomKids-8anios-{unix}.xlsx`.
- Backend: nuevo método `excelAll()` en `register.controller.ts` + ruta `/api/reports/all` registrada antes de `/api/reports/:age`.

---

### 7. ~~El buscador solo busca por nombre exacto en el backend (`finder`)~~ ✅ COMPLETADO (parcial — corto plazo)
```typescript
// kids.query.ts — busca coincidencia exacta
where: { name: name }
```
El buscador del panel admin usa `filterGlobal` de PrimeNG sobre los datos ya cargados en memoria. Funciona bien mientras haya pocos niños, pero con 500+ registros la tabla se vuelve lenta.

**Solución a corto plazo — ✅ IMPLEMENTADO:** `globalFilterFields` extendido en `kids.component.html`:
```typescript
[globalFilterFields]="['name', 'lastname', 'age', 'parents[0].full_name', 'parents[1].full_name', 'allergy_description', 'medical_condition_description']"
```

**Solución a mediano plazo — ⏳ PENDIENTE:** Paginación server-side + búsqueda en la API con `LIKE` en MySQL.

---

### 8. La vista de detalle del niño no muestra el historial de check-ins
La tabla de check-ins existe en el componente (`TableModule` importado) pero el histórico de asistencia del niño específico **no se consulta** desde la vista de detalle.

El endpoint ya existe: `GET /api/checkinAndOut/index/:register_id`

**Agregar en `kids-information`:**
- Sección de historial de check-ins del niño (fecha, hora de entrada, hora de salida, quién lo recogió).
- Contador de asistencias totales.
- Última asistencia registrada.

---

## 🟡 Media — Experiencia de usuario y calidad del código

### 9. El componente `kids.component.ts` usa `OnInit` con el patrón imperativo
El componente usa `OnInit` + `any` en lugar de las convenciones establecidas en el proyecto (signals):
```typescript
// ❌ Actual
public kids: any;
ngOnInit() { this.getKids(); }

// ✅ Propuesto con signals
public kids = signal<Kid[]>([]);
public allergyKids = computed(() => this.kids().filter(k => k.allergy));
public medicalKids = computed(() => this.kids().filter(k => k.medical_condition));
public mdfMembers = computed(() => this.kids().filter(k => k.mdf_member));
```
Con `computed()`, las tarjetas de estadísticas se actualizan automáticamente cuando cambia `kids`.

---

### 10. El PDF de credencial está hardcodeado con fechas del evento 2025
```typescript
// kids-information.component.ts — línea ~85
PDF.text('20 AL 24 DE JULIO', 52.5, 16, { align: 'center' });
```
Las fechas del evento están literales en el código. Si el campamento cambia de fecha o es otro año, hay que modificar el código fuente.

**Solución:** Mover las fechas y nombre del evento a constantes configurables en `environment.ts` o a un endpoint de configuración.

---

### 11. El `register.controller.ts` tiene 474 líneas — necesita separación de responsabilidades
La lógica de generación del Excel (300+ líneas solo de estilos de columnas) vive dentro del controller.

**Refactor sugerido:**
```
src/
  controllers/
    register.controller.ts     ← solo lógica HTTP (request/response)
  services/
    register.service.ts        ← orquestación del registro (QR, email, validaciones)
    excel.service.ts           ← generación de Excel (extraer generateExcel aquí)
```

---

### 12. ~~El Excel tiene un bug en personas autorizadas~~ ✅ COMPLETADO
```typescript
// register.controller.ts — excelByAge() y excelAll()
// ✅ Corregido — segunda persona autorizada ahora usa índice [1]
auth_person_two_name: element['authorized'][1]?.full_name,
auth_person_two_cellphone: element['authorized'][1]?.cellphone,
auth_person_two_relationship: element['authorized'][1]?.relationship
```

---

### 13. Las tarjetas de estadísticas no tienen loading state
Si la API tarda en responder, la tabla y las tarjetas muestran errores de renderizado (`kids.length` sobre `undefined`).

**Solución:** Agregar `isLoading = signal(true)` y mostrar un skeleton mientras cargan los datos.
El componente `skeleton` ya existe en `src/app/shared/components/skeleton/`.

---

### 14. La ruta de detalle es genérica (`/kids/detail`) — no es linkeable
Actualmente, si el admin copia la URL `/kids/detail` y la pega en otra pestaña, la página no carga porque el dato viene de `localStorage`.

**Solución:** Cambiar la ruta a `/kids/detail/:id` para que la URL sea bookmark-able y compartible internamente.

---

## 🔵 Mejoras de valor a mediano plazo

### 15. Foto de perfil del niño
Agregar campo `photo` al modelo `kids`. En el formulario de registro (register app) permitir tomar foto con la cámara del celular. Mostrarlo en la tarjeta de detalle y en el check-in para verificación visual.

### 16. ~~Insignias de alerta visual en la tabla~~ ✅ COMPLETADO
~~En lugar de solo texto "SI/NO", mostrar badges de colores diferenciados~~

**Implementado en `kids.component.html`:**
- 🔴 Alergia: badge rojo con ícono `pi-exclamation-triangle`
- 🟠 Condición médica: badge naranja con ícono `pi-heart`
- 🟢 Miembro MDF: badge verde con ícono `pi-check-circle` (columna nueva agregada a la tabla)

### 17. Notificación automática por email al registrar
El envío de email al padre está **comentado** en el controller:
```typescript
/*for (const parent of parents) {
    const sendEmail = await RegisterController.mailer.send({...});
}*/
```
Solo hay que descomentar, corregir el template `activation.hbs` y probar el flujo.

### 18. Estadísticas de crecimiento (gráfica)
Agregar al dashboard del módulo una gráfica de registros por semana/mes usando PrimeNG Chart (`p-chart`).
Requiere un endpoint `GET /api/reports/growth?period=monthly` en el backend.

---

## ✅ Resumen — Por dónde empezar

| # | Tarea | Impacto | Esfuerzo | Estado |
|---|-------|---------|----------|--------|
| 1 | Fix `environment.development` en `kids.service.ts` | 🔴 Crítico | 5 min | ⏳ Pendiente |
| 12 | Fix bug personas autorizadas en Excel | 🔴 Bug | 5 min | ✅ Completado |
| 6 | Opción "Todos" en selector de edad + reporte general | 🟠 Funcional | 2h | ✅ Completado |
| 7 | Búsqueda extendida (nombre del padre, condiciones) | 🟡 UX | 30 min | ✅ Completado (parcial) |
| 16 | Badges de colores en tabla (alergia, condición, MDF) | 🔵 Visual | 1h | ✅ Completado |
| 2 | Quitar datos de `localStorage`, navegar por ID | 🔴 Seguridad | 2h | ⏳ Pendiente |
| 3 | Crear interfaz `Kid` tipada | 🟠 Calidad | 1h | ⏳ Pendiente |
| 4 | CRUD edición de registro del niño | 🟠 Funcional | 1–2 días | ⏳ Pendiente |
| 8 | Historial de check-ins en detalle del niño | 🟠 Funcional | 3h | ⏳ Pendiente |
| 5 | Desactivación de registros (status) | 🟠 Operativo | 4h | ⏳ Pendiente |
| 9 | Refactor a signals en `kids.component.ts` | 🟡 Calidad | 2h | ⏳ Pendiente |
| 11 | Separar `register.controller.ts` en servicios | 🟡 Calidad | 4h | ⏳ Pendiente |
| 13 | Loading state con skeleton en tarjetas | 🟡 UX | 1h | ⏳ Pendiente |
| 14 | Ruta `/kids/detail/:id` linkeable | 🟡 UX | 1h | ⏳ Pendiente |
| 17 | Activar envío de email al registrar | 🟡 UX | 2h | ⏳ Pendiente |

---

*Documento generado: Julio 2026 — KingdomKids para Mundo de Fe Playa del Carmen*

