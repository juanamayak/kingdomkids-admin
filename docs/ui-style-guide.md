# UI Style Guide — KingdomKids CRM/ERP · Mundo de Fe Playa del Carmen

> **Stack:** Angular 19+ · TailwindCSS 3 · PrimeNG 19 (Aura + `sky`)
> **Contexto:** CRM/ERP eclesiástico — Ministerio Infantil (actual) → expansión a Membresía, Eventos, Finanzas, Voluntarios
> **Versión:** 2.0

Este archivo define los estándares de UI del proyecto. Está pensado para ser leído por **GitHub Copilot** como contexto de proyecto.

---

## Principio rector

> Cada decisión visual debe poder justificarse con:
> **¿esto ayuda al líder o administrador de la iglesia a encontrar o actuar sobre la información más rápido?**
> Si la respuesta no es clara, la decisión no va.

El usuario objetivo es un líder ministerial, coordinador o administrador de la iglesia que puede no tener perfil técnico. La claridad, la legibilidad y la accesibilidad no son preferencias estéticas — son requisitos funcionales.

---

## 01 — Identidad Visual (Propuesta Genérica)

> ⚠️ La iglesia Mundo de Fe Playa del Carmen **no tiene identidad visual formal definida** aún.
> Esta paleta es una propuesta genérica funcional para el CRM/ERP. Debe reemplazarse por la identidad oficial cuando esté disponible.

### Paleta propuesta

La paleta parte del `sky` ya configurado en `app.config.ts` (PrimeNG Aura). Se complementa con un acento cálido (ámbar/dorado) que evoca comunidad, luz y fe — sin caer en lo religioso-kitsch.

| Rol | Token Tailwind / Hex | Valor | Uso |
|---|---|---|---|
| **Primary** | `sky-600` | `#0284c7` | Botones primarios, links activos, indicadores de progreso |
| **Primary Hover** | `sky-700` | `#0369a1` | Estado hover de primary |
| **Primary Light** | `sky-50` | `#f0f9ff` | Fondos de badges, row highlights |
| **Sidebar** | `sky-950` | `#082f49` | Fondo del sidebar de navegación |
| **Accent** | `amber-500` | `#f59e0b` | KPIs destacados, badges de estado especial, iconos de alerta |
| **Accent Hover** | `amber-600` | `#d97706` | Estado hover del acento |
| **Success** | `emerald-600` | `#059669` | Check-in exitoso, estados activos, badges "Presente" |
| **Warning** | `amber-400` | `#fbbf24` | Alertas no críticas, campos con atención requerida |
| **Danger** | `red-600` | `#dc2626` | Errores, eliminación, estados críticos |
| **Neutral base** | `slate-700` | `#334155` | Texto principal |
| **Neutral muted** | `slate-400` | `#94a3b8` | Texto secundario, placeholders |
| **Surface** | `gray-50` | `#f8fafc` | Fondo de página |
| **Card** | `white` | `#ffffff` | Fondo de tarjetas y paneles |

### Configuración actual en `app.config.ts`

PrimeNG ya está configurado con el preset `Aura` mapeado a la escala `sky`. No modificar esta configuración sin coordinación del equipo.

```typescript
// app.config.ts — configuración vigente
providePrimeNG({
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: {
          50: '{sky.50}',
          // ... hasta sky.950
        },
        colorScheme: {
          light: {
            primary: {
              color: '{sky.600}',
              hoverColor: '{sky.700}',
            }
          }
        }
      }
    })
  }
})
```

### Uso en templates Angular

```html
<!-- ✅ Correcto — clases semánticas de Tailwind -->
<nav class="bg-sky-950 text-white">...</nav>
<button class="bg-sky-600 hover:bg-sky-700 text-white">Guardar</button>
<span class="bg-emerald-100 text-emerald-700">Presente</span>

<!-- ❌ Incorrecto — valor hex hardcodeado -->
<nav class="bg-[#082f49]">...</nav>
<button style="background: #0284c7">Guardar</button>
```

> Cuando la identidad oficial de Mundo de Fe esté definida, se actualizarán únicamente los tokens de color — el resto de la guía permanece igual.

---

## 02 — Módulos del CRM/ERP y su Contexto Visual

