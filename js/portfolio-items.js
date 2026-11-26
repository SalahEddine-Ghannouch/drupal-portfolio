(function () {
  'use strict';

  const collections = [
    'projects',
    'expertise',
    'experience',
    'open_source',
    'certifications',
    'testimonials',
  ];
  const language = () => document.documentElement.lang === 'fr' ? 'fr' : 'en';
  const text = (value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return String(value[language()] || value.en || '');
    }
    return value == null ? '' : String(value);
  };
  const list = (value) => Array.isArray(value) ? value.map(String) : [];
  const safeUrl = (value) => /^(https?:\/\/|mailto:)/i.test(String(value || '').trim())
    ? String(value).trim()
    : '';
  const element = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value != null) node.textContent = String(value);
    return node;
  };
  const setLink = (node, url) => {
    const href = safeUrl(url);
    if (href) {
      node.href = href;
      node.target = '_blank';
      node.rel = 'noopener noreferrer';
    } else {
      node.removeAttribute('href');
    }
  };

  const renderProject = (item, index) => {
    const data = item.content || {};
    const article = element('article', 'project reveal' + (index % 2 ? ' project-reverse' : ''));
    const media = element('a', 'project-media');
    setLink(media, data.url);
    media.setAttribute('aria-label', text(data.aria) || text(data.title));
    const thumb = element('div', 'project-thumb thumb-' + (index % 4 + 1));
    const browserBar = element('div', 'browser-bar');
    const dots = element('span', 'browser-dots');
    for (let dot = 0; dot < 3; dot += 1) dots.appendChild(document.createElement('i'));
    browserBar.append(dots, element('span', 'browser-url', data.domain));
    const screen = element('div', 'browser-screen');
    screen.append(
      element('span', 'browser-mono', data.brand),
      element('span', 'thumb-chip', data.chip),
    );
    thumb.append(browserBar, screen);
    media.appendChild(thumb);

    const body = element('div', 'project-body');
    body.appendChild(element('h3', '', text(data.title)));
    const problem = element('p', 'project-line');
    problem.append(element('span', 'tag-label', window.I18N[language()]['projects.problem'] || 'Context'));
    problem.appendChild(document.createTextNode(' '));
    problem.appendChild(element('span', '', text(data.problem)));
    const solution = element('p', 'project-line');
    solution.append(element('span', 'tag-label', window.I18N[language()]['projects.solution'] || 'Work done'));
    solution.appendChild(document.createTextNode(' '));
    solution.appendChild(element('span', '', text(data.solution)));
    const tags = element('ul', 'project-tags');
    list(data.tags && data.tags[language()]).forEach((tag) => tags.appendChild(element('li', '', tag)));
    const link = element('a', 'project-link', window.I18N[language()]['projects.caseStudy'] || 'Visit live site');
    setLink(link, data.url);
    link.appendChild(element('span', '', ' →'));
    body.append(problem, solution, tags, link);
    article.append(media, body);
    return article;
  };

  const renderExpertise = (item) => {
    const data = item.content || {};
    const article = element('article', 'skill-card reveal' + (data.specialty ? ' skill-specialty' : ''));
    if (data.specialty) {
      article.appendChild(element('span', 'specialty-badge', window.I18N[language()]['skill.specialty'] || 'Specialty'));
    }
    const head = element('div', 'skill-head');
    const group = element('span', 'skill-group', 'field_group: ');
    group.appendChild(element('b', '', text(data.group)));
    head.append(group, element('h3', '', text(data.title)));
    const description = element('p', 'skill-desc', text(data.description));
    const tags = element('ul', 'skill-tags');
    list(data.tags && data.tags[language()]).forEach((tag) => tags.appendChild(element('li', '', tag)));
    article.append(head, description, tags);
    return article;
  };

  const renderExperience = (item) => {
    const data = item.content || {};
    const entry = element('li', 'tl-item reveal');
    const content = element('div', 'tl-content');
    content.append(
      element('span', 'tl-years', text(data.dates)),
      element('h3', '', text(data.role)),
      element('p', '', text(data.description)),
    );
    entry.append(element('div', 'tl-dot'), content);
    return entry;
  };

  const renderOpenSource = (item) => {
    const data = item.content || {};
    const article = element('article', 'contrib-card reveal');
    const body = element('div');
    body.append(
      element('div', 'contrib-head', ''),
      element('h3', '', text(data.title)),
      element('p', '', text(data.description)),
    );
    body.querySelector('.contrib-head').appendChild(element('span', 'contrib-badge', text(data.badge)));
    const link = element('a', 'contrib-link', window.I18N[language()]['contrib.viewOnDrupal'] || 'View project');
    setLink(link, data.url);
    article.append(body, link);
    return article;
  };

  const renderCertification = (item) => {
    const data = item.content || {};
    const article = element('div', 'cert-card reveal');
    const body = element('div');
    body.append(
      element('h3', '', text(data.title)),
      element('span', 'cert-date', text(data.date)),
      element('p', '', text(data.description)),
    );
    article.append(element('span', 'cert-icon', text(data.icon)), body);
    return article;
  };

  const renderTestimonial = (item) => {
    const data = item.content || {};
    const figure = element('figure', 'quote reveal');
    const quote = element('blockquote', '', text(data.quote));
    const caption = element('figcaption');
    caption.append(
      element('span', 'q-name', text(data.name)),
      element('span', 'q-role', text(data.role)),
    );
    figure.append(quote, caption);
    return figure;
  };

  const renderers = {
    projects: { selector: '.projects', render: renderProject },
    expertise: { selector: '#skillsGrid', render: renderExpertise },
    experience: { selector: '.timeline', render: renderExperience },
    open_source: { selector: '.contrib-grid', render: renderOpenSource },
    certifications: { selector: '.certs-grid', render: renderCertification },
    testimonials: { selector: '.quotes', render: renderTestimonial },
  };

  let latestRows = null;
  let latestInitialized = false;

  window.renderPortfolioItems = (rows, initialized) => {
    if (!Array.isArray(rows) || (!rows.length && !initialized)) return;
    latestRows = rows;
    latestInitialized = Boolean(initialized);
    collections.forEach((collection) => {
      const renderer = renderers[collection];
      const target = document.querySelector(renderer.selector);
      if (!target) return;
      const items = rows
        .filter((item) => item.collection === collection && item.published)
        .sort((a, b) => a.sort_order - b.sort_order);
      target.replaceChildren(...items.map(renderer.render));
    });
    window.dispatchEvent(new CustomEvent('portfolio:items-rendered'));
  };

  window.addEventListener('portfolio:language-changed', () => {
    if (latestRows) window.renderPortfolioItems(latestRows, latestInitialized);
  });
})();
