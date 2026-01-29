# 🎯 Nueva Funcionalidad: Dual Audience (Empresas y Profesionales)

## 🎉 ¡Implementación Exitosa!

Tu sitio ahora tiene una funcionalidad dual que permite **segmentar el contenido** entre dos audiencias:
- 🏢 **Para Empresas** (que buscan contratar talento)
- 👨‍💻 **Para Profesionales** (que buscan empleo)

---

## 📍 Cambios Implementados

### **1. Toggle en el Header**

**Desktop:**
- Añadido un toggle elegante en el centro del navbar
- Dos botones: "Para Empresas" | "Para Profesionales"
- Con iconos (edificio 🏢 y estrella de usuario ⭐)
- Efecto activo con fondo blanco y sombra

**Mobile:**
- Toggle adaptado para móvil
- Botones más grandes y táctiles
- Aparece dentro del menú colapsable

### **2. Hero Section Dual**

#### **Para Empresas (por defecto):**
- **Título**: "Talento Tech en 7 Días o Tu Dinero de Vuelta"
- **Subtítulo**: Enfocado en contratar profesionales
- **CTAs**: 
  - "Habla Conmigo Ahora" (modal)
  - "Cómo Funciona"

#### **Para Profesionales:**
- **Título**: "Tu Próxima Oportunidad Tech Te Está Esperando"
- **Subtítulo**: "Conectamos profesionales tech con las mejores empresas en España..."
- **CTAs**:
  - "Ver Vacantes Disponibles" (link a vacantes.html)
  - "Cómo Funciona"

### **3. Sección "Cómo Funciona" Dual**

#### **Para Empresas:**
1. **Tú Dices el Perfil** → Contacto y requisitos
2. **Nosotros Enviamos los CVs** → En 7 días
3. **Contrato Firmado** → Gestión de burocracia

#### **Para Profesionales:**
1. **Regístrate Gratis** → Completar perfil en 5 minutos
2. **Te Conectamos** → Con oportunidades que coincidan
3. **Empieza a Trabajar** → Acompañamiento en el proceso

### **4. CTAs Dinámicos en Navbar**

- **Para Empresas**: "Pide Tu Talento Ahora" → Va a contacto
- **Para Profesionales**: "Ver Vacantes" → Va a vacantes.html

### **5. JavaScript Interactivo**

El toggle cambia dinámicamente:
- ✅ Contenido del hero
- ✅ Sección "Cómo Funciona"
- ✅ CTA del navbar
- ✅ Scroll suave al cambiar
- ✅ Sincronización entre toggle desktop y mobile

---

## 🎨 Diseño Visual

