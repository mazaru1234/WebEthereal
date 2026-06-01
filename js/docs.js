document.addEventListener('DOMContentLoaded', () => {
  initBgVideo();
  initSidebarHighlight();
  initTocHighlight();
});

function initBgVideo() {
  const video = document.querySelector('.bg-video__el');
  if (!video) return;
  video.muted = true;
  const play = () => video.play().catch(() => {});
  play();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) play();
  });
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
