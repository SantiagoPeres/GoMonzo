/* ============================================================
   IBEROHUB · Chat guiado del sitio
   Ayuda a explicar el problema o la idea y lo pasa a WhatsApp,
   donde sigue AIVA. Sin precios, sin recomendaciones automáticas.
   Todo el texto vive aquí; el motor está en assets/js/chatbot.js.
   ============================================================ */
window.IBEROHUB_CHATBOT = {
    /* Aviso antes de la primera pregunta (vista previa y bienvenida). */
    legal: {
        before: 'Al continuar, aceptas la ',
        privacyLabel: 'política de privacidad',
        privacyUrl: 'privacidad',
        middle: ' y el ',
        noticeLabel: 'aviso legal',
        noticeUrl: 'aviso-legal',
        after: '.'
    },

    /* Número de WhatsApp Business: solo dígitos, con prefijo de país.
       Si se deja en null, el chat muestra un aviso de prueba. */
    whatsapp: {
        number: '34910055151',
        missingNumberNotice: 'Modo prueba · falta el número de WhatsApp',
        /* Botón "Reservar 20 min" de la tarjeta (fuera del chat). */
        directMessage: 'Hola, vengo de iberohub.com y quiero reservar la llamada de 20 minutos.',
        /* Primera línea del mensaje. El Brain reconoce este formato: no cambiarla. */
        intro: 'Hola, vengo del chat de iberohub.com',
        /* Orden y nombres de los campos del mensaje. Sector, Equipo y Mi problema
           van primero porque el Brain ya los reconoce. Los campos sin respuesta
           o con "Aún no lo sé" no se incluyen. */
        fields: [
            { step: 'sector', label: 'Sector' },
            { step: 'equipo', label: 'Equipo' },
            { step: 'problema', label: 'Mi problema' },
            { step: 'tipo', label: 'Busco' },
            { step: 'objetivo', label: 'Objetivo' },
            { step: 'publico', label: 'Para quién' },
            { step: 'fase', label: 'Fase' },
            { step: 'situacion', label: 'Situación actual' }
        ]
    },

    labels: {
        progress: 'Paso {n} de {total}',
        back: '← Atrás',
        finish: 'Terminar aquí',
        finishEcho: 'Prefiero terminar aquí.',
        restart: 'Empezar de nuevo',
        send: 'Enviar',
        chatName: 'Chat de IberoHub'
    },

    /* Tipos: welcome, choice, text. Una opción con "unknown: true" no se pasa a WhatsApp.
       Un paso con "when" solo aparece si se cumplen esas respuestas. */
    steps: [
        {
            id: 'bienvenida',
            type: 'welcome',
            bot: 'Hola. Cuéntame qué tienes en mente y te ayudo a explicarlo. Después seguimos por WhatsApp con AIVA, la asistente de IberoHub.',
            cta: 'Empezar'
        },
        {
            id: 'tipo',
            type: 'choice',
            bot: '¿Qué te trae por aquí?',
            options: [
                { id: 'idea', label: 'Tengo una idea de app o producto', message: 'Crear una app o un producto nuevo' },
                { id: 'problema', label: 'Quiero resolver un problema', message: 'Resolver un problema' },
                { id: 'mejorar', label: 'Quiero mejorar algo que ya tengo', message: 'Mejorar algo que ya tengo' },
                { id: 'no-se', label: 'Aún no lo sé', unknown: true }
            ]
        },
        {
            id: 'problema',
            type: 'text',
            bot: 'Cuéntamelo en una o dos frases, con tus palabras.',
            fieldLabel: 'Tu problema o idea (opcional)',
            maxLength: 300,
            skip: 'Saltar',
            skipEcho: 'Prefiero contarlo por WhatsApp.'
        },
        {
            id: 'objetivo',
            type: 'choice',
            bot: '¿Qué te gustaría conseguir?',
            options: [
                { id: 'tiempo', label: 'Ahorrar tiempo' },
                { id: 'clientes', label: 'Conseguir más clientes' },
                { id: 'servicio', label: 'Dar un mejor servicio' },
                { id: 'lanzar', label: 'Lanzar algo nuevo' },
                { id: 'no-se', label: 'Aún no lo sé', unknown: true }
            ]
        },
        {
            id: 'publico',
            type: 'choice',
            bot: '¿Para quién sería?',
            options: [
                { id: 'equipo', label: 'Para mi equipo', message: 'Mi equipo' },
                { id: 'clientes', label: 'Para mis clientes', message: 'Mis clientes' },
                { id: 'publico', label: 'Para el público en general', message: 'El público en general' },
                { id: 'no-se', label: 'Aún no lo sé', unknown: true }
            ]
        },
        {
            id: 'fase',
            type: 'choice',
            when: { tipo: ['idea'] },
            bot: '¿En qué fase está?',
            options: [
                { id: 'idea', label: 'Solo es una idea' },
                { id: 'prototipo', label: 'Tengo bocetos o un prototipo' },
                { id: 'version', label: 'Hay una primera versión' },
                { id: 'usuarios', label: 'Ya tiene usuarios' },
                { id: 'no-se', label: 'Aún no lo sé', unknown: true }
            ]
        },
        {
            id: 'situacion',
            type: 'choice',
            bot: '¿Y ahora mismo cómo se resuelve?',
            options: [
                { id: 'manual', label: 'A mano o con hojas de cálculo' },
                { id: 'herramienta', label: 'Con una herramienta que se queda corta' },
                { id: 'nada', label: 'Todavía no se resuelve' },
                { id: 'no-se', label: 'Aún no lo sé', unknown: true }
            ]
        },
        {
            id: 'sector',
            type: 'choice',
            bot: '¿En qué sector trabajas?',
            options: [
                { id: 'servicios', label: 'Servicios profesionales' },
                { id: 'salud', label: 'Salud y bienestar' },
                { id: 'formacion', label: 'Formación' },
                { id: 'comercio', label: 'Comercio' },
                { id: 'hosteleria', label: 'Hostelería' },
                { id: 'industria', label: 'Industria' },
                { id: 'tecnologia', label: 'Tecnología' },
                { id: 'otro', label: 'Otro', unknown: true },
                { id: 'no-decir', label: 'Prefiero no decirlo', unknown: true }
            ]
        },
        {
            id: 'equipo',
            type: 'choice',
            bot: '¿Cuántas personas sois?',
            options: [
                { id: 'solo', label: 'Solo yo' },
                { id: '2-10', label: '2 a 10', message: '2 a 10 personas' },
                { id: '11-50', label: '11 a 50', message: '11 a 50 personas' },
                { id: '50+', label: 'Más de 50', message: 'Más de 50 personas' },
                { id: 'no-decir', label: 'Prefiero no decirlo', unknown: true }
            ]
        }
    ],

    result: {
        thanks: 'Gracias. Con esto AIVA ya tiene contexto para seguir contigo por WhatsApp.',
        /* Si la persona no ha dado ningún dato. */
        empty: 'Sin problema. Si quieres, sigue por WhatsApp y AIVA te ayuda desde ahí.',
        previewTitle: 'Tu mensaje para WhatsApp',
        previewNote: 'Lo podrás revisar y cambiar en WhatsApp antes de enviarlo.',
        whatsappCta: 'Continuar por WhatsApp'
    }
};