### **Toggle Desktop:**
```
┌─────────────────────────────────────┐
│ [🏢 Para Empresas] [👨‍💻 Para Profesionales] │
└─────────────────────────────────────┘
```
- Fondo gris claro (#f8f9fa)
- Botón activo: blanco con sombra
- Hover: color morado
- Border radius redondeado (30px)

### **Toggle Mobile:**
```
┌──────────────────┐  ┌──────────────────┐
│ 🏢 Para Empresas │  │ 👨‍💻 Para Profesionales │
└──────────────────┘  └──────────────────┘
```
- Botones lado a lado
- Activo: fondo morado, texto blanco
- Inactivo: fondo gris claro

---

## 🔄 Flujo de Usuario

### **Empresa llega al sitio:**
1. Ve toggle en header
2. Por defecto está en "Para Empresas"
3. Ve contenido enfocado en contratar talento
4. Click en "Pide Tu Talento Ahora" → Modal de contacto
5. Puede llenar formulario o agendar videollamada

### **Profesional llega al sitio:**
1. Ve toggle en header
2. Hace click en "Para Profesionales"
3. **Contenido cambia instantáneamente**:
   - Hero habla de oportunidades de empleo
   - "Cómo Funciona" explica proceso para candidatos
   - CTA del navbar cambia a "Ver Vacantes"
4. Click en "Ver Vacantes" → va a vacantes.html
5. Puede registrarse y ver ofertas

---

## 📊 Ventajas de Esta Implementación

### **Para el Negocio:**
✅ **Dos fuentes de ingresos**:
   - Empresas que contratan (B2B)
   - Profesionales que buscan (B2C)

✅ **Mejor SEO**: 
   - Contenido optimizado para dos keywords diferentes
   - Mayor relevancia para búsquedas variadas

✅ **Lead Generation**:
   - Capturar CVs de profesionales
   - Capturar solicitudes de empresas

✅ **Efecto Red (Network Effect)**:
   - Más profesionales = más atractivo para empresas
   - Más empresas = más atractivo para profesionales

### **Para la Experiencia del Usuario:**
✅ **Claridad inmediata**: Cada visitante ve contenido relevante  
✅ **Sin confusión**: No mezclar mensajes de B2B y B2C  
✅ **Navegación intuitiva**: Un click para cambiar audiencia  
✅ **Rápido**: Sin recargar página, cambio instantáneo  

---

## 🛠️ Aspectos Técnicos

### **HTML:**
- Contenido duplicado con clases `.hero-empresas` y `.hero-profesionales`
- Contenido con clases `.content-empresas` y `.content-profesionales`
- Toggle buttons con `data-audience` attribute

### **CSS:**
- Estilos para `.audience-toggle` (desktop)
- Estilos para `.audience-toggle-mobile` (mobile)
- Transiciones suaves en hover
- Responsive design

### **JavaScript:**
- Event listeners en todos los botones de toggle
- Cambio de display: block/none para mostrar/ocultar contenido
- Sincronización entre botones desktop y mobile
- Scroll suave al top al cambiar
- No recarga la página (SPA-like behavior)

---

## 📱 Responsive

### **Desktop (> 992px):**
- Toggle visible en el centro del navbar
- Botones con padding generoso
- Iconos y texto visibles

### **Tablet/Mobile (< 992px):**
- Toggle se mueve dentro del menú colapsable
- Botones más grandes para touch
- Layout vertical para mejor UX móvil

---

## 🚀 Próximas Mejoras Sugeridas

### **1. Página de Vacantes Mejorada**
- Crear `vacantes.html` con:
  - Listado de posiciones abiertas
  - Filtros (stack, ubicación, salario)
  - Formulario de aplicación

### **2. Base de Datos de Profesionales**
- Formulario de registro para profesionales
- Guardar CVs y perfiles
- Matching automático con vacantes

### **3. Analytics Separados**
- Track conversions de empresas vs profesionales
- Métricas de cual audiencia convierte mejor
- A/B testing de mensajes

### **4. Landing Pages Específicas**
- `/para-empresas` → Landing dedicada a B2B
- `/para-profesionales` → Landing dedicada a B2C
- SEO optimizado para cada una

### **5. Contenido Adicional Diferenciado**
- Sección "Servicios" diferente para cada audiencia
- Testimonios de empresas vs testimonios de profesionales
- Casos de éxito específicos

---

## 📝 Contenido Actual

### **Secciones que se muestran SIEMPRE:**
- ✅ Navbar (con toggle)
- ✅ Sobre Nosotros
- ✅ Qué Hacemos (Desarrolladores, Diseñadores, Data & Cloud)
- ✅ Resultados Comprobados
- ✅ Contacto
- ✅ Footer

### **Secciones que CAMBIAN según audiencia:**
- 🔄 Hero Section (título, subtítulo, CTAs)
- 🔄 Cómo Funciona (proceso diferente)
- 🔄 CTA del Navbar

---

## 🧪 Cómo Probar

1. **Abre index.html en tu navegador**
2. Por defecto verás contenido "Para Empresas"
3. Haz click en **"Para Profesionales"** en el toggle
4. Observa que:
   - El hero cambia de título
   - "Cómo Funciona" muestra proceso diferente
   - El CTA del navbar cambia a "Ver Vacantes"
   - Los botones del toggle cambian de estilo
5. Haz click de nuevo en **"Para Empresas"**
6. Observa que vuelve al contenido original

**Prueba en móvil también:**
- Abre el menú hamburguesa
- Verás el toggle dentro
- Funciona igual que en desktop

---

## 💡 Consejos de Uso

### **Para Marketing:**
- **Campaña para empresas**: Link directo a `index.html` (por defecto)
- **Campaña para profesionales**: Link a `index.html` + parámetro URL (puedes agregar `?audience=profesionales`)

### **Para SEO:**
- Añade meta tags diferentes para cada vista
- Usa schema.org para JobPosting (profesionales)
- Usa schema.org para Service (empresas)

### **Para Conversión:**
- Testea diferentes mensajes en cada audiencia
- Ajusta CTAs según métricas
- A/B test de botones y textos

---

## 📂 Archivos Modificados

1. ✅ `index.html` → Toggle, dual hero, dual "Cómo Funciona", JavaScript
2. ✅ `assets/css/style.css` → Estilos para toggle y botones

---

## 🎯 Resultado Final

Tu sitio ahora es **un hub dual** que:
- ✅ Atrae empresas que buscan contratar
- ✅ Atrae profesionales que buscan empleo
- ✅ Maximiza oportunidades de negocio
- ✅ Mejora la experiencia de usuario
- ✅ Se ve profesional y moderno

**¡Abre el sitio y pruébalo ahora!** 🚀

---

**Fecha de implementación**: 20 de octubre de 2025  
**Funcionalidad**: Dual Audience Toggle  
**Estado**: ✅ Completamente funcional
