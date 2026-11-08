/* ============================================================
   IBEROHUB · Chat de diagnóstico (tarjeta 04 · "Plaza disponible")
   Motor sin dependencias. Guion y reglas: chatbot-config.js
   ============================================================ */
(() => {
    const config = window.IBEROHUB_CHATBOT;
    const card = document.getElementById('chat');
    const panel = document.getElementById('chat-panel');
    if (!config || !card || !panel) return;

    const folder = card.closest('.folder');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const { steps, labels } = config;
    /* La bienvenida no cuenta como paso de progreso. */
    const totalQuestions = steps.length - 1;

    const state = { index: 0, answers: {}, result: null };

    const el = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };

    /* ---------- Estructura ---------- */
    panel.setAttribute('aria-label', labels.chatName);
    const scroller = el('div', 'chat-scroll');
    scroller.tabIndex = -1;
    const log = el('div', 'chat-log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');
    const controls = el('div', 'chat-controls');
    scroller.append(log, controls);

    const footer = el('div', 'meta-row chat-footer');
    const backButton = el('button', 'chat-link', labels.back);
    backButton.type = 'button';
    const progress = el('span', 'chat-progress');
    footer.append(backButton, progress);
    panel.append(scroller, footer);

    /* ---------- Reglas ---------- */
    const matches = (when, answers) =>
        Object.entries(when).every(([stepId, ids]) => ids.includes(answers[stepId]));

    const findOption = (stepId, optionId) => {
        const step = steps.find((s) => s.id === stepId);
        return step && step.options && step.options.find((o) => o.id === optionId);
    };

    const fillTemplate = (template, answers) =>
        template.replace(/\{(\w+)\}/g, (_, key) => {
            const optionStep = key === 'mes' ? 'horas' : key;
            const option = findOption(optionStep, answers[optionStep]);
            if (!option) return '';
            if (key === 'mes') return option.month;
            return option.phrase || option.label;
        });

    const recommend = (answers) => {
        const rule = config.rules.find((r) => matches(r.when, answers));
        const { summary, monthly } = config.result;
        const parts = [fillTemplate(summary, answers)];
        if (matches(monthly.when, answers)) parts.push(fillTemplate(monthly.text, answers));
        return { rule, summary: parts.join(' ') };
    };

    /* ---------- WhatsApp ---------- */
    const whatsappUrl = (text) => {
        const number = config.whatsapp.number || '';
        return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    };

    const answerLabel = (stepId) => {
        const option = findOption(stepId, state.answers[stepId]);
        return option ? option.label : state.answers[stepId];
    };

    const buildMessage = (rule) => {
        const { intro, fields, recommendationLabel } = config.whatsapp;
        const lines = fields
            .filter(({ step }) => answerLabel(step))
            .map(({ step, label }) => `${label}: ${answerLabel(step)}`);
        return [intro, '', ...lines, `${recommendationLabel}: ${rule.service}`].join('\n');
    };

    /* ---------- Mensajes ---------- */
    const addBot = (text, animate = true) => {
        const message = el('p', 'chat-msg chat-msg--bot', text);
        if (!animate) message.classList.add('no-anim');
        log.append(message);
    };

    const addUser = (text, animate = true) => {
        const message = el('p', 'chat-msg chat-msg--user', text);
        if (!animate) message.classList.add('no-anim');
        log.append(message);
    };

    const answerEcho = (step) => {
        if (step.type === 'choice') return findOption(step.id, state.answers[step.id]).label;
        if (step.type === 'text') return state.answers[step.id] || step.skipEcho;
        return null;
    };

    const scrollToEnd = () => {
        scroller.scrollTo({ top: scroller.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    /* Tras ir atrás se reconstruye el historial, sin repetir animaciones. */
    const rebuildLog = () => {
        log.textContent = '';
        steps.slice(0, state.index + 1).forEach((step, i) => {
            addBot(step.bot, false);
            if (i < state.index) {
                const echo = answerEcho(step);
                if (echo) addUser(echo, false);
            }
        });
    };

    /* ---------- Navegación ---------- */
    const advance = () => {
        const echo = answerEcho(steps[state.index]);
        if (echo) addUser(echo);
        if (state.index === steps.length - 1) {
            state.result = recommend(state.answers);
            renderResult();
            return;
        }
        state.index += 1;
        addBot(steps[state.index].bot);
        renderControls();
    };

    const goBack = () => {
        if (state.index === 0) return;
        delete state.answers[steps[state.index].id];
        state.index -= 1;
        rebuildLog();
        renderControls();
    };

    const restart = () => {
        state.index = 0;
        state.answers = {};
        state.result = null;
        rebuildLog();
        renderControls();
    };

    const focusFirst = (target) => {
        /* En táctil no se enfoca un campo de texto: abriría el teclado sin pedirlo. */
        const isTextField = target && target.matches('input, textarea');
        const node = target && (finePointer || !isTextField) ? target : scroller;
        node.focus({ preventScroll: true });
    };

    /* Aviso legal: texto y enlaces del fichero de configuración. */
    function fillLegal(node) {
        const { legal } = config;
        const link = (label, href) => {
            const a = el('a', '', label);
            a.href = href;
            return a;
        };
        node.textContent = '';
        node.append(
            legal.before,
            link(legal.privacyLabel, legal.privacyUrl),
            legal.middle,
            link(legal.noticeLabel, legal.noticeUrl),
            legal.after
        );
    }

    /* ---------- Controles por tipo de paso ---------- */
    const renderWelcome = (step) => {
        const button = el('button', 'btn hook-primary chat-start');
        button.type = 'button';
        button.append(step.cta, ' ', el('span', 'arrow', '→'));
        button.addEventListener('click', advance);
        const legal = el('p', 'chat-legal');
        fillLegal(legal);
        controls.append(button, legal);
        return button;
    };

    const renderChoice = (step) => {
        const group = el('div', 'chat-options');
        step.options.forEach((option) => {
            const button = el('button', 'btn hook-secondary chat-option', option.label);
            button.type = 'button';
            button.addEventListener('click', () => {
                state.answers[step.id] = option.id;
                advance();
            });
            group.append(button);
        });
        controls.append(group);
        return group.firstElementChild;
    };

    const renderText = (step) => {
        const form = el('form', 'chat-form');
        form.noValidate = true;
        const field = el('div', 'form-field form-field--textarea');
        const textarea = el('textarea');
        textarea.id = 'chat-problema';
        textarea.rows = 3;
        textarea.maxLength = step.maxLength;
        textarea.placeholder = ' ';
        textarea.value = state.answers[step.id] || '';
        const label = el('label', '', step.fieldLabel);
        label.htmlFor = textarea.id;
        field.append(textarea, label);

        const row = el('div', 'chat-form-row');
        const counter = el('span', 'chat-counter');
        const updateCounter = () => {
            counter.textContent = `${textarea.value.length}/${step.maxLength}`;
        };
        updateCounter();
        textarea.addEventListener('input', updateCounter);
        const submit = el('button', 'form-submit chat-submit');
        submit.type = 'submit';
        submit.append(el('span', 'submit-label', labels.send), el('span', 'submit-arrow', '→'));
        const skip = el('button', 'chat-link', step.skip);
        skip.type = 'button';
        skip.addEventListener('click', () => {
            state.answers[step.id] = '';
            advance();
        });
        const actions = el('div', 'chat-form-actions');
        actions.append(skip, submit);
        row.append(counter, actions);
        form.append(field, row);

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                form.requestSubmit();
            }
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            /* Opcional: enviarlo vacío equivale a saltarlo. */
            state.answers[step.id] = textarea.value.trim().slice(0, step.maxLength);
            advance();
        });
        controls.append(form);
        return textarea;
    };

    const renderResult = () => {
        const { rule, summary } = state.result;
        const { result } = config;
        controls.textContent = '';
        updateFooter(true);

        const box = el('div', 'chat-result');
        const service = el('h3', 'chat-result-service', rule.service);
        service.tabIndex = -1;
        box.append(service);
        if (rule.price) box.append(el('p', 'chat-result-price', rule.price));
        box.append(
            el('p', 'chat-result-summary', summary),
            el('p', 'chat-result-text', rule.text),
            el('p', 'chat-result-note', result.goldenRule)
        );

        const whatsapp = el('a', 'form-submit chat-submit chat-submit--full');
        whatsapp.href = whatsappUrl(buildMessage(rule));
        whatsapp.target = '_blank';
        whatsapp.rel = 'noopener';
        whatsapp.append(el('span', 'submit-label', result.whatsappCta), el('span', 'submit-arrow', '→'));
        box.append(el('p', 'chat-result-text', result.whatsappIntro), whatsapp);
        if (!config.whatsapp.number) {
            box.append(el('p', 'chat-mock-note', config.whatsapp.missingNumberNotice));
        }
        log.append(box);

        const again = el('button', 'chat-link', labels.restart);
        again.type = 'button';
        again.addEventListener('click', () => {
            restart();
        });
        controls.append(again);

        /* Se muestra desde el inicio: la recomendación importa más que el final de la tarjeta. */
        requestAnimationFrame(() => {
            const top = box.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
            scroller.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
            service.focus({ preventScroll: true });
        });
    };

    const updateFooter = (finished) => {
        backButton.hidden = finished || state.index === 0;
        if (finished) {
            progress.textContent = '';
        } else if (state.index === 0) {
            progress.textContent = '';
        } else {
            progress.textContent = labels.progress
                .replace('{n}', state.index)
                .replace('{total}', totalQuestions);
        }
    };

    const renderers = {
        welcome: renderWelcome,
        choice: renderChoice,
        text: renderText
    };

    function renderControls() {
        controls.textContent = '';
        const step = steps[state.index];
        const target = renderers[step.type](step);
        updateFooter(false);
        requestAnimationFrame(() => {
            scrollToEnd();
            focusFirst(target);
        });
    }

    backButton.addEventListener('click', goBack);

    /* ---------- Abrir ---------- */
    const scrollToCard = () => {
        const rect = card.getBoundingClientRect();
        const clearNav = 84;
        const offset = Math.max(clearNav, (window.innerHeight - rect.height) / 2);
        window.scrollTo({
            top: window.scrollY + rect.top - offset,
            behavior: reducedMotion ? 'instant' : 'smooth'
        });
    };

    let started = false;
    const open = () => {
        card.classList.add('is-open');
        /* Sin sticky mientras el chat está abierto: el scroll de la página y el del chat
           no compiten y la posición de destino es estable. */
        if (folder) folder.classList.add('is-chat-open');
        panel.hidden = false;
        if (!started) {
            started = true;
            rebuildLog();
            renderControls();
        }
        scrollToCard();
    };

    document.querySelectorAll('[data-chat-open]').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            open();
        });
    });

    /* Vista previa de la tarjeta cerrada: el saludo sale del guion y "Empezar" salta directo a la primera pregunta. */
    document.querySelectorAll('[data-chat-legal]').forEach(fillLegal);
    document.querySelectorAll('[data-chat-welcome]').forEach((node) => {
        node.textContent = steps[0].bot;
    });
    document.querySelectorAll('[data-chat-start]').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            open();
            if (state.index === 0) advance();
        });
    });

    /* "Reservar 20 min": WhatsApp directo si ya hay número; si no, el chat. */
    document.querySelectorAll('[data-chat-booking]').forEach((trigger) => {
        if (config.whatsapp.number) {
            trigger.href = whatsappUrl(config.whatsapp.directMessage);
            trigger.target = '_blank';
            trigger.rel = 'noopener';
            return;
        }
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            open();
        });
    });
})();
