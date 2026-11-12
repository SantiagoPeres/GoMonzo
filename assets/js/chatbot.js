/* ============================================================
   IBEROHUB · Chat guiado (tarjeta 04 · "Plaza disponible")
   Motor sin dependencias. Guion: chatbot-config.js
   Las respuestas solo viven en esta página: no se guardan, no se
   registran y no se envían a ningún servidor. Solo salen si la
   persona pulsa "Continuar por WhatsApp" y envía el mensaje.
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

    /* path: índices de los pasos mostrados, en orden. El último es el paso actual. */
    const state = { path: [0], answers: {}, finished: false };
    const current = () => state.path[state.path.length - 1];

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
    const finishButton = el('button', 'chat-link', labels.finish);
    finishButton.type = 'button';
    const progress = el('span', 'chat-progress');
    footer.append(backButton, finishButton, progress);
    panel.append(scroller, footer);

    /* ---------- Pasos condicionales ---------- */
    const matches = (when) =>
        Object.entries(when).every(([stepId, ids]) => ids.includes(state.answers[stepId]));

    const isActive = (step) => !step.when || matches(step.when);

    const nextIndex = (from) => {
        for (let i = from + 1; i < steps.length; i += 1) {
            if (isActive(steps[i])) return i;
        }
        return -1;
    };

    const findOption = (step, optionId) =>
        step && step.options && step.options.find((o) => o.id === optionId);

    /* ---------- Mensaje de WhatsApp ---------- */
    const whatsappUrl = (text) => {
        const number = config.whatsapp.number || '';
        return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    };

    /* Valor legible de una respuesta, o null si no hay dato útil. */
    const messageValue = (stepId) => {
        const step = steps.find((s) => s.id === stepId);
        if (!step || !isActive(step)) return null;
        const answer = state.answers[stepId];
        if (step.type === 'text') {
            const text = (answer || '').replace(/\s+/g, ' ').trim();
            return text || null;
        }
        const option = findOption(step, answer);
        if (!option || option.unknown) return null;
        return option.message || option.label;
    };

    const messageLines = () =>
        config.whatsapp.fields
            .map(({ step, label }) => {
                const value = messageValue(step);
                return value ? `${label}: ${value}` : null;
            })
            .filter(Boolean);

    const buildMessage = (lines) => [config.whatsapp.intro, ...lines].join('\n');

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
        if (step.type === 'choice') {
            const option = findOption(step, state.answers[step.id]);
            return option ? option.label : null;
        }
        if (step.type === 'text') return state.answers[step.id] || step.skipEcho;
        return null;
    };

    const scrollToEnd = () => {
        scroller.scrollTo({ top: scroller.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    /* Tras ir atrás o reiniciar se reconstruye el historial, sin repetir animaciones. */
    const rebuildLog = () => {
        log.textContent = '';
        state.path.forEach((index, i) => {
            const step = steps[index];
            addBot(step.bot, false);
            if (i < state.path.length - 1) {
                const echo = answerEcho(step);
                if (echo) addUser(echo, false);
            }
        });
    };

    /* ---------- Navegación ---------- */
    const advance = () => {
        const step = steps[current()];
        const echo = answerEcho(step);
        if (echo) addUser(echo);
        const next = nextIndex(current());
        if (next === -1) {
            finish();
            return;
        }
        state.path.push(next);
        addBot(steps[next].bot);
        renderControls();
    };

    const goBack = () => {
        if (state.path.length <= 1) return;
        const leaving = state.path.pop();
        delete state.answers[steps[leaving].id];
        rebuildLog();
        renderControls();
    };

    /* La persona puede parar cuando quiera: se pasa solo lo que ya ha contestado. */
    const stopHere = () => {
        delete state.answers[steps[current()].id];
        addUser(labels.finishEcho);
        finish();
    };

    const restart = () => {
        state.path = [0];
        state.answers = {};
        state.finished = false;
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
        textarea.id = `chat-${step.id}`;
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

    /* ---------- Final: solo el mensaje para WhatsApp ---------- */
    function finish() {
        const { result } = config;
        state.finished = true;
        controls.textContent = '';
        updateFooter();

        const lines = messageLines();
        addBot(lines.length ? result.thanks : result.empty);

        const box = el('div', 'chat-result');
        const title = el('h3', 'chat-result-title', result.previewTitle);
        title.tabIndex = -1;
        const preview = el('p', 'chat-result-preview', buildMessage(lines));
        box.append(title, preview, el('p', 'chat-result-note', result.previewNote));

        const whatsapp = el('a', 'form-submit chat-submit chat-submit--full');
        whatsapp.href = whatsappUrl(buildMessage(lines));
        whatsapp.target = '_blank';
        whatsapp.rel = 'noopener';
        whatsapp.append(el('span', 'submit-label', result.whatsappCta), el('span', 'submit-arrow', '→'));
        box.append(whatsapp);
        if (!config.whatsapp.number) {
            box.append(el('p', 'chat-mock-note', config.whatsapp.missingNumberNotice));
        }
        log.append(box);

        const again = el('button', 'chat-link', labels.restart);
        again.type = 'button';
        again.addEventListener('click', restart);
        controls.append(again);

        /* Al final del todo: en móvil la vista previa es larga y el botón de WhatsApp debe quedar a la vista. */
        requestAnimationFrame(() => {
            scrollToEnd();
            title.focus({ preventScroll: true });
        });
    }

    /* El total se recalcula con cada respuesta, porque algunos pasos son condicionales. */
    const updateFooter = () => {
        const onWelcome = current() === 0;
        backButton.hidden = state.finished || onWelcome;
        finishButton.hidden = state.finished || onWelcome;
        if (state.finished || onWelcome) {
            progress.textContent = '';
            return;
        }
        const active = steps.filter((s, i) => i > 0 && isActive(s));
        const n = active.indexOf(steps[current()]) + 1;
        progress.textContent = labels.progress.replace('{n}', n).replace('{total}', active.length);
    };

    const renderers = {
        welcome: renderWelcome,
        choice: renderChoice,
        text: renderText
    };

    function renderControls() {
        controls.textContent = '';
        const step = steps[current()];
        const target = renderers[step.type](step);
        updateFooter();
        requestAnimationFrame(() => {
            scrollToEnd();
            focusFirst(target);
        });
    }

    backButton.addEventListener('click', goBack);
    finishButton.addEventListener('click', stopHere);

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
            if (current() === 0 && !state.finished) advance();
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
