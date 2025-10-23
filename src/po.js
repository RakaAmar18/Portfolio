    // ==================== LOADING SCREEN ====================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loadingScreen')?.classList.add('hidden');
  }, 800);
});

// ==================== THEME TOGGLE ====================
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

// ==================== PARTICLES ====================
function createParticles() {
  const c = document.getElementById('particles');
  if (!c) return;
  try {
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
  } catch (e) {
    console.error('Particle error:', e);
  }
}

// ==================== MENU ====================
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileNav');
const ovr = document.getElementById('mobileOverlay');

function toggleMenu() {
  const isActive = ham?.classList.contains('active');
  if (isActive) {
    ham?.classList.remove('active');
    mob?.classList.remove('active');
    ovr?.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    ham?.classList.add('active');
    mob?.classList.add('active');
    ovr?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMenu() {
  ham?.classList.remove('active');
  mob?.classList.remove('active');
  ovr?.classList.remove('active');
  document.body.style.overflow = '';
}

// buka/tutup menu
ham?.addEventListener('click', toggleMenu);
ham?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleMenu();
  }
});

// klik overlay → tutup menu
ovr?.addEventListener('click', closeMenu);

// klik link di menu mobile → scroll ke section (event delegation)
const mobileNav = document.getElementById('mobileNav');
if (mobileNav) {
  mobileNav.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    e.preventDefault();
    
    const href = link.getAttribute('href');
    if (!href.startsWith('#')) return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    closeMenu();
    
    setTimeout(() => {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }, 350);
  });
}


// ==================== SLIDER ====================
let cur = 0,
  tot = 0,
  perSlide = 2;
const sl = document.getElementById('projectSlider');
const prev = document.getElementById('prevBtn');
const next = document.getElementById('nextBtn');
const dots = document.getElementById('sliderDots');
const projs = document.querySelectorAll('.project');

function initSlider() {
  if (!sl || !projs.length) return;
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
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    if (i === 0) d.classList.add('active');
    d.addEventListener('click', () => goToSlide(i));
    dots.appendChild(d);
  }
}

function updateDots() {
  const d = document.querySelectorAll('.slider-dot');
  d.forEach((dot, i) => {
    const a = i === cur;
    dot.classList.toggle('active', a);
    dot.setAttribute('aria-selected', a ? 'true' : 'false');
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
  updateBtns();
}

function updateBtns() {
  if (!prev || !next) return;
  prev.disabled = cur === 0;
  next.disabled = cur >= tot - 1;
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

// Touch support
let sx = 0,
  sy = 0,
  drag = false;

if (sl) {
  sl.addEventListener('touchstart', e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    drag = true;
  });

  sl.addEventListener(
    'touchmove',
    e => {
      if (!drag) return;
      e.preventDefault();
    },
    { passive: false }
  );

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

// ==================== SCROLL INDICATOR ====================
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

  sci.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ==================== CONTACT FORM ====================
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

// ==================== INTERSECTION OBSERVER ====================
let obs = null;
try {
  obs = new IntersectionObserver(
    ent => {
      ent.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.1 }
  );

  projs.forEach(p => obs.observe(p));
} catch (e) {
  console.error('Observer error:', e);
  projs.forEach(p => p.classList.add('visible'));
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  setTimeout(() => initSlider(), 100);
});

// ==================== SMOOTH SCROLL (DESKTOP NAV) ====================
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

// ==================== COPY EMAIL ====================
const emailElement = document.querySelector('.profile .card:nth-child(3) .value');
if (emailElement) {
  emailElement.style.cursor = 'pointer';
  emailElement.title = 'Klik untuk copy email';
  emailElement.addEventListener('click', () => {
    const emailText = emailElement.textContent.trim();
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(emailText)
        .then(() => {
          const originalText = emailElement.textContent;
          emailElement.textContent = 'Email copied! ✓';
          setTimeout(() => (emailElement.textContent = originalText), 2000);
        })
        .catch(() => {});
    }
  });
}
