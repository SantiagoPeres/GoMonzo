/* ============================================================
   IBEROHUB · Chat de diagnóstico: guion y reglas
   Todo el texto y la lógica de recomendación viven aquí.
   Se puede editar sin tocar assets/js/chatbot.js.
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
        /* Botón "Reservar 20 min" de la tarjeta, cuando ya haya número. */
        directMessage: 'Hola, vengo de iberohub.com y quiero reservar la llamada de 20 minutos.',
        /* Mensaje que queda escrito al terminar el chat. El cliente decide si lo envía. */
        intro: 'Hola, vengo del chat de iberohub.com.',
        fields: [
            { step: 'sector', label: 'Sector' },
            { step: 'equipo', label: 'Equipo' },
            { step: 'frecuencia', label: 'Frecuencia' },
            { step: 'horas', label: 'Horas a la semana' },
            { step: 'busca', label: 'Busco' },
            { step: 'problema', label: 'Mi problema' }
        ],
        recommendationLabel: 'Recomendación'
    },

    labels: {
        progress: 'Paso {n} de {total}',
        back: '← Atrás',
        restart: 'Empezar de nuevo',
        send: 'Enviar',
        chatName: 'Chat de diagnóstico de IberoHub'
    },

    steps: [
        {
            id: 'bienvenida',
            type: 'welcome',
            bot: 'Hola, soy el asistente de IberoHub. En un minuto vemos cómo podemos ayudarte.',
            cta: 'Empezar'
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
                { id: 'otro', label: 'Otro', phrase: 'Otro sector' }
            ]
        },
        {
            id: 'equipo',
            type: 'choice',
            bot: '¿Cuántas personas sois en el equipo?',
            options: [
                { id: 'solo', label: 'Solo yo', phrase: 'una persona' },
                { id: '2-10', label: '2 a 10', phrase: '2 a 10 personas' },
                { id: '11-50', label: '11 a 50', phrase: '11 a 50 personas' },
                { id: '50+', label: 'Más de 50', phrase: 'más de 50 personas' }
            ]
        },
        {
            id: 'frecuencia',
            type: 'choice',
            bot: '¿Con qué frecuencia te pasa el problema?',
            options: [
                { id: 'dia', label: 'Cada día', phrase: 'cada día' },
                { id: 'semana', label: 'Cada semana', phrase: 'cada semana' },
                { id: 'mes', label: 'Cada mes', phrase: 'cada mes' },
                { id: 'anio', label: 'Pocas veces al año', phrase: 'pocas veces al año' }
            ]
        },
        {
            id: 'horas',
            type: 'choice',
            bot: '¿Cuántas horas a la semana os cuesta?',
            options: [
                { id: '<2', label: 'Menos de 2', phrase: 'menos de 2 horas', month: 'menos de 8 horas' },
                { id: '2-5', label: '2 a 5', phrase: 'de 2 a 5 horas', month: 'entre 8 y 20 horas' },
                { id: '5-15', label: '5 a 15', phrase: 'de 5 a 15 horas', month: 'entre 20 y 60 horas' },
                { id: '15+', label: 'Más de 15', phrase: 'más de 15 horas', month: 'más de 60 horas' }
            ]
        },
        {
            id: 'busca',
            type: 'choice',
            bot: '¿Qué buscas?',
            options: [
                { id: 'no-se', label: 'No sé bien qué necesito' },
                { id: 'idea', label: 'Tengo una idea de producto' },
                { id: 'automatizar', label: 'Automatizar un proceso' },
                { id: 'software', label: 'Mejorar un software que ya tengo' }
            ]
        },
        {
            id: 'problema',
            type: 'text',
            bot: 'Cuéntame tu problema en una frase.',
            fieldLabel: 'Tu problema (opcional)',
            maxLength: 200,
            skip: 'Saltar',
            skipEcho: 'Prefiero contarlo por WhatsApp.'
        }
    ],

    result: {
        /* Variables: {sector} {equipo} {frecuencia} {horas} {mes} */
        summary: '{sector}, {equipo}. Te pasa {frecuencia} y cuesta {horas} a la semana.',
        /* Solo si el problema es recurrente: con otra frecuencia el cálculo mensual engañaría. */
        monthly: {
            when: { frecuencia: ['dia', 'semana'] },
            text: 'Eso son {mes} al mes.'
        },
        goldenRule: 'La llamada de 20 minutos es gratis. El diagnóstico completo, nunca.',
        whatsappIntro: 'Sigue por WhatsApp: tus respuestas ya van escritas y concretamos la llamada.',
        whatsappCta: 'Seguir por WhatsApp'
    },

    /* Se aplica la primera regla que coincide; el orden importa.
       Dentro de "when", todas las condiciones deben cumplirse. */
    rules: [
        {
            id: 'no-se',
            when: { busca: ['no-se'] },
            service: 'Llamada de 20 minutos gratis',
            text: 'Si no lo tienes claro, lo mejor es hablarlo. Empezamos por la llamada y, si encaja, el siguiente paso es un Diagnóstico de IA de pago (1.500 €).'
        },
        {
            id: 'automatizar-compensa',
            when: { busca: ['automatizar'], frecuencia: ['dia', 'semana'], horas: ['5-15', '15+'] },
            service: 'Automatización con IA',
            price: 'Desde 6.000 €',
            text: 'Aquí una automatización suele compensar. En la llamada vemos si es tu caso.'
        },
        {
            /* También recoge "más de 5 horas" con frecuencia mensual o anual, sin regla propia en el spec. */
            id: 'automatizar-valorar',
            when: { busca: ['automatizar'] },
            service: 'Llamada para valorar si compensa',
            text: 'Con estas cifras no está claro que automatizar compense. Mejor lo vemos en la llamada antes de proponerte nada.'
        },
        {
            id: 'idea',
            when: { busca: ['idea'] },
            service: 'Construcción de producto',
            text: 'Empezaríamos por un MVP con precio cerrado, para probar la idea antes de construir de más.'
        },
        {
            id: 'software',
            when: { busca: ['software'] },
            service: 'Revisión de arquitectura',
            text: 'Antes de tocar nada, revisamos la arquitectura de lo que ya tienes para ver por dónde conviene empezar.'
        }
    ]
};
