(() => {
    'use strict';
    const d = window.PORTFOLIO || {};
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));

    const safeUrl = s => {
        if (!s) return '';
        try {
            const u = new URL(s, location.href);
            return ['http:', 'https:', 'mailto:'].includes(u.protocol) ? u.href : '';
        } catch {
            return '';
        }
    };

    const link = (url, label, klass = 'btn btn-outline') =>
        url ? `<a class="${klass}" href="${escape(safeUrl(url))}" ${url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>` : '';

    // Data binding
    $$('[data-name]').forEach(el => el.textContent = d.name || 'Amar');

    $$('[data-email]').forEach(el => {
        if (d.email) {
            el.href = 'mailto:' + d.email;
            el.textContent = d.email;
        } else {
            el.removeAttribute('href');
            el.textContent = 'Email: add in data.js';
        }
    });

    $$('[data-social]').forEach(el => {
        const url = d[el.dataset.social];
        if (url) el.href = safeUrl(url);
        else el.hidden = true;
    });

    $$('[data-resume]').forEach(el => {
        if (d.resume) el.href = safeUrl(d.resume);
        else el.hidden = true;
    });

    // Profile Photo Loader
    const photo = $('#profile-photo');
    if (photo) {
        photo.src = d.photo || 'assets/profile.jpg';
        photo.onerror = () => {
            photo.hidden = true;
            const ph = $('#photo-placeholder');
            if (ph) ph.hidden = false;
        };
        photo.onload = () => {
            photo.hidden = false;
            const ph = $('#photo-placeholder');
            if (ph) ph.hidden = true;
        };
    }

    // Navigation Menu Toggle (Mobile)
    const menu = $('.menu-btn');
    const nav = $('.nav-links');
    menu?.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        menu.setAttribute('aria-expanded', String(open));
        menu.textContent = open ? '✕' : '☰';
    });

    // Active Navigation Link
    $$('.nav-links a').forEach(a => {
        const cur = location.pathname.split('/').pop();
        if (cur === a.getAttribute('href') || (!cur && a.getAttribute('href') === 'index.html')) {
            a.classList.add('active');
        }
    });

    // ================= AUDIO SFX (PERSISTENT & FIXED) =================
    let ctx = null;
    // Remember sound state across all pages:
    let sound = localStorage.getItem('amar_portfolio_audio') === 'true';

    const soundBtn = $('.sound-btn');
    if (soundBtn) {
        soundBtn.textContent = sound ? '♫ AUDIO ON' : '♫ AUDIO OFF';
        soundBtn.setAttribute('aria-pressed', String(sound));
    }

    function beep(freq = 560, duration = 0.08) {
        if (!sound) return;
        try {
            ctx ??= new (window.AudioContext || window.webkitAudioContext)();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = 'sine';
            o.frequency.setValueAtTime(freq, ctx.currentTime);
            o.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + duration * 0.6);
            
            // Audible and pleasant volume level
            g.gain.setValueAtTime(0.08, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            
            o.start();
            o.stop(ctx.currentTime + duration + 0.01);
        } catch (e) {
            console.warn('Audio not allowed yet', e);
        }
    }

    soundBtn?.addEventListener('click', () => {
        sound = !sound;
        localStorage.setItem('amar_portfolio_audio', String(sound));
        soundBtn.textContent = sound ? '♫ AUDIO ON' : '♫ AUDIO OFF';
        soundBtn.setAttribute('aria-pressed', String(sound));
        if (sound) {
            beep(640, 0.1);
        }
    });

    document.addEventListener('click', e => {
        // Play beep on buttons/links except the sound toggle itself
        if (e.target.closest('a, button:not(.sound-btn)')) {
            beep(520, 0.07);
        }
    });
    // =================================================================

    // Cyber Cursor & 3D Tilt
    if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const ring = document.createElement('div');
        const dot = document.createElement('div');
        ring.className = 'cyber-cursor';
        dot.className = 'cyber-dot';
        document.body.append(ring, dot);

        let mx = -100, my = -100, x = -100, y = -100;
        addEventListener('pointermove', e => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
            ring.classList.toggle('hover', !!e.target.closest('a,button,input,textarea,.card'));
        }, { passive: true });

        function animate() {
            x += (mx - x) * 0.18;
            y += (my - y) * 0.18;
            ring.style.left = x + 'px';
            ring.style.top = y + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        $$('.tilt').forEach(card => {
            card.addEventListener('pointermove', e => {
                const r = card.getBoundingClientRect();
                const cx = (e.clientX - r.left) / r.width - 0.5;
                const cy = (e.clientY - r.top) / r.height - 0.5;
                card.style.setProperty('--glow-x', ((cx + 0.5) * 100) + '%');
                card.style.setProperty('--glow-y', ((cy + 0.5) * 100) + '%');
                card.style.transform = `perspective(900px) rotateX(${-cy * 22}deg) rotateY(${cx * 22}deg) translateZ(20px) scale(1.045)`;
            });
            card.addEventListener('pointerleave', () => card.style.transform = '');
        });

        const ice = $('.ice-name-inner');
        ice?.addEventListener('pointermove', e => {
            const r = ice.getBoundingClientRect();
            const cx = (e.clientX - r.left) / r.width - 0.5;
            const cy = (e.clientY - r.top) / r.height - 0.5;
            ice.style.transform = `rotateX(${-cy * 19}deg) rotateY(${cx * 25}deg)`;
        });
        ice?.addEventListener('pointerleave', () => ice.style.transform = '');
    }

    // Skills Renderer with Cyber Cards and Icons
    const skillHost = $('#skill-groups');
    if (skillHost && d.skills) {
        const icons = {
            'Web development': '🌐',
            'Programming': '💻',
            'Data analytics': '📊',
            'Cybersecurity': '🛡️',
            'Career interest': '🎯',
            'Computer science': '🧠',
            'Developer tools': '⚡',
            'Tools': '🛠️'
        };
        const groups = [...new Set(d.skills.map(s => s.group))];
        skillHost.innerHTML = groups.map(g => `
            <div class="card depth-card tilt skill-group">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
                    <span class="card-icon" style="width:42px;height:42px;font-size:1.25rem">${icons[g] || '✦'}</span>
                    <h3 style="margin:0;font-size:1.2rem">${escape(g)}</h3>
                </div>
                <div class="skill-list">
                    ${d.skills.filter(s => s.group === g).map(s => `
                        <div class="skill-chip">
                            ${escape(s.name)}
                            <small>${escape(s.level)}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Projects Renderer
    const projectHost = $('#project-grid');
    function renderProjects(filter = 'all') {
        if (!projectHost) return;
        const items = (d.projects || []).filter(x => filter === 'all' || x.category === filter);
        projectHost.innerHTML = items.map(x => `
            <article class="card project-card tilt depth-card">
                <div class="project-art" aria-hidden="true">${{ 'web': '⌘', 'games': '✧', 'data': '▥', 'security': '◇' }[x.category] || '✦'}</div>
                <p class="status ${x.status === 'Planned' ? 'planned' : ''}">${escape(x.status)}</p>
                <h3>${escape(x.title)}</h3>
                <p>${escape(x.description)}</p>
                <div class="tags">${(x.tags || []).map(t => `<span class="tag">${escape(t)}</span>`).join('')}</div>
                <div class="project-footer">
                    ${link(x.demo, '↗ Live demo')}
                    ${link(x.source, '⌘ Source')}
                    ${!x.demo && !x.source ? '<span class="muted">Links coming when ready</span>' : ''}
                </div>
            </article>
        `).join('') || '<p>No projects in this category yet.</p>';
    }

    $$('.filter').forEach(b => b.addEventListener('click', () => {
        $$('.filter').forEach(x => {
            x.classList.remove('active');
            x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
        renderProjects(b.dataset.filter);
    }));
    renderProjects();

    projectHost?.addEventListener('pointermove', e => {
        const card = e.target.closest('.project-card');
        if (!card || !matchMedia('(pointer:fine)').matches) return;
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-cy * 16}deg) rotateY(${cx * 16}deg) translateZ(12px) scale(1.025)`;
    });

    projectHost?.addEventListener('pointerout', e => {
        const card = e.target.closest('.project-card');
        if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
    });

    // Hacker Terminal
    const terminal = $('#terminal-input');
    const log = $('#terminal-log');
    terminal?.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const cmd = terminal.value.trim().toLowerCase();
        terminal.value = '';
        if (!cmd) return;
        if (cmd === 'clear' || cmd === 'cls') {
            log.textContent = '';
            return;
        }

        const answers = {
            help: 'Available commands:\n• about    - Learn about Amar\n• skills   - Technical competencies\n• projects - Key portfolio builds\n• neofetch - System & student specs\n• whoami   - User identity\n• sudo     - Admin privileges\n• social   - Online profile links\n• clear    - Clean terminal screen',
            about: `${d.name} — ${d.tagline}.\nBCA student at IGNOU exploring Data Analytics and Defensive Cybersecurity.`,
            skills: (d.skills || []).map(s => `  [+] ${s.name.padEnd(22)} | ${s.level}`).join('\n'),
            projects: (d.projects || []).map(p => `  • [${p.category.toUpperCase()}] ${p.title} (${p.status})`).join('\n'),
            whoami: 'visitor@amar-portfolio (Access: Guest / Future Recruiter)',
            sudo: 'Permission denied: Amar retains root privileges.',
            neofetch: `
   /\\       OS: Cyber-Portfolio Linux v4.0
  /  \\      HOST: BCA @ IGNOU (New Delhi)
 / /\\ \\     FOCUS: Data Analytics & Cybersecurity
/ /__\\ \\    LANGS: Python, C/C++, JavaScript, SQL
\\/____\\/    STATUS: Open to Internships & Projects`,
            social: `GitHub:    ${d.github || 'N/A'}\nInstagram: ${d.instagram || 'N/A'}\nEmail:     ${d.email || 'N/A'}`
        };

        const entry = document.createElement('div');
        entry.style.marginBottom = '12px';
        entry.textContent = `guest@amar:~$ ${cmd}\n${answers[cmd] || 'Unknown command. Type help.'}`;
        log.append(entry);
        log.scrollTop = log.scrollHeight;
        beep(700, 0.05);
    });

    // Contact Form
    const form = $('#contact-form');
    form?.addEventListener('submit', e => {
        e.preventDefault();
        const status = $('#form-status');
        if (!d.email) {
            status.textContent = 'Add your professional email in data.js to enable sending.';
            return;
        }
        const name = $('#sender-name').value.trim();
        const email = $('#sender-email').value.trim();
        const message = $('#sender-message').value.trim();
        if (!name || !email || !message) return;
        const subject = encodeURIComponent('Portfolio inquiry from ' + name);
        const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
        location.href = `mailto:${encodeURIComponent(d.email)}?subject=${subject}&body=${body}`;
        status.textContent = 'Opening your email client... If it does not open, use the Copy Email button above!';
    });

    // Copy Email Button
    $('#copy-email-btn')?.addEventListener('click', e => {
        navigator.clipboard.writeText(d.email || 'amar20180041470@gmail.com');
        const btn = e.currentTarget;
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = '📋 Copy Email'; }, 2000);
        beep(800, 0.08);
    });

})();