Cada módulo futuro tiene una identidad cromática secundaria para diferenciación visual en la navegación y badges. El color **primario (`sky`)** es compartido por toda la aplicación.

| Módulo | Estado | Color identificador | Badge ejemplo |
|---|---|---|---|
| **Ministerio Infantil** | ✅ Activo | `sky-600` | `bg-sky-100 text-sky-700` |
| **Membresía** | 🔜 Futuro | `violet-600` | `bg-violet-100 text-violet-700` |
| **Eventos** | 🔜 Futuro | `emerald-600` | `bg-emerald-100 text-emerald-700` |
| **Finanzas** | 🔜 Futuro | `amber-600` | `bg-amber-100 text-amber-700` |
| **Voluntarios** | 🔜 Futuro | `orange-600` | `bg-orange-100 text-orange-700` |
| **Comunicación** | 🔜 Futuro | `indigo-600` | `bg-indigo-100 text-indigo-700` |

---

## 03 — Tipografía y Densidad

**Fuente:** Inter (configurada en `tailwind.config.js` como `font-sans`).

### Escala tipográfica permitida

| Clase | Tamaño | Uso |
|---|---|---|
| `text-xl` | 20px | Solo h1 de la vista — nunca en componentes internos |
| `text-lg` | 18px | Subtítulos de sección, encabezados de cards |
| `text-base` | 16px | Texto de formularios y etiquetas principales |
| `text-sm` | 14px | Celdas de tabla, texto secundario — la más usada en el sistema |

> ❌ No usar `text-2xl` o superior en componentes de tabla o formulario
> ❌ No usar `text-xs` en celdas — ilegible para usuarios en uso prolongado

### Pesos tipográficos

| Clase | Uso |
|---|---|
| `font-bold` | **Solo** cifras clave: totales de asistencia, conteos de miembros, KPIs |
| `font-semibold` | Nombres propios en listas, encabezados de sección |
| `font-medium` | Etiquetas de formulario, estados activos, navegación activa |
| `font-normal` | Todo el texto de contenido estándar |

### Reglas de densidad

```html
<!-- Celdas de tabla -->
<td class="py-3 px-4 text-sm text-slate-700">García López, Juan</td>

<!-- Inputs -->
<input class="py-2.5 px-4 text-sm rounded-md" />

<!-- Espaciado entre campos de formulario -->
<form class="flex flex-col gap-6">...</form>

<!-- Separación entre secciones de vista -->
<div class="flex flex-col gap-8">...</div>
```

> ✅ Color de texto base: `text-slate-700` — **nunca** `text-black`
> ✅ Máximo 4 niveles de jerarquía visual en una sola vista

---

## 04 — Componentes PrimeNG

### Regla principal

Antes de crear cualquier componente personalizado, verificar que PrimeNG no lo tenga. Ver: `primeng.org/components`

### Reglas de theming

- Tema base: `Aura` con paleta `sky` (configurado en `app.config.ts`)
- Todos los overrides van **exclusivamente** en `src/styles/primeng-overrides.scss`
- `::ng-deep` solo con `ViewEncapsulation.None` documentado en comentario
- No instalar librerías de UI adicionales sin coordinación del equipo

### Override correcto

```scss
/* src/styles/primeng-overrides.scss */

/* Override justificado: alinear altura con formularios del CRM */
.p-inputtext {
  height: 2.5rem;
  border-radius: 0.375rem; /* rounded-md */
}
```

---

## 05 — Spacing, Radii y Botones

### Escala de padding — tokens permitidos

La unidad base es 4px. Solo se usan los siguientes valores:

| Token Tailwind | Valor | Uso principal |
|---|---|---|
| `p-1` / `gap-1` | 4px | Badges, chips, separaciones internas mínimas |
| `p-2` / `gap-2` | 8px | Padding interno de inputs pequeños, iconos |
| `p-3` / `gap-3` | 12px | Padding de celdas de tabla — mínimo recomendado |
| `p-4` / `gap-4` | 16px | Padding estándar de inputs, botones, cards pequeñas |
| `p-5` / `gap-5` | 20px | Padding de secciones de formulario |
| `p-6` / `gap-6` | 24px | Padding de tarjetas (cards), espaciado entre campos |
| `p-8` / `gap-8` | 32px | Separación entre secciones mayores de una vista |
| `p-12` / `gap-12` | 48px | Padding de contenedores de página, zonas vacías |

