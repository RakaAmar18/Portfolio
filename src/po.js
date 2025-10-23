    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loadingScreen')?.classList.add('hidden');
      }, 800);
    });

    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const theme = localStorage.getItem('theme') || 'dark';

    if (theme === 'light') {
      document.body.classList.add('light-mode');
      themeIcon.textContent = '☀️';
    } else {
      themeIcon.textContent = '🌙';
    }

    themeToggle?.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      themeIcon.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    function createParticles() {
      const c = document.getElementById('particles');
      if (!c) return;
      c.innerHTML = '';
      for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const sizes = ['small', 'medium', 'large'];
        p.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = Math.random() * 15 + 10 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        c.appendChild(p);
      }
    }

    let cur = 0, tot = 0, perSlide = 2;
    const sl = document.getElementById('projectSlider');
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    const dots = document.getElementById('sliderDots');
    const projs = document.querySelectorAll('.project');

    function initSlider() {
      if (!sl || !projs.length) return;
      const screenWidth = window.innerWidth;
      perSlide = screenWidth < 768 ? 1 : 2;
      cur = 0;
      tot = Math.ceil(projs.length / perSlide);
      createDots();
      updateSlider();
    }

    function createDots() {
      if (!dots) return;
      dots.innerHTML = '';
      for (let i = 0; i < tot; i++) {
        const d = document.createElement('button');
        d.className = 'slider-dot';
        d.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) d.classList.add('active');
        d.addEventListener('click', () => goToSlide(i));
        dots.appendChild(d);
      }
    }

    function updateDots() {
      document.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === cur);
      });
    }

    function updateSlider() {
      if (!sl) return;
      const w = projs[0]?.offsetWidth || 320;
      const g = 20;
      const sw = w * perSlide + g * (perSlide - 1);
      const tx = -cur * sw;
      sl.style.transform = `translateX(${tx}px)`;
      updateDots();
      if (prev && next) {
        prev.disabled = cur === 0;
        next.disabled = cur >= tot - 1;
      }
    }

    function goToSlide(i) {
      if (i >= 0 && i < tot) {
        cur = i;
        updateSlider();
      }
    }

    function nextSlide() {
      if (cur < tot - 1) {
        cur++;
        updateSlider();
      }
    }

    function prevSlide() {
      if (cur > 0) {
        cur--;
        updateSlider();
      }
    }

    prev?.addEventListener('click', prevSlide);
    next?.addEventListener('click', nextSlide);

    let sx = 0, drag = false;
    if (sl) {
      sl.addEventListener('touchstart', e => {
        sx = e.touches[0].clientX;
        drag = true;
      });
      sl.addEventListener('touchmove', e => {
        if (drag) e.preventDefault();
      }, { passive: false });
      sl.addEventListener('touchend', e => {
        if (!drag) return;
        const ex = e.changedTouches[0].clientX;
        const dx = sx - ex;
        if (Math.abs(dx) > 50) {
          if (dx > 0) nextSlide();
          else prevSlide();
        }
        drag = false;
      });
    }

    let rto;
    window.addEventListener('resize', () => {
      clearTimeout(rto);
      rto = setTimeout(() => initSlider(), 150);
    });

    const sci = document.getElementById('scrollIndicator');
    if (sci) {
      let sto;
      window.addEventListener('scroll', () => {
        if (sto) return;
        sto = setTimeout(() => {
          if (window.scrollY > 300) sci.classList.add('visible');
          else sci.classList.remove('visible');
          sto = null;
        }, 16);
      });
      sci.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const form = document.getElementById('contactForm');
    const msg = document.getElementById('formMessage');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const n = document.getElementById('nama')?.value || '';
        const em = document.getElementById('email')?.value || '';
        const pe = document.getElementById('pesan')?.value || '';

        if (!n.trim() || !em.trim() || !pe.trim()) {
          msg.className = 'form-message error';
          msg.textContent = '⚠️ Mohon lengkapi semua field.';
          return;
        }

        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<span>Mengirim...</span>';

        setTimeout(() => {
          msg.className = 'form-message success';
          msg.textContent = '✓ Pesan berhasil dikirim!';
          btn.disabled = false;
          btn.innerHTML = '<span>Kirim Pesan</span>';
          form.reset();
          setTimeout(() => {
            msg.textContent = '';
            msg.className = '';
          }, 5000);
        }, 1500);
      });
    }

    const obs = new IntersectionObserver(ent => {
      ent.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    projs.forEach(p => obs.observe(p));

    document.addEventListener('DOMContentLoaded', () => {
      createParticles();
      setTimeout(() => initSlider(), 100);
    });

    document.querySelectorAll('header nav a[href^="#"]').forEach(a => {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) {
          const headerHeight = document.querySelector('header')?.offsetHeight || 80;
          const pos = t.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });

    const emailElement = document.querySelector('.profile .card:nth-child(3) .value');
    if (emailElement) {
      emailElement.addEventListener('click', () => {
        const emailText = emailElement.textContent.trim();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(emailText).then(() => {
            const originalText = emailElement.textContent;
            emailElement.textContent = 'Email copied! ✓';
            setTimeout(() => (emailElement.textContent = originalText), 2000);
          }).catch(() => {});
        }
      });
    }
