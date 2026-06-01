document.addEventListener('DOMContentLoaded', () => {
  initBgVideo();
  initSidebarHighlight();
  initTocHighlight();
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

function initSidebarHighlight() {
  const links = document.querySelectorAll('.sidebar-link');
  const sections = [];

  links.forEach(link => {
    const id = link.getAttribute('href')?.slice(1);
    if (id) {
      const el = document.getElementById(id);
      if (el) sections.push({ el, link });
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const match = sections.find(s => s.el === entry.target);
          if (match) match.link.classList.add('active');
        }
      });
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach(s => observer.observe(s.el));
}

function initTocHighlight() {
  const tocLinks = document.querySelectorAll('.docs-toc a');
  if (!tocLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
  );

  document.querySelectorAll('.docs-content section[id]').forEach(s => observer.observe(s));
}