> ❌ No usar valores arbitrarios: `p-[13px]`, `p-[22px]`, etc.

### Escala de border-radius

`rounded-3xl` (24px) es el **máximo permitido**. A mayor tamaño de elemento, mayor radio permitido.

| Token | Valor | Uso |
|---|---|---|
| `rounded` | 4px | Badges, chips, tags inline |
| `rounded-md` | 6px | Inputs, selects, botones — estándar de elementos interactivos |
| `rounded-lg` | 8px | Cards de datos, paneles, dropdowns — **el más usado** |
| `rounded-xl` | 12px | Modales, sidebars flotantes, widgets KPI |
| `rounded-2xl` | 16px | Contenedores de sección prominentes, banners de estado |
| `rounded-3xl` | 24px | **Máximo.** Solo elementos de presentación: login, splash |

### Jerarquía de botones

#### Primario — una sola acción principal por vista

```html
<button class="
  bg-sky-600 hover:bg-sky-700
  text-white font-medium text-sm
  px-4 py-2 rounded-md
  transition-colors duration-150
  disabled:opacity-45 disabled:cursor-not-allowed
">
  Registrar niño
</button>
```

#### Secundario — acciones de apoyo

```html
<button class="
  bg-white hover:bg-gray-50
  text-slate-700 font-medium text-sm
  border border-gray-200 hover:border-gray-300
  px-4 py-2 rounded-md
  transition-colors duration-150
">
  Cancelar
</button>
```

#### Destructivo — eliminación o acción irreversible

```html
<!-- Filled: acción confirmada -->
<button class="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-4 py-2 rounded-md">
  Eliminar registro
</button>

<!-- Outline: paso previo a confirmación -->
<button class="border border-red-300 text-red-600 hover:bg-red-50 font-medium text-sm px-4 py-2 rounded-md">
  Eliminar registro
</button>
```

#### Ghost / Icono — acciones inline o en tablas

```html
<!-- Ghost texto -->
<button class="text-sky-600 hover:underline text-sm font-medium bg-transparent border-none">
  Ver detalle →
</button>

<!-- Icon button en tabla -->
<button class="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-gray-100">
  <svg>...</svg>
</button>
```

### Reglas de botones

| Regla | Detalle |
|---|---|
| Un solo primario por vista | Si hay dos acciones igual de importantes, revisar el flujo |
| Tamaño estándar | `px-4 py-2` con `text-sm font-medium` |
| Border-radius fijo | `rounded-md` para todos los botones de acción |
| Sin shadow en botones | No usar `shadow-md` — genera jerarquía falsa |
| Estados requeridos | Todo botón: `hover:`, `disabled:opacity-45`, `disabled:cursor-not-allowed` |
| Estado loading | Deshabilitar y mostrar spinner/texto durante el submit |

---

## 06 — Glassmorphism

### Criterio técnico para decidir

> ¿El efecto ayuda a distinguir una capa de información de otra **sin distraer** al usuario?
> Si sí → puede aplicarse en los contextos permitidos.

### Valores técnicos permitidos

| Propiedad | ✅ Permitido | ❌ Prohibido |
|---|---|---|
| `backdrop-blur` | `blur-sm` (4px máx.) | `blur-md`, `blur-lg`, `blur-xl` |
| Opacidad de fondo | `bg-white/80` o `bg-white/90` | `bg-white/40` o menos |
| Color de borde | `border-white/20` | Bordes de colores vibrantes |
| Máx. por vista | 3 componentes glass | Sin límite |

### Contextos donde aplica

| Contexto | Decisión |
|---|---|
| Widget KPI en dashboard | ✅ Sí — máx. 3 por vista |
| Modal de confirmación sobre fondo oscuro | ✅ Sí |
| Panel lateral de filtros | ✅ Sí |
| Tabla de datos o listado | ❌ Nunca |
| Formulario de captura | ❌ Nunca |
| Más de 1 capa de blur apilada | ❌ Nunca |

