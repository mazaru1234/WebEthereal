document.addEventListener('DOMContentLoaded', () => {
  initBgVideo();
  initNav();
  initContactForm();
  initScrollReveal();
  initScrollProgress();
  initHeaderScroll();
  initCounters();
  initBottomNav();
  initWorkDots();
});

function initBgVideo() {
  const shell = document.querySelector('.bg-video');
  const video = document.querySelector('.bg-video__el');
  if (!video || !shell) return;

  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');

  const markPlaying = () => {
    shell.classList.add('is-playing');
    video.removeAttribute('poster');
  };

  const play = () => {
    const p = video.play();
    if (p && typeof p.then === 'function') {
      p.then(markPlaying).catch(() => {});
    }
  };

  video.addEventListener('playing', markPlaying, { once: true });
  video.addEventListener('loadeddata', play, { once: true });
  video.addEventListener('canplay', play, { once: true });

  if (video.readyState >= 2) play();
  else play();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) play();
  });

  document.addEventListener('pointerdown', play, { once: true, passive: true });
}

function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    drawer?.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    drawer?.setAttribute('aria-hidden', String(!open));
  });

  drawer?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      drawer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn?.classList.add('loading');
    btn?.setAttribute('disabled', 'true');

    setTimeout(() => {
      form.reset();
      btn?.classList.remove('loading');
      btn?.removeAttribute('disabled');
      showToast('Request sent! We\'ll get back to you soon.');
    }, 1200);
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
}

function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('.reveal, .service-card, .work-card, .process-step, .testimonial-card, .metric-card, .stack-card');

  if (prefersReduced) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
  );

  els.forEach(el => observer.observe(el));
}

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.setProperty('--progress', `${progress}%`);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('header-scrolled', y > 20);

      if (y > 120 && y > lastY + 8) {
        header.classList.add('header-hidden');
      } else if (y < lastY - 8) {
        header.classList.remove('header-hidden');
      }

      lastY = y;
      ticking = false;
    });
  }, { passive: true });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    const step = now => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

function initBottomNav() {
  if (window.matchMedia('(min-width: 1024px)').matches) return;

  const items = document.querySelectorAll('.bottom-nav-item');
  const sections = ['top', 'services', 'work', 'contact'];

  const sectionEls = sections.map(id => {
    if (id === 'top') return document.getElementById('top');
    return document.getElementById(id);
  }).filter(Boolean);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id || 'top';
          items.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-section') === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -45% 0px', threshold: 0 }
  );

  sectionEls.forEach(el => observer.observe(el));
}

function initWorkDots() {
  if (window.matchMedia('(min-width: 1024px)').matches) return;

  const scroll = document.getElementById('workScroll');
  const dotsContainer = document.getElementById('workDots');
  if (!scroll || !dotsContainer) return;

  const cards = scroll.querySelectorAll('.work-card');
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'work-dot' + (i === 0 ? ' active' : '');
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.work-dot');

  scroll.addEventListener('scroll', () => {
    const cardWidth = cards[0]?.offsetWidth || 280;
    const gap = 14;
    const index = Math.round(scroll.scrollLeft / (cardWidth + gap));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }, { passive: true });
}
