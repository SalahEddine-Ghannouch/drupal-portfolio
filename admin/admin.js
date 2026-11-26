(function () {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const loginPanel = $('#loginPanel');
  const mfaPanel = $('#mfaPanel');
  const workspace = $('#workspace');
  const status = $('#status');
  const config = window.SUPABASE_CONFIG || {};
  const ready = window.supabase && config.url && config.anonKey &&
    !config.url.includes('YOUR_PROJECT_ID') &&
    !config.anonKey.includes('YOUR_SUPABASE_ANON_KEY');
  const IDLE_TIMEOUT = 30 * 60 * 1000;
  const IDLE_CHECK_INTERVAL = 15 * 1000;
  const IDLE_STORAGE_KEY = 'portfolio-admin-last-activity';
  const COLLECTIONS = [
    {
      id: 'projects',
      title: 'Featured projects',
      fields: [
        { key: 'title', label: 'Title', type: 'localized' },
        { key: 'url', label: 'Live URL', type: 'url' },
        { key: 'aria', label: 'Accessible link label', type: 'localized' },
        { key: 'domain', label: 'Browser-bar domain', type: 'text' },
        { key: 'brand', label: 'Thumbnail brand', type: 'text' },
        { key: 'chip', label: 'Thumbnail stack', type: 'text' },
        { key: 'problem', label: 'Context', type: 'localized', multiline: true },
        { key: 'solution', label: 'Work done', type: 'localized', multiline: true },
        { key: 'tags', label: 'Technology tags', type: 'localized-array' },
      ],
    },
    {
      id: 'expertise',
      title: 'Expertise',
      fields: [
        { key: 'title', label: 'Title', type: 'localized' },
        { key: 'group', label: 'Group identifier', type: 'text' },
        { key: 'description', label: 'Description', type: 'localized', multiline: true },
        { key: 'tags', label: 'Skill tags', type: 'localized-array' },
        { key: 'specialty', label: 'Highlight as specialty', type: 'boolean' },
      ],
    },
    {
      id: 'experience',
      title: 'Experience',
      fields: [
        { key: 'role', label: 'Role', type: 'localized' },
        { key: 'dates', label: 'Dates', type: 'localized' },
        { key: 'description', label: 'Description', type: 'localized', multiline: true },
      ],
    },
    {
      id: 'open_source',
      title: 'Open source projects',
      fields: [
        { key: 'title', label: 'Project name', type: 'localized' },
        { key: 'url', label: 'Project URL', type: 'url' },
        { key: 'badge', label: 'Technology badge', type: 'text' },
        { key: 'description', label: 'Description', type: 'localized', multiline: true },
      ],
    },
    {
      id: 'certifications',
      title: 'Certifications',
      fields: [
        { key: 'title', label: 'Certification', type: 'localized' },
        { key: 'date', label: 'Date and issuer', type: 'localized' },
        { key: 'description', label: 'Description', type: 'localized', multiline: true },
        { key: 'icon', label: 'Icon or emoji', type: 'text' },
      ],
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      fields: [
        { key: 'name', label: 'Author', type: 'localized' },
        { key: 'role', label: 'Role', type: 'localized' },
        { key: 'quote', label: 'Quote', type: 'localized', multiline: true },
      ],
    },
  ];

  let client = null;
  let content = null;
  let fallback = null;
  let itemState = {};
  let originalItemIds = new Set();
  let isAdmin = false;
  let idleTimer = null;
  let lastActivityAt = 0;
  let expiringSession = false;
  let pendingMfa = null;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const setStatus = (message, kind) => {
    status.textContent = message;
    status.dataset.kind = kind || '';
    $('#loginStatus').textContent = message;
    $('#loginStatus').dataset.kind = kind || '';
  };
  const showWorkspace = (visible) => {
    workspace.hidden = !visible;
    loginPanel.hidden = visible;
    mfaPanel.hidden = true;
  };
  const showMfaPanel = () => {
    loginPanel.hidden = true;
    mfaPanel.hidden = false;
    workspace.hidden = true;
  };
  const resetMfaForm = () => {
    $('#mfaCode').value = '';
    $('#mfaStatus').textContent = '';
    $('#mfaForm').hidden = false;
    $('#mfaSetup').hidden = true;
    $('#mfaQrCode').hidden = true;
    $('#mfaQrCode').removeAttribute('src');
    $('#mfaSecret').textContent = '';
  };
  const isCollectionField = (key) =>
    /^proj\d+\./.test(key) ||
    /^exp\d+\./.test(key) ||
    /^skill\.(drupal|apis|frontend|devops|arch|backend)\./.test(key) ||
    /^contrib\.(arabic|transcription)\./.test(key) ||
    /^cert\.(checkmarx|react)\./.test(key) ||
    /^testi\.q\d+/.test(key);

  const verifyAdmin = async (user) => {
    const { data, error } = await client
      .from('portfolio_admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  };

  const categoryFor = (key) => {
    if (key.startsWith('projects.')) return 'Projects section';
    if (key.startsWith('exp.')) return 'Experience section';
    if (key.startsWith('skill.') || key.startsWith('expertise.')) return 'Expertise section';
    if (key.startsWith('contrib.') || key.startsWith('certs.')) return 'Open source & certifications';
    if (key.startsWith('testi.')) return 'Testimonials section';
    if (key.startsWith('contact.')) return 'Contact';
    if (key.startsWith('about.')) return 'About';
    if (key.startsWith('hero.') || key.startsWith('term.')) return 'Hero & profile';
    if (key.startsWith('nav.') || key.startsWith('a11y.')) return 'Navigation';
    if (key.startsWith('footer.')) return 'Footer';
    return 'Other';
  };

  const humanize = (key) => key.split('.').join(' / ');
  const renderFields = () => {
    const language = $('#languageSelect').value;
    const query = $('#searchInput').value.trim().toLowerCase();
    const groups = new Map();
    Object.entries(content[language]).forEach(([key, value]) => {
      if (isCollectionField(key)) return;
      const printable = Array.isArray(value) ? value.join(' ') : String(value);
      if (query && !(key + ' ' + printable).toLowerCase().includes(query)) return;
      const group = categoryFor(key);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push([key, value]);
    });

    const container = $('#contentSections');
    container.replaceChildren();
    groups.forEach((fields, group) => {
      const details = document.createElement('details');
      details.className = 'panel content-group';
      details.open = Boolean(query);
      const summary = document.createElement('summary');
      summary.textContent = group;
      const count = document.createElement('span');
      count.textContent = fields.length + (fields.length === 1 ? ' field' : ' fields');
      summary.appendChild(count);
      details.appendChild(summary);
      const fieldList = document.createElement('div');
      fieldList.className = 'fields';

      fields.forEach(([key, value]) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'field';
        const label = document.createElement('label');
        label.textContent = humanize(key);
        const keyHint = document.createElement('code');
        keyHint.textContent = key;
        label.append(document.createElement('br'), keyHint);
        const editor = Array.isArray(value) || String(value).length > 120 || String(value).includes('<')
          ? document.createElement('textarea')
          : document.createElement('input');
        editor.setAttribute('aria-label', key);
        if (Array.isArray(value)) {
          editor.value = value.join('\n');
          editor.dataset.array = 'true';
        } else {
          editor.value = String(value);
        }
        editor.addEventListener('input', () => {
          content[language][key] = editor.dataset.array === 'true'
            ? editor.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
            : editor.value;
        });
        wrapper.append(label, editor);
        fieldList.appendChild(wrapper);
      });

      details.appendChild(fieldList);
      container.appendChild(details);
    });
  };

  const localizedValue = (element, attribute) => {
    const key = element && element.getAttribute(attribute || 'data-i18n');
    if (key) {
      return {
        en: clone(window.I18N.en[key]),
        fr: clone(window.I18N.fr[key]),
      };
    }
    const value = element ? element.textContent.trim() : '';
    return { en: value, fr: value };
  };

  const listValue = (element, key) => ({
    en: clone(window.I18N.en[key] || Array.from(element.children).map((child) => child.textContent.trim())),
    fr: clone(window.I18N.fr[key] || Array.from(element.children).map((child) => child.textContent.trim())),
  });

  const extractDefaultItems = async () => {
    const response = await fetch('../index.html');
    if (!response.ok) throw new Error('Unable to read the current portfolio page.');
    const markup = await response.text();
    const page = new DOMParser().parseFromString(markup, 'text/html');
    const items = Object.fromEntries(COLLECTIONS.map((collection) => [collection.id, []]));

    items.projects = $$('.project', page).map((card, index) => {
      const body = $('.project-body', card);
      const lines = $$('.project-line', body);
      const problem = lines[0].querySelectorAll('span')[1];
      const solution = lines[1].querySelectorAll('span')[1];
      const problemKey = problem.getAttribute('data-i18n');
      const solutionKey = solution.getAttribute('data-i18n');
      const tagsElement = $('.project-tags', body);
      const media = $('.project-media', card);
      return {
        collection: 'projects',
        sort_order: index,
        published: true,
        content: {
          title: localizedValue($('h3', body)),
          url: localizedValue(media, 'data-i18n-href').en,
          aria: localizedValue(media, 'data-i18n-aria'),
          domain: localizedValue($('.browser-url', card)),
          brand: localizedValue($('.browser-mono', card)),
          chip: localizedValue($('.thumb-chip', card)),
          problem: { en: window.I18N.en[problemKey], fr: window.I18N.fr[problemKey] },
          solution: { en: window.I18N.en[solutionKey], fr: window.I18N.fr[solutionKey] },
          tags: listValue(tagsElement, tagsElement.getAttribute('data-i18n-list')),
        },
      };
    });

    items.expertise = $$('.skill-card', page).map((card, index) => {
      const title = $('h3', card);
      const description = $('.skill-desc', card);
      const group = $('.skill-group b', card);
      const tagsElement = $('.skill-tags', card);
      return {
        collection: 'expertise',
        sort_order: index,
        published: true,
        content: {
          title: localizedValue(title),
          group: group.textContent.trim(),
          description: localizedValue(description),
          tags: listValue(tagsElement, tagsElement.getAttribute('data-i18n-list')),
          specialty: card.classList.contains('skill-specialty'),
        },
      };
    });

    items.experience = $$('.tl-item', page).map((entry, index) => {
      const heading = $('.tl-content h3', entry);
      const description = $('.tl-content p', entry);
      const dateKey = 'exp' + (index + 1) + '.dates';
      const suffix = index === 0 ? ' ' + window.I18N.en['exp.present'] : '';
      const frenchSuffix = index === 0 ? ' ' + window.I18N.fr['exp.present'] : '';
      return {
        collection: 'experience',
        sort_order: index,
        published: true,
        content: {
          role: localizedValue(heading),
          dates: {
            en: window.I18N.en[dateKey] + suffix,
            fr: window.I18N.fr[dateKey] + frenchSuffix,
          },
          description: localizedValue(description),
        },
      };
    });

    items.open_source = $$('.contrib-card', page).map((card, index) => ({
      collection: 'open_source',
      sort_order: index,
      published: true,
      content: {
        title: localizedValue($('h3', card)),
        url: localizedValue($('a.contrib-link', card), 'data-i18n-href').en,
        badge: localizedValue($('.contrib-badge', card)),
        description: localizedValue($('p', card)),
      },
    }));

    items.certifications = $$('.cert-card', page).map((card, index) => ({
      collection: 'certifications',
      sort_order: index,
      published: true,
      content: {
        title: localizedValue($('h3', card)),
        date: localizedValue($('.cert-date', card)),
        description: localizedValue($('p', card)),
        icon: $('.cert-icon', card).textContent.trim(),
      },
    }));

    items.testimonials = $$('.quote', page).map((card, index) => ({
      collection: 'testimonials',
      sort_order: index,
      published: true,
      content: {
        name: localizedValue($('.q-name', card)),
        role: localizedValue($('.q-role', card)),
        quote: localizedValue($('blockquote', card)),
      },
    }));

    return items;
  };

  const makeEmptyItem = (collection) => {
    const contentValues = {};
    collection.fields.forEach((field) => {
      if (field.type === 'localized' || field.type === 'localized-array') {
        contentValues[field.key] = field.type === 'localized-array'
          ? { en: [], fr: [] }
          : { en: '', fr: '' };
      } else if (field.type === 'boolean') {
        contentValues[field.key] = false;
      } else {
        contentValues[field.key] = '';
      }
    });
    return {
      id: null,
      collection: collection.id,
      content: contentValues,
      sort_order: itemState[collection.id].length,
      published: true,
      isNew: true,
    };
  };

  const setItemField = (item, key, language, value, isArray) => {
    if (language) {
      if (!item.content[key] || typeof item.content[key] !== 'object') {
        item.content[key] = isArray ? { en: [], fr: [] } : { en: '', fr: '' };
      }
      item.content[key][language] = isArray
        ? value.split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean)
        : value;
    } else {
      item.content[key] = value;
    }
  };

  const renderItemField = (item, field) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'field' + (field.multiline || field.type === 'localized-array' ? ' field-wide' : '');
    if (field.type === 'boolean') {
      const label = document.createElement('label');
      label.className = 'item-toggle';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = Boolean(item.content[field.key]);
      input.addEventListener('change', () => setItemField(item, field.key, null, input.checked));
      label.append(input, document.createTextNode(field.label));
      wrapper.appendChild(label);
      return wrapper;
    }

    const label = document.createElement('label');
    label.textContent = field.label;
    wrapper.appendChild(label);
    const isLocalized = field.type === 'localized' || field.type === 'localized-array';
    const isArray = field.type === 'localized-array';
    const makeEditor = (language) => {
      const value = isLocalized
        ? (item.content[field.key] && item.content[field.key][language])
        : item.content[field.key];
      const editor = field.multiline || isArray ? document.createElement('textarea') : document.createElement('input');
      if (field.type === 'url' && !isArray) editor.type = 'url';
      editor.setAttribute('aria-label', field.key + (language ? '.' + language : ''));
      editor.value = isArray
        ? (Array.isArray(value) ? value.join('\n') : '')
        : String(value == null ? '' : value);
      editor.addEventListener('input', () => setItemField(item, field.key, language, editor.value, isArray));
      return editor;
    };

    if (isLocalized) {
      const locales = document.createElement('div');
      locales.className = 'item-locales';
      ['en', 'fr'].forEach((language) => {
        const locale = document.createElement('label');
        const localeName = document.createElement('b');
        localeName.textContent = language === 'en' ? 'English' : 'Français';
        locale.append(localeName, makeEditor(language));
        locales.appendChild(locale);
      });
      wrapper.appendChild(locales);
    } else {
      wrapper.appendChild(makeEditor(null));
    }
    return wrapper;
  };

  const renderItems = () => {
    const root = $('#itemSections');
    root.replaceChildren();
    COLLECTIONS.forEach((collection) => {
      const section = document.createElement('section');
      section.className = 'panel';
      const heading = document.createElement('div');
      heading.className = 'item-section-heading';
      const titleWrap = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = collection.title;
      const count = document.createElement('small');
      count.textContent = itemState[collection.id].length + ' entr' +
        (itemState[collection.id].length === 1 ? 'y' : 'ies');
      titleWrap.append(title, count);
      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.className = 'secondary-button';
      addButton.textContent = 'Add entry';
      addButton.addEventListener('click', () => {
        itemState[collection.id].push(makeEmptyItem(collection));
        renderItems();
        const sectionIndex = COLLECTIONS.findIndex((entry) => entry.id === collection.id);
        const panels = $$('.item-card', $$('.item-sections > section')[sectionIndex]);
        if (panels.length) panels[panels.length - 1].open = true;
      });
      heading.append(titleWrap, addButton);
      const list = document.createElement('div');
      list.className = 'item-list';

      itemState[collection.id].forEach((item, index) => {
        const details = document.createElement('details');
        details.className = 'item-card';
        details.open = item.isNew === true;
        const summary = document.createElement('summary');
        const titleValue = item.content.title || item.content.role || item.content.name;
        summary.textContent = (index + 1) + '. ' + (
          titleValue && (titleValue.en || titleValue.fr) ||
          titleValue ||
          'New entry'
        );
        details.appendChild(summary);
        const itemHeading = document.createElement('div');
        itemHeading.className = 'item-card-heading';
        const position = document.createElement('span');
        position.className = 'item-position';
        position.textContent = 'Position ' + (index + 1);
        const publishLabel = document.createElement('label');
        publishLabel.className = 'item-toggle';
        const publishInput = document.createElement('input');
        publishInput.type = 'checkbox';
        publishInput.checked = item.published !== false;
        publishInput.addEventListener('change', () => { item.published = publishInput.checked; });
        publishLabel.append(publishInput, document.createTextNode('Published'));
        itemHeading.append(position, publishLabel);
        details.appendChild(itemHeading);

        const fields = document.createElement('div');
        fields.className = 'item-fields';
        collection.fields.forEach((field) => fields.appendChild(renderItemField(item, field)));
        fields.addEventListener('input', () => {
          const currentTitle = item.content.title || item.content.role || item.content.name;
          summary.textContent = (index + 1) + '. ' + (
            currentTitle && (currentTitle.en || currentTitle.fr) ||
            currentTitle ||
            'New entry'
          );
        });
        details.appendChild(fields);

        const actions = document.createElement('div');
        actions.className = 'item-actions';
        const moveButton = (label, offset, disabled) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'secondary-button';
          button.textContent = label;
          button.disabled = disabled;
          button.addEventListener('click', () => {
            const rows = itemState[collection.id];
            const target = index + offset;
            [rows[index], rows[target]] = [rows[target], rows[index]];
            rows.forEach((row, rowIndex) => { row.sort_order = rowIndex; });
            renderItems();
          });
          return button;
        };
        actions.append(
          moveButton('Move up', -1, index === 0),
          moveButton('Move down', 1, index === itemState[collection.id].length - 1),
        );
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'secondary-button danger-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          if (!window.confirm('Delete this entry? Save all changes to publish the deletion.')) return;
          itemState[collection.id].splice(index, 1);
          itemState[collection.id].forEach((row, rowIndex) => { row.sort_order = rowIndex; });
          renderItems();
        });
        actions.appendChild(deleteButton);
        details.appendChild(actions);
        list.appendChild(details);
      });

      section.append(heading, list);
      root.appendChild(section);
    });
  };

  const loadItems = async (itemsInitialized) => {
    const { data, error } = await client
      .from('portfolio_items')
      .select('id,collection,content,sort_order,published')
      .order('sort_order', { ascending: true });
    if (error) throw error;

    if (data.length || itemsInitialized) {
      itemState = Object.fromEntries(COLLECTIONS.map((collection) => [
        collection.id,
        data.filter((item) => item.collection === collection.id)
          .sort((a, b) => a.sort_order - b.sort_order),
      ]));
      originalItemIds = new Set(data.map((item) => item.id));
      renderItems();
      return;
    }

    itemState = await extractDefaultItems();
    Object.values(itemState).forEach((items) => {
      items.forEach((item) => {
        item.id = null;
        item.isNew = false;
      });
    });
    originalItemIds = new Set();
    renderItems();
  };

  const loadContent = async () => {
    fallback = clone(window.I18N);
    content = clone(fallback);
    const { data, error } = await client
      .from('portfolio_content')
      .select('translations,items_initialized')
      .eq('id', 'main')
      .maybeSingle();
    if (error) throw error;
    if (data && data.translations) {
      ['en', 'fr'].forEach((language) => {
        const remote = data.translations[language];
        if (remote && typeof remote === 'object' && !Array.isArray(remote)) {
          Object.entries(remote).forEach(([key, value]) => {
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') return;
            if (typeof value === 'string' || (Array.isArray(value) && value.every((item) => typeof item === 'string'))) {
              content[language][key] = value;
            }
          });
        }
      });
    }
    await loadItems(Boolean(data && data.items_initialized));
    renderFields();
    setStatus(
      data && data.items_initialized
        ? 'Live content and entries loaded.'
        : 'Loaded local defaults. Save all changes to publish them.',
      '',
    );
  };

  const validateItems = () => {
    const requiredFields = {
      projects: 'title',
      expertise: 'title',
      experience: 'role',
      open_source: 'title',
      certifications: 'title',
      testimonials: 'name',
    };
    for (const collection of COLLECTIONS) {
      const field = requiredFields[collection.id];
      for (const item of itemState[collection.id]) {
        if (item.published === false) continue;
        const value = item.content[field] || {};
        if (!String(value.en || '').trim() || !String(value.fr || '').trim()) {
          return 'Add both English and French ' + collection.title.toLowerCase() +
            ' titles, or mark incomplete entries as drafts.';
        }
        const url = item.content.url;
        if (url && !/^https?:\/\//i.test(String(url).trim())) {
          return 'Use a valid HTTP or HTTPS URL for every portfolio entry link.';
        }
      }
    }
    return '';
  };

  const persistItems = async () => {
    const currentIds = new Set();
    const existing = [];
    const added = [];
    COLLECTIONS.forEach((collection) => {
      itemState[collection.id].forEach((item, index) => {
        item.sort_order = index;
        item.collection = collection.id;
        item.published = item.published !== false;
        if (item.id) {
          currentIds.add(item.id);
          existing.push({
            id: item.id,
            collection: item.collection,
            content: item.content,
            sort_order: item.sort_order,
            published: item.published,
            updated_at: new Date().toISOString(),
          });
        } else {
          added.push(item);
        }
      });
    });

    if (existing.length) {
      const { error } = await client.from('portfolio_items').upsert(existing);
      if (error) throw error;
    }
    for (const item of added) {
      const { data, error } = await client
        .from('portfolio_items')
        .insert({
          collection: item.collection,
          content: item.content,
          sort_order: item.sort_order,
          published: item.published,
        })
        .select('id')
        .single();
      if (error) throw error;
      item.id = data.id;
      item.isNew = false;
      currentIds.add(data.id);
    }

    const removedIds = Array.from(originalItemIds).filter((id) => !currentIds.has(id));
    if (removedIds.length) {
      const { error } = await client.from('portfolio_items').delete().in('id', removedIds);
      if (error) throw error;
    }
    originalItemIds = currentIds;
  };

  const saveContent = async () => {
    if (!isAdmin) {
      setStatus('Your account is not authorized to edit this content.', 'error');
      return;
    }
    const validationError = validateItems();
    if (validationError) {
      setStatus(validationError, 'error');
      return;
    }
    $('#saveButton').disabled = true;
    setStatus('Saving changes…', '');
    try {
      const { error } = await client
        .from('portfolio_content')
        .upsert({ id: 'main', translations: content, updated_at: new Date().toISOString() });
      if (error) throw error;

      await persistItems();
      const { error: initializedError } = await client
        .from('portfolio_content')
        .update({ items_initialized: true, updated_at: new Date().toISOString() })
        .eq('id', 'main');
      if (initializedError) throw initializedError;
      setStatus('Saved. Published entries will appear on the public portfolio.', 'success');
    } catch (error) {
      console.error('Unable to save portfolio content and entries.', error);
      setStatus('Save failed. Check your connection and database setup, then try again.', 'error');
    } finally {
      $('#saveButton').disabled = false;
    }
  };

  const readLastActivity = () => {
    try {
      return Number(localStorage.getItem(IDLE_STORAGE_KEY)) || 0;
    } catch (error) {
      console.error('Unable to read the administrator activity timestamp.', error);
      return lastActivityAt;
    }
  };

  const recordActivity = () => {
    if (!isAdmin) return;
    const now = Date.now();
    if (now - lastActivityAt < 1000) return;
    lastActivityAt = now;
    try {
      localStorage.setItem(IDLE_STORAGE_KEY, String(lastActivityAt));
    } catch (error) {
      console.error('Unable to persist the administrator activity timestamp.', error);
    }
  };

  const stopIdleTimer = () => {
    if (idleTimer !== null) window.clearInterval(idleTimer);
    idleTimer = null;
  };

  const expireIdleSession = async () => {
    if (expiringSession) return;
    expiringSession = true;
    stopIdleTimer();
    isAdmin = false;
    showWorkspace(false);
    setStatus('You were signed out after 30 minutes without activity. Please sign in again.', 'error');
    try {
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) console.error('Unable to clear the expired administrator session.', error);
    } catch (error) {
      console.error('Unable to clear the expired administrator session.', error);
    } finally {
      expiringSession = false;
    }
  };

  const checkIdleTimeout = () => {
    if (!isAdmin) return;
    const lastActivity = readLastActivity();
    if (!lastActivity) {
      recordActivity();
      return;
    }
    if (Date.now() - lastActivity >= IDLE_TIMEOUT) expireIdleSession();
  };

  const startIdleTimer = (newLogin) => {
    stopIdleTimer();
    if (newLogin || !readLastActivity()) recordActivity();
    else if (Date.now() - readLastActivity() >= IDLE_TIMEOUT) {
      expireIdleSession();
      return;
    }
    idleTimer = window.setInterval(checkIdleTimeout, IDLE_CHECK_INTERVAL);
  };

  const requestMfa = (user, newLogin, factor, setup) => {
    pendingMfa = {
      factorId: factor.id,
      user,
      newLogin,
    };
    resetMfaForm();
    if (setup) {
      $('#mfaTitle').textContent = 'Set up an authenticator app';
      $('#mfaDescription').textContent = 'Add this account to an authenticator app, then enter its 6-digit code to finish setup.';
      $('#mfaSetup').hidden = false;
      if (setup.qr_code) {
        $('#mfaQrCode').src = setup.qr_code;
        $('#mfaQrCode').hidden = false;
      }
      $('#mfaSecret').textContent = setup.secret || '';
    } else {
      $('#mfaTitle').textContent = 'Verify your identity';
      $('#mfaDescription').textContent = 'Enter the current 6-digit code from your authenticator app.';
    }
    showMfaPanel();
    $('#mfaCode').focus();
  };

  const ensureMfa = async (user, newLogin) => {
    const { data: assurance, error: assuranceError } =
      await client.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) throw assuranceError;

    const { data: factorData, error: factorsError } = await client.auth.mfa.listFactors();
    if (factorsError) throw factorsError;

    const totpFactors = factorData && Array.isArray(factorData.totp) ? factorData.totp : [];
    const verifiedFactor = totpFactors.find((factor) => factor.status === 'verified');
    if (verifiedFactor && assurance.currentLevel === 'aal2') return true;

    if (!verifiedFactor) {
      for (const factor of totpFactors.filter((entry) => entry.status === 'unverified')) {
        const { error } = await client.auth.mfa.unenroll({ factorId: factor.id });
        if (error) throw error;
      }
      const { data: enrollment, error } = await client.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Portfolio administrator',
      });
      if (error) throw error;
      if (!enrollment || !enrollment.totp) {
        throw new Error('Authenticator enrollment did not return TOTP setup details.');
      }
      requestMfa(user, newLogin, enrollment, enrollment.totp);
      return false;
    }

    requestMfa(user, newLogin, verifiedFactor, null);
    return false;
  };

  const enterWorkspace = async (user, newLogin) => {
    setStatus('Checking access…', '');
    try {
      isAdmin = await verifyAdmin(user);
      if (!isAdmin) {
        await client.auth.signOut({ scope: 'local' });
        showWorkspace(false);
        setStatus('This account is not authorized to manage the portfolio.', 'error');
        return;
      }
      if (!(await ensureMfa(user, newLogin))) return;
      startIdleTimer(Boolean(newLogin));
      if (!isAdmin) return;
      showWorkspace(true);
      await loadContent();
    } catch (error) {
      console.error('Unable to verify access or load portfolio data.', error);
      isAdmin = false;
      stopIdleTimer();
      showWorkspace(false);
      setStatus('The backoffice could not be opened. Check the site configuration and try again.', 'error');
    }
  };

  if (!ready) {
    setStatus('Administrator access is not configured. Please contact the site administrator.', 'error');
    $('#loginForm').querySelector('button').disabled = true;
    return;
  }

  client = window.supabase.createClient(config.url, config.anonKey);

  $('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = $('#loginForm button[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    setStatus('Signing in…', '');
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: $('#email').value.trim(),
        password: $('#password').value,
      });
      if (error) {
        console.error('Administrator sign-in failed.', error);
        setStatus('Sign-in failed. Check your email and password, then try again.', 'error');
        return;
      }
      await enterWorkspace(data.user, true);
    } catch (error) {
      console.error('Administrator sign-in is unavailable.', error);
      setStatus('Sign-in is temporarily unavailable. Please try again.', 'error');
    } finally {
      button.disabled = false;
    }
  });

  $('#mfaForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!pendingMfa) return;
    const button = $('#mfaSubmitButton');
    button.disabled = true;
    $('#mfaStatus').textContent = 'Verifying code…';
    const pending = pendingMfa;
    try {
      const { error } = await client.auth.mfa.challengeAndVerify({
        factorId: pending.factorId,
        code: $('#mfaCode').value.trim(),
      });
      if (error) throw error;
      const { data: assurance, error: assuranceError } =
        await client.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError) throw assuranceError;
      if (assurance.currentLevel !== 'aal2') {
        throw new Error('The authenticator session did not reach AAL2.');
      }
      pendingMfa = null;
      resetMfaForm();
      $('#mfaTitle').textContent = 'Verification successful';
      $('#mfaDescription').textContent = 'Opening the administrator workspace…';
      $('#mfaForm').hidden = true;
      await enterWorkspace(pending.user, pending.newLogin);
    } catch (error) {
      console.error('Administrator MFA verification failed.', error);
      $('#mfaStatus').textContent = 'The code could not be verified. Check it and try again.';
      $('#mfaCode').select();
    } finally {
      button.disabled = false;
    }
  });

  $('#cancelMfaButton').addEventListener('click', async () => {
    const button = $('#cancelMfaButton');
    button.disabled = true;
    try {
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) throw error;
      pendingMfa = null;
      isAdmin = false;
      resetMfaForm();
      showWorkspace(false);
      setStatus('Sign-in cancelled.', '');
    } catch (error) {
      console.error('Unable to cancel the administrator MFA session.', error);
      $('#mfaStatus').textContent = 'Could not end this sign-in. Close this tab and try again.';
    } finally {
      button.disabled = false;
    }
  });

  $('#signOutButton').addEventListener('click', async () => {
    const button = $('#signOutButton');
    const label = $('#signOutLabel');
    const spinner = $('#signOutSpinner');
    button.disabled = true;
    label.textContent = 'Signing out…';
    spinner.hidden = false;
    stopIdleTimer();
    try {
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Administrator sign-out failed.', error);
        setStatus('Sign-out failed. Please try again.', 'error');
        startIdleTimer(false);
        return;
      }
      isAdmin = false;
      try {
        localStorage.removeItem(IDLE_STORAGE_KEY);
      } catch (storageError) {
        console.error('Unable to clear the administrator activity timestamp.', storageError);
      }
      showWorkspace(false);
      setStatus('Signed out.', 'success');
    } catch (error) {
      console.error('Administrator sign-out is unavailable.', error);
      setStatus('Sign-out failed. Please try again.', 'error');
      startIdleTimer(false);
    } finally {
      button.disabled = false;
      label.textContent = 'Sign out';
      spinner.hidden = true;
    }
  });

  ['pointerdown', 'keydown', 'touchstart', 'click', 'scroll', 'wheel'].forEach((eventName) => {
    document.addEventListener(eventName, recordActivity, { passive: true });
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkIdleTimeout();
  });
  window.addEventListener('storage', (event) => {
    if (event.key === IDLE_STORAGE_KEY) checkIdleTimeout();
  });

  $('#languageSelect').addEventListener('change', renderFields);
  $('#searchInput').addEventListener('input', renderFields);
  $('#saveButton').addEventListener('click', saveContent);
  $('#restoreButton').addEventListener('click', () => {
    if (!window.confirm('Replace portfolio text with the built-in EN/FR defaults? Entries are not affected. This does not save until you press Save all changes.')) return;
    content = clone(fallback);
    renderFields();
    setStatus('Built-in text defaults restored in the editor. Save to publish them.', '');
  });

  client.auth.getSession()
    .then(({ data, error }) => {
      if (error) {
        console.error('Unable to restore the administrator session.', error);
        setStatus('Could not restore your session. Please sign in again.', 'error');
        return;
      }
      if (data.session) enterWorkspace(data.session.user, false);
    })
    .catch((error) => {
      console.error('Unable to restore the administrator session.', error);
      setStatus('Could not restore your session. Please sign in again.', 'error');
    });
})();