```html
<!-- ✅ Correcto: glass sutil en widget KPI de asistencia -->
<div class="bg-white/85 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm p-6">
  <!-- KPI: Niños registrados hoy -->
</div>
```

---

## 07 — Patrones de UI por Contexto

### Check-in / Check-out (Ministerio Infantil)

```html
<!-- Estado: Presente -->
<span class="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded">
  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
  Presente
</span>

<!-- Estado: Pendiente checkout -->
<span class="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1 rounded">
  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
  En sala
</span>

<!-- Estado: No asistió -->
<span class="inline-flex items-center gap-1.5 bg-gray-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded">
  <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
  Ausente
</span>
```

### Cards de niño / miembro

```html
<div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
  <div class="flex items-center gap-3">
    <!-- Avatar con inicial -->
    <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold text-sm">
      JG
    </div>
    <div>
      <p class="text-sm font-medium text-slate-700">Juan García</p>
      <p class="text-xs text-slate-400">4 años · Grupo Semillitas</p>
    </div>
  </div>
</div>
```

### KPI / Estadística

```html
<div class="bg-white rounded-lg border border-gray-200 p-6">
  <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Asistencia hoy</p>
  <p class="text-2xl font-bold text-slate-700 mt-1">24</p>
  <p class="text-xs text-emerald-600 mt-1">↑ 3 más que el domingo pasado</p>
</div>
```

---

## 08 — Dark Mode

> **Estado actual:** El dark mode está **desactivado** en `app.config.ts` (`darkModeSelector: 'light'`). Esta sección define los estándares para cuando se implemente.

### Principio

Dark mode no es inversión de colores — es una paleta diseñada para minimizar fatiga visual en sesiones prolongadas.

### Escala de superficies oscuras

| Token CSS | Hex | Uso |
|---|---|---|
| `--bg` | `#0a0a0f` | Fondo base de la página |
| `--bg-card` | `#111118` | Cards, paneles, sidebar |
| `--bg-subtle` | `#16161f` | Hover states, headers de tabla |
| `--bg-hover` | `#1a1a26` | Estado hover de filas, items de nav |

> ❌ No usar `#000000` ni `bg-black` como fondo
> ❌ No usar `#ffffff` ni `text-white` como texto base

### Escala de texto en dark mode

| Token CSS | Valor | Uso |
|---|---|---|
| `--text-primary` | `#f0f0f5` | Títulos, valores clave |
| `--text-secondary` | `#8a8aa0` | Cuerpo de texto, labels |
| `--text-muted` | `#55556a` | Placeholders, metadatos |

### Implementación futura

```typescript
// theme.service.ts
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme = signal<'light' | 'dark'>('light');

  setTheme(t: 'light' | 'dark'): void {
    this.theme.set(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  }

  initTheme(): void {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
    this.setTheme(saved ?? preferred);
  }
}
```

---

## 09 — Checklist UI — requerido en todo PR con cambios de interfaz

```
[ ] 1. Colores usando clases Tailwind semánticas (sky-600, slate-700) — nunca hex hardcodeado
[ ] 2. backdrop-blur máximo blur-sm (4px) si se usa glassmorphism
[ ] 3. Glass solo en: KPI widget, modal oscuro, panel de filtros — nunca en tablas o formularios
[ ] 4. Sin estilos inline ni clases de Bootstrap
[ ] 5. PrimeNG verificado antes de crear componente personalizado
[ ] 6. Overrides de PrimeNG solo en src/styles/primeng-overrides.scss
[ ] 7. Vista probada en resolución 1280px
[ ] 8. Contraste WCAG AA verificado
[ ] 9. rounded-3xl solo en elementos de presentación (login, splash) — no en flujos operativos
[ ] 10. Tipado estricto: cero any en el componente o servicio modificado
```

---

## 10 — Referencia Rápida de Clases

### Colores primarios

```
bg-sky-600              Fondo primario (botones, highlights)
text-sky-600            Texto en color primario (links, iconos activos)
hover:bg-sky-700        Estado hover de primario
bg-sky-950              Fondo del sidebar de navegación
border-sky-600          Borde en color primario
```

### Colores de estado

