const WE_PLANS = [
  {
    id: 'landing',
    label: 'Landing',
    popular: true,
    price: '100$–1000$',
    title: 'Landing',
    timeline: '2hour – 1day',
    includes: [
      'Main screen',
      'Service description',
      'Benefits',
      'Reviews',
      'Lead form',
      'Responsive layout',
      'Basic SEO',
    ],
    note: 'depending on the complexity',
    process: [
      { step: 'BRIEF', time: '≈ 15m' },
      { step: 'DESIGN', time: '≈ 30m' },
      { step: 'DEVELOPMENT', time: '≈ 45m' },
      { step: 'LAUNCH', time: '≈ 30m' },
    ],
    minNote: 'minimum term',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    price: '300$–2500$',
    title: 'Corporate',
    timeline: '1day – 1.5week',
    includes: [
      'Home page',
      'About company',
      'Services',
      'Contacts',
      'Blog',
      'Contact form',
      'Admin panel',
    ],
    note: 'depending on the complexity',
    process: [
      { step: 'BRIEF', time: '≈ 3h' },
      { step: 'DESIGN', time: '≈ 8h' },
      { step: 'DEVELOPMENT', time: '≈ 9h' },
      { step: 'LAUNCH', time: '≈ 4h' },
    ],
    minNote: 'minimum term',
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    price: '500$–7500$',
    title: 'E-Commerce',
    timeline: '3day – 3week',
    includes: [
      'Product catalog',
      'Product pages',
      'Cart',
      'Online payments',
      'User account',
      'Admin panel',
      'Delivery integration',
    ],
    note: 'depending on the complexity',
    process: [
      { step: 'BRIEF', time: '≈ 8h' },
      { step: 'DESIGN', time: '≈ 1d' },
      { step: 'DEVELOPMENT', time: '≈ 1d 10h' },
      { step: 'LAUNCH', time: '≈ 6h' },
    ],
    minNote: 'minimum term',
  },
  {
    id: 'telegram-bot',
    label: 'TG Bot',
    price: '100$–1500$',
    title: 'Telegram Bots',
    timeline: '2hour – 3day',
    includes: [
      'Commands',
      'Menu',
      'Database',
      'Payments',
      'Notifications',
      'API integrations',
    ],
    note: 'depending on the complexity',
    process: [
      { step: 'BRIEF', time: '≈ 30m' },
      { step: 'DESIGN', time: '≈ 30m' },
      { step: 'DEVELOPMENT', time: '≈ 45m' },
      { step: 'LAUNCH', time: '≈ 15m' },
    ],
    minNote: 'minimum term',
  },
  {
    id: 'telegram-mini',
    label: 'TG Mini Apps',
    price: '500$–4500$',
    title: 'Telegram Mini Apps',
    timeline: '3day – 3week',
    includes: [
      'Telegram auth',
      'User account',
      'Database',
      'API',
      'Admin panel',
      'Payments',
    ],
    note: 'depending on the complexity',
    process: [
      { step: 'BRIEF', time: '≈ 8h' },
      { step: 'DESIGN', time: '≈ 1d' },
      { step: 'DEVELOPMENT', time: '≈ 1d 10h' },
      { step: 'LAUNCH', time: '≈ 6h' },
    ],
    minNote: 'minimum term',
  },
  {
    id: 'webapps',
    label: 'Web Apps',
    price: '1000$–10000$',
    title: 'Web Applications',
    timeline: '3week – 1month',
    includes: [
      'Personal account',
      'Database',
      'API',
      'Admin panel',
      'Role system',
      'Integrations',
    ],
    note: 'depending on the complexity',
    process: [
      { step: 'BRIEF', time: '≈ 3d' },
      { step: 'DESIGN', time: '≈ 1w' },
      { step: 'DEVELOPMENT', time: '≈ 1w' },
      { step: 'LAUNCH', time: '≈ 4d' },
    ],
    minNote: 'minimum term',
  },
];

function renderPlanCard(plan) {
  const includes = plan.includes.map((item) => `<li>${item}</li>`).join('');
  const steps = plan.process
    .map((p) => `<div class="plan-process-row"><span>${p.step}</span><span>${p.time}</span></div>`)
    .join('');

  return `
    <article class="plan-detail-card" data-plan-panel="${plan.id}" hidden>
      ${plan.popular ? '<span class="plan-detail-badge">Popular</span>' : ''}
      <p class="plan-detail-price">${plan.price}</p>
      <h3 class="plan-detail-title">${plan.title}</h3>
      <p class="plan-detail-timeline">${plan.timeline}</p>
      <h4 class="plan-detail-sub">What&apos;s included</h4>
      <ul class="plan-detail-list">${includes}</ul>
      <p class="plan-detail-note">(${plan.note})</p>
      <div class="plan-process">${steps}</div>
      <p class="plan-detail-note">(${plan.minNote})</p>
      <a href="https://t.me/MrJShTg" target="_blank" rel="noopener noreferrer" class="plan-detail-cta">Get a Quote</a>
    </article>
  `;
}

function initPlansPicker() {
  const root = document.getElementById('plansPicker');
  if (!root || !WE_PLANS.length) return;

  const nav = WE_PLANS.map(
    (p, i) =>
      `<button type="button" class="plan-tab${p.popular ? ' plan-tab--hot' : ''}" data-plan-tab="${p.id}" aria-selected="${i === 0}">${p.label}</button>`
  ).join('');

  const panels = WE_PLANS.map((p, i) => {
    const html = renderPlanCard(p);
    return i === 0 ? html.replace(' hidden', '') : html;
  }).join('');

  root.innerHTML = `
    <div class="plans-picker">
      <nav class="plan-tabs" aria-label="Service plans">${nav}</nav>
      <div class="plan-panels">${panels}</div>
    </div>
  `;

  const tabs = root.querySelectorAll('[data-plan-tab]');
  const cards = root.querySelectorAll('[data-plan-panel]');

  function show(id) {
    tabs.forEach((t) => t.setAttribute('aria-selected', t.dataset.planTab === id ? 'true' : 'false'));
    cards.forEach((c) => {
      c.hidden = c.dataset.planPanel !== id;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => show(tab.dataset.planTab));
  });

  const hash = location.hash.replace('#', '');
  const fromHash = WE_PLANS.find((p) => p.id === hash);
  show(fromHash ? fromHash.id : WE_PLANS[0].id);
}

document.addEventListener('DOMContentLoaded', initPlansPicker);
