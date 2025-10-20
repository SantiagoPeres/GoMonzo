# 📅 Guía de Configuración de Agendamiento Online

## ¿Por Qué Este Cambio?

✅ **Protege tu privacidad**: No expones tu número de WhatsApp personal  
✅ **Más profesional**: Los clientes ven disponibilidad automática  
✅ **Ahorra tiempo**: No más mensajes de "¿Cuándo podemos hablar?"  
✅ **Filtro automático**: Solo hablas con personas que realmente agendan  

---

## Opción 1: Calendly (Recomendado) 🌟

### Paso 1: Crear Cuenta
1. Ve a **https://calendly.com**
2. Regístrate con tu email (versión gratuita es suficiente)
3. Conecta tu Google Calendar o Outlook

### Paso 2: Crear Tipo de Evento
1. Haz clic en "Create Event Type"
2. **Nombre del evento**: "Consulta de Talento Tech"
3. **Duración**: 30 minutos
4. **Descripción**: 
   ```
   Reunión de consultoría para discutir tus necesidades de talento tecnológico.
   
   Hablaremos sobre:
   - Tu proyecto y requisitos específicos
   - Tipo de perfiles que necesitas
   - Presupuesto y plazos
   - Próximos pasos para encontrar el talento perfecto
   ```
5. **Ubicación**: Google Meet (se crea automáticamente)
6. **Preguntas personalizadas** (añadir antes de la reunión):
   - Nombre de la empresa
   - Tipo de especialista que necesitas
   - Presupuesto aproximado
   - Cuándo necesitas empezar

### Paso 3: Configurar Disponibilidad
1. Ve a "Availability"
2. Define tu horario disponible (ej: Lunes-Viernes, 9:00-18:00)
3. Zona horaria: Europe/Madrid

### Paso 4: Obtener el Enlace
1. Ve a tu evento creado
2. Copia el enlace (será algo como: `https://calendly.com/santiago-monzo/consulta-talento-tech`)

### Paso 5: Integrar en el Sitio Web

**Opción A - Widget Integrado (Recomendado)**

Abre `index.html` y busca el comentario `<!-- Código para cuando tengas Calendly configurado: -->`

Reemplaza esta sección:
```html
<!-- Código para cuando tengas Calendly configurado:
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/TU-USUARIO/consulta-talento-tech" 
     style="min-width:320px;height:630px;">
</div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
-->
```

Por esto (usando TU enlace de Calendly):
```html
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/santiago-monzo/consulta-talento-tech" 
     style="min-width:320px;height:630px;">
</div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

Y ELIMINA toda la sección de "Configura tu calendario en 3 pasos".

**Opción B - Solo Enlace Directo**

Si prefieres algo más simple, cambia el botón por un enlace directo:
```html
<a href="https://calendly.com/tu-usuario/consulta-talento-tech" 
   target="_blank" 
   class="btn btn-brand">
    <i class="ri-calendar-line"></i> Agendar Reunión
</a>
```

---

## Opción 2: Cal.com (Open Source y Gratuito) 🔓

### Ventajas
- 100% gratuito, sin límites
- Open source
- Más opciones de personalización
- Integración con Google Meet, Zoom, etc.

### Paso 1: Crear Cuenta
1. Ve a **https://cal.com**
2. Regístrate gratis
3. Sigue pasos similares a Calendly

### Paso 2: Configurar
- Proceso muy similar a Calendly
- También genera widget embebido
- Código de integración prácticamente igual

---

## Opción 3: Google Calendar Appointment Schedules (Gratis) 📆

### Si tienes Google Workspace
1. Abre Google Calendar
2. Ve a "Appointment Schedules"
3. Crea un nuevo tipo de cita
4. Comparte el enlace de reserva

### Limitaciones
- Menos personalización
- Solo si tienes Google Workspace (no Gmail personal)

---

## Opción 4: Microsoft Bookings (Si tienes Microsoft 365) 📘

Similar a Google Calendar pero para usuarios de Microsoft 365.

---

## Recomendación Final

**Para empezar YA (5 minutos):**
1. Crea cuenta en **Calendly** (gratis)
2. Configura 1 tipo de evento de 30 minutos
3. Copia tu enlace
4. Añádelo al sitio

**Calendly Gratis incluye:**
- ✅ 1 tipo de evento activo
- ✅ Integración con Google Calendar
- ✅ Google Meet automático
- ✅ Notificaciones por email
- ✅ Suficiente para empezar

---

## Alternativa Temporal (Mientras Configuras)

El sitio actualmente redirige a **email** cuando hacen clic en agendar reunión.

El email se abre con un template pre-llenado para que te envíen:
- Su disponibilidad
- Descripción del proyecto
- Fechas que les vienen bien

Tú respondes manualmente con un Google Meet.

---

## Siguiente Paso

1. **Ahora mismo**: Crea tu cuenta en Calendly
2. **En 10 minutos**: Configura tu primer evento
3. **En 15 minutos**: Copia el código del widget
4. **En 20 minutos**: Actualiza index.html con tu enlace
5. **¡Listo!**: Tu sitio tiene agendamiento profesional sin exponer tu WhatsApp

---

## ¿Necesitas Ayuda?

Si tienes problemas configurando Calendly o Cal.com, avísame y te ayudo a integrar el código específico en tu sitio.

**Email de contacto del sitio actual**: contacto@iberohub.com  
(Asegúrate de que este email esté activo y lo revises regularmente)