```
bg-emerald-100 text-emerald-700   Badge "Presente" / "Activo"
bg-amber-100 text-amber-700       Badge "Pendiente" / "Atención"
bg-red-100 text-red-700           Badge "Ausente" / "Error"
bg-gray-100 text-slate-500        Badge "Sin definir" / "Inactivo"
```

### Colores estáticos

```
bg-gray-50 / bg-gray-100 / bg-gray-200   Fondos de página y superficie
text-slate-700                            Texto principal
text-slate-400                            Texto secundario / muted
bg-white                                  Fondo de cards
```

### Radii de referencia rápida

```
rounded      → badges, chips
rounded-md   → inputs, botones
rounded-lg   → cards (el más usado)
rounded-xl   → modales, widgets KPI
rounded-2xl  → banners, hero cards
rounded-3xl  → login, splash (máximo permitido)
```

### Spacing de referencia rápida

```
py-3 px-4   → celdas de tabla
py-2.5 px-4 → inputs
p-6         → cards
py-6 px-8   → modales
gap-6       → entre campos de formulario
gap-8       → entre secciones de vista
```

---

## 11 — Instrucciones para IA (Copilot)

Al generar o modificar código en este proyecto, aplicar siempre estas reglas:

**Colores:**
- Usar clases Tailwind semánticas: `bg-sky-600`, `text-sky-600`, `bg-sky-950` — nunca valores hex directos
- Para colores estáticos: `bg-gray-50/100/200`, `text-slate-700`, `text-slate-400`
- Acento ámbar `amber-500/600` solo para KPIs especiales o badges destacados

**Spacing:**
- Solo valores de la escala de 4px: `p-1`, `p-2`, `p-3`, `p-4`, `p-5`, `p-6`, `p-8`, `p-12`
- Nunca valores arbitrarios como `p-[13px]`

**Border-radius:**
- `rounded-md` para inputs y botones
- `rounded-lg` para cards y paneles (default)
- `rounded-xl` para modales
- `rounded-3xl` solo en pantallas de login o splash — nunca en formularios ni tablas

**Tipografía:**
- Escala: `text-sm` a `text-xl` — nunca `text-2xl` o superior en componentes internos
- `font-bold` solo para cifras clave (conteos, totales)
- `text-slate-700` como base — nunca `text-black`

**Glassmorphism:**
- Solo con `backdrop-blur-sm` (4px máx.) y `bg-white/85` mínimo
- Solo en: KPI widgets (máx. 3), modales sobre fondo oscuro, panel de filtros
- Nunca sobre tablas, formularios o listas

**Botones:**
- Un solo primario por vista
- Siempre con `hover:`, `disabled:opacity-45`, `disabled:cursor-not-allowed`
- `rounded-md` en todos los botones de acción

**Angular 19+:**
- Componentes standalone — nunca `NgModule`
- Control flow nativo: `@if`, `@for`, `@switch` — nunca `*ngIf`, `*ngFor`
- Inyección con `inject()` — nunca por constructor
- `input()`, `output()`, `model()` — nunca decoradores `@Input()`/`@Output()`
- Estado local con `signal()`, derivado con `computed()`, efectos con `effect()`
- Importar desde `environment` — nunca desde `environment.development`

---

## 12 — Glosario

| Término | Definición |
|---|---|
| `sky-*` | Escala de color primario del proyecto — mapeada en PrimeNG Aura via `app.config.ts` |
| `sky-950` | Color del sidebar — el tono más oscuro de la escala primaria |
| Glass sutil | `backdrop-blur-sm` + `bg-white/85` — el único nivel de glassmorphism aprobado |
| `primeng-overrides.scss` | Único archivo donde se modifican estilos internos de componentes PrimeNG |
| Módulo | Feature del CRM con ruta lazy-loaded, servicio propio y color identificador secundario |
| `--text-primary` | `#f0f0f5` en dark — nunca blanco puro para evitar fatiga visual |

---

*UI Style Guide v2.0 · KingdomKids — Mundo de Fe Playa del Carmen · Angular 19 + TailwindCSS + PrimeNG 19*
*Paleta de identidad: propuesta genérica — pendiente de aprobación con identidad oficial de la iglesia*
*Documento vivo — actualizar cuando una regla no esté funcionando en la práctica*
