/* ============================================================
   IBEROHUB · main.js
   Port vanilla del design handoff (hero.jsx + folders.jsx + signal.jsx).
   ============================================================ */

(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- HERO: mark letters + SVG lines + cursor glow + parallax + "siguiente" rotator ---------- */
    const initHero = () => {
        // 1) Generar las letras de IBEROHUB con spans individuales
        const mark = document.getElementById('iberohub-mark');
        if (mark && !mark.dataset.built) {
            mark.dataset.built = '1';
            const text = mark.dataset.letters || 'IBEROHUB';
            mark.textContent = '';
            text.split('').forEach((ch, i) => {
                const span = document.createElement('span');
                span.className = 'letter';
                span.textContent = ch;
                span.style.transitionDelay = `${i * 30}ms`;
                mark.appendChild(span);
            });
        }

        // 2) Generar 14 paths sinusoidales en el background hero
        const linesGroup = document.getElementById('hero-lines');
        if (linesGroup && !linesGroup.dataset.built) {
            linesGroup.dataset.built = '1';
            const SVG_NS = 'http://www.w3.org/2000/svg';
            for (let i = 0; i < 14; i++) {
                const path = document.createElementNS(SVG_NS, 'path');
                path.setAttribute('d',
                    `M ${-100 + i * 30} 1080 Q ${600 + i * 40} ${300 - i * 10}, ${2000 + i * 40} ${-100 + i * 20}`
                );
                linesGroup.appendChild(path);
            }
        }

        // 3) Cursor glow + per-letter parallax
        const hero = document.querySelector('.hero');
        const glow = document.querySelector('.hero-cursor-glow');
        const letters = mark ? Array.from(mark.querySelectorAll('.letter')) : [];

        if (hero && !prefersReducedMotion) {
            const onMove = (e) => {
                const r = hero.getBoundingClientRect();
                if (e.clientY < r.top || e.clientY > r.bottom) return;
                const x = e.clientX;
                const y = e.clientY;
                if (glow) {
                    glow.style.left = x + 'px';
                    glow.style.top = y + 'px';
                }
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                const dx = (x - cx) / r.width;
                const dy = (y - cy) / r.height;
                letters.forEach((el, i) => {
                    const depth = ((i % 4) + 1) * 2;
                    el.style.transform = `translate3d(${dx * depth}px, ${dy * depth}px, 0)`;
                });
            };
            window.addEventListener('mousemove', onMove, { passive: true });
        }

        // 4) Cycler de frases del subtítulo con crossfade + slide overlap (~300ms)
        //    Visible 3200ms · transición 700ms · saliente y entrante coexisten.
        const subEl = document.getElementById('hero-sub');
        if (subEl) {
            const phrases = Array.from(subEl.querySelectorAll('.sub-phrase'));
            if (phrases.length > 1 && !prefersReducedMotion) {
                let current = 0;
                let running = true;
                const VISIBLE_MS = 3200;
                const OVERLAP_MS = 300;  // entrante empieza 300ms antes que termine la saliente
                const TRANSITION_MS = 700;

                const cycle = () => {
                    if (!running) return;
                    const next = (current + 1) % phrases.length;
                    // Saliente: marcamos is-leaving (mantiene la frase visible mientras se desliza fuera)
                    phrases[current].classList.remove('is-active');
                    phrases[current].classList.add('is-leaving');
                    // Esperar el solapamiento antes de entrar la siguiente
                    setTimeout(() => {
                        phrases[next].classList.add('is-active');
                    }, OVERLAP_MS);
                    // Limpiar la saliente cuando termine su transición
                    setTimeout(() => {
                        phrases[current].classList.remove('is-leaving');
                        current = next;
                    }, TRANSITION_MS);
                };

                let intervalId = setInterval(cycle, VISIBLE_MS);

                // Pausar cuando el hero está fuera del viewport
                const hero = document.querySelector('.hero');
                if (hero && 'IntersectionObserver' in window) {
                    const io = new IntersectionObserver((entries) => {
                        entries.forEach((e) => {
                            const visible = e.isIntersecting && e.intersectionRatio > 0.1;
                            if (visible && !running) {
                                running = true;
                                intervalId = setInterval(cycle, VISIBLE_MS);
                            } else if (!visible && running) {
                                running = false;
                                clearInterval(intervalId);
                            }
                        });
                    }, { threshold: [0, 0.1, 0.25] });
                    io.observe(hero);
                }

                // Pausar también con visibilitychange (pestaña inactiva)
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden && running) {
                        running = false;
                        clearInterval(intervalId);
                    } else if (!document.hidden && !running) {
                        running = true;
                        intervalId = setInterval(cycle, VISIBLE_MS);
                    }
                });
            }
        }
    };

    /* ---------- ARTILLERÍA — split de palabras del manifiesto + reveal + parallax ---------- */
    const initArtilleria = () => {
        const manifesto = document.getElementById('manifesto');
        if (!manifesto) return;

        // 1) Split en .word con --w-i incremental (respeta <em> como una sola word)
        if (!manifesto.dataset.split) {
            manifesto.dataset.split = '1';
            let wIdx = 0;
            const wrapToken = (token) => {
                const span = document.createElement('span');
                span.className = 'word';
                span.style.setProperty('--w-i', wIdx++);
                span.textContent = token;
                return span;
            };
            manifesto.querySelectorAll('.manifesto-line').forEach((line) => {
                const frag = document.createDocumentFragment();
                line.childNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent.split(/(\s+)/).forEach((tok) => {
                            if (!tok) return;
                            if (/^\s+$/.test(tok)) frag.appendChild(document.createTextNode(tok));
                            else frag.appendChild(wrapToken(tok));
                        });
                    } else if (node.nodeName === 'EM') {
                        // <em> entero como una word, manteniendo el tag
                        const span = document.createElement('span');
                        span.className = 'word';
                        span.style.setProperty('--w-i', wIdx++);
                        span.appendChild(node.cloneNode(true));
                        frag.appendChild(span);
                    } else {
                        frag.appendChild(node.cloneNode(true));
                    }
                });
                line.innerHTML = '';
                line.appendChild(frag);
            });
        }

        // 2) Reveal una sola vez al entrar viewport (IntersectionObserver)
        if (prefersReducedMotion) {
            manifesto.classList.add('is-visible');
        } else if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        manifesto.classList.add('is-visible');
                        io.disconnect();
                    }
                });
            }, { threshold: 0.25 });
            io.observe(manifesto);
        } else {
            manifesto.classList.add('is-visible');
        }

        // 3) Parallax sutil ±3px en X según mouse — solo desktop, sin reduced-motion
        const section = manifesto.closest('.artilleria');
        const isDesktop = window.matchMedia('(min-width: 900px)').matches;
        if (!prefersReducedMotion && isDesktop && section) {
            let raf = 0;
            let targetX = 0;
            const apply = () => {
                raf = 0;
                manifesto.querySelectorAll('.word').forEach((w, i) => {
                    const depth = ((i % 3) + 1) * 1;  // 1, 2, 3 px max
                    w.style.setProperty('--px', `${(targetX * depth).toFixed(2)}px`);
                });
            };
            section.addEventListener('mousemove', (e) => {
                const r = section.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                targetX = ((e.clientX - cx) / (r.width / 2)) * 3;  // ±3px
                if (!raf) raf = requestAnimationFrame(apply);
            }, { passive: true });
            section.addEventListener('mouseleave', () => {
                targetX = 0;
                if (!raf) raf = requestAnimationFrame(apply);
            });
        }
    };

    /* ---------- STACK: scroll progress → CSS var --hook-glow ---------- */
    const initStack = () => {
        const section = document.querySelector('.stack-section');
        if (!section) return;

        let raf = 0;
        const update = () => {
            raf = 0;
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const total = rect.height - vh;
            // 0 cuando la sección entra; 1 cuando casi termina
            const scrolled = Math.min(Math.max(-rect.top / total, 0), 1);
            // glow crece en el último 55% del stack
            const glow = Math.max(0, Math.min(1, (scrolled - 0.45) / 0.45));
            section.style.setProperty('--hook-glow', glow.toFixed(3));
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
    };

    /* ---------- SIGNAL (traffic light) ---------- */
    const initSignal = () => {
        const track = document.getElementById('signal-track');
        const stateEl = document.getElementById('signal-state');
        if (!track || !stateEl) return;

        const words = Array.from(track.querySelectorAll('.signal-word'));
        const stateLabel = stateEl.querySelector('.state-label');
        const labels = ['Fase · Hablamos', 'Fase · Construimos', 'Fase · Lanzamos', 'Reiniciando ciclo'];
        const classes = ['red', 'amber', 'green', ''];
        const durations = [1400, 900, 1700, 800];

        let phase = 0;
        let timeoutId = null;

        const applyPhase = () => {
            words.forEach((w, i) => w.classList.toggle('is-active', i === phase));
            stateEl.classList.remove('red', 'amber', 'green');
            if (classes[phase]) stateEl.classList.add(classes[phase]);
            if (stateLabel) stateLabel.textContent = labels[phase];

            if (phase === 3) {
                // Slide-out (CSS decide si translateX desktop o translateY mobile)
                track.classList.remove('is-snap-back');
                track.classList.add('is-leaving');
            } else if (phase === 0) {
                // Snap a la posición opuesta (sin transición) y volver al centro
                track.classList.remove('is-leaving');
                track.classList.add('is-snap-back');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        track.classList.remove('is-snap-back');
                    });
                });
            } else {
                track.classList.remove('is-leaving', 'is-snap-back');
            }
        };

        const tick = () => {
            applyPhase();
            timeoutId = setTimeout(() => {
                phase = (phase + 1) % 4;
                tick();
            }, durations[phase]);
        };

        if (prefersReducedMotion) {
            // Mostrar las 3 palabras encendidas estáticas (verde como estado final)
            words.forEach((w) => w.classList.add('is-active'));
            if (stateLabel) stateLabel.textContent = labels[2];
            stateEl.classList.add('green');
            return;
        }

        tick();

        // Pausar cuando la pestaña no está activa
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
            } else if (!timeoutId) {
                tick();
            }
        });
    };

    /* ---------- Iberofinance carousel — cursor falso + click + image swap ----------
       Timeline: moving 1100ms → acting 350ms → showing+holding 2400ms → next step.
       La imagen NO cambia hasta que el cursor "actúa" (causa-efecto).
    */
    const initIberofinanceCarousel = () => {
        const root = document.getElementById('iberofinance-carousel');
        if (!root) return;

        const STEPS = [
            { x: 0.245, y: 0.022, label: 'Painel',           action: 'click'  },
            { x: 0.305, y: 0.022, label: 'Carteira',         action: 'click'  },
            { x: 0.52,  y: 0.62,  label: 'Explorar activos', action: 'scroll' },
            { x: 0.395, y: 0.022, label: 'Fluxo de caixa',   action: 'click'  },
            { x: 0.555, y: 0.022, label: 'Robôs',            action: 'click'  },
            { x: 0.625, y: 0.022, label: 'Simulação',        action: 'click'  }
        ];

        const imgs = Array.from(root.querySelectorAll('.carousel-img'));
        const dots = Array.from(root.querySelectorAll('.pdot'));
        const cursor = root.querySelector('.fake-cursor');
        const label = root.querySelector('.cursor-label');
        if (!imgs.length || !cursor) return;

        let step = 0;
        let timeouts = [];
        let active = false;

        const clearTimeouts = () => {
            timeouts.forEach((t) => clearTimeout(t));
            timeouts = [];
        };

        const setActiveImage = (idx) => {
            imgs.forEach((img, i) => img.classList.toggle('is-active', i === idx));
            dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
        };

        const setPhase = (phase, isClick) => {
            cursor.classList.toggle('is-moving', phase === 'moving');
            cursor.classList.toggle('is-acting', phase === 'acting');
            cursor.classList.toggle('is-showing', phase === 'showing');
            cursor.classList.toggle('is-click',  phase === 'acting' && isClick);
            cursor.classList.toggle('is-scroll', phase === 'acting' && !isClick);
        };

        const runStep = () => {
            if (!active) return;
            const cur = STEPS[step];
            const prevIdx = (step - 1 + STEPS.length) % STEPS.length;
            const isClick = cur.action === 'click';

            // Mostrar imagen anterior mientras el cursor se mueve
            setActiveImage(prevIdx);
            if (label) label.textContent = cur.label;

            // Posicionar cursor → target (CSS transition se encarga del movimiento)
            cursor.style.left = (cur.x * 100) + '%';
            cursor.style.top  = (cur.y * 100) + '%';
            setPhase('moving', isClick);

            // 1100ms: moving completo, ahora "actúa"
            timeouts.push(setTimeout(() => {
                if (!active) return;
                setPhase('acting', isClick);

                // Re-disparar la animación del ripple si fue click (clone-replace para reiniciar la animación)
                if (isClick) {
                    const ripple = cursor.querySelector('.ripple');
                    if (ripple) {
                        const clone = ripple.cloneNode(true);
                        ripple.parentNode.replaceChild(clone, ripple);
                    }
                }
            }, 1100));

            // 1450ms (1100 moving + 350 acting): swap a la imagen del paso actual
            timeouts.push(setTimeout(() => {
                if (!active) return;
                setActiveImage(step);
                setPhase('showing', isClick);
            }, 1450));

            // 3850ms total: pasar al siguiente paso
            timeouts.push(setTimeout(() => {
                if (!active) return;
                step = (step + 1) % STEPS.length;
                runStep();
            }, 3850));
        };

        const startCarousel = () => {
            if (active) return;
            active = true;
            runStep();
        };
        const stopCarousel = () => {
            active = false;
            clearTimeouts();
        };

        // Estado inicial: cursor en target del paso 0, imagen 0 visible.
        cursor.style.left = (STEPS[0].x * 100) + '%';
        cursor.style.top  = (STEPS[0].y * 100) + '%';
        setActiveImage(0);
        if (label) label.textContent = STEPS[0].label;

        if (prefersReducedMotion) {
            // Sólo crossfade entre imágenes, sin cursor
            cursor.style.display = 'none';
            let i = 0;
            setInterval(() => {
                i = (i + 1) % imgs.length;
                setActiveImage(i);
            }, 4000);
            return;
        }

        // Pausar cuando el card está fuera del viewport
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting && e.intersectionRatio > 0.15) startCarousel();
                    else stopCarousel();
                });
            }, { threshold: [0, 0.15, 0.5] });
            io.observe(root);
        } else {
            startCarousel();
        }

        // Pausar con pestaña inactiva
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopCarousel();
            else startCarousel();
        });
    };

    /* ---------- Manifiesto del fundador — stagger reveal (una sola vez) ---------- */
    const initFundadorReveal = () => {
        const frases = document.querySelectorAll('.manifesto-frase');
        if (!frases.length) return;

        frases.forEach((el, i) => el.style.setProperty('--i', i));

        if (prefersReducedMotion) {
            frases.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        if (!('IntersectionObserver' in window)) {
            frases.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    frases.forEach((el) => el.classList.add('is-visible'));
                    io.disconnect();
                }
            });
        }, { threshold: 0.2 });

        // Observa la sección entera para disparar todas las frases juntas (stagger via CSS delay)
        const section = document.querySelector('.fundador');
        io.observe(section || frases[0]);
    };

    /* ---------- HOOK filename rotator ---------- */
    const initHookFilename = () => {
        const el = document.getElementById('hook-filename');
        if (!el || prefersReducedMotion) return;
        const names = ['tu_idea.txt', 'mvp_inacabado.fig', 'producto_que_escala.md', 'tu_proyecto.brief'];
        let i = 0;
        setInterval(() => {
            i = (i + 1) % names.length;
            el.textContent = names[i];
        }, 3200);
    };

    /* ---------- Boot ---------- */
    const start = () => {
        initHero();
        initArtilleria();
        initStack();
        initSignal();
        initHookFilename();
        initIberofinanceCarousel();
        initFundadorReveal();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
