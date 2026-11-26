(function () {
  'use strict';

  const config = window.SUPABASE_CONFIG || {};
  const isConfigured = config.url && config.anonKey &&
    !config.url.includes('YOUR_PROJECT_ID') &&
    !config.anonKey.includes('YOUR_SUPABASE_ANON_KEY');

  if (!isConfigured) return;

  const validValue = (value) => {
    if (typeof value === 'string') return true;
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
  };

  const loadContent = async (client) => {
    const { data, error } = await client
      .from('portfolio_content')
      .select('translations,items_initialized')
      .eq('id', 'main')
      .maybeSingle();

    if (error) {
      console.error('Unable to load portfolio content from Supabase; using local translations.', error);
      return;
    }
    if (!data) return;

    ['en', 'fr'].forEach((lang) => {
      const remote = data.translations && data.translations[lang];
      if (!remote || typeof remote !== 'object' || Array.isArray(remote)) return;
      Object.entries(remote).forEach(([key, value]) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') return;
        if (validValue(value)) window.I18N[lang][key] = value;
      });
    });

    try {
      const itemsResult = await client
        .from('portfolio_items')
        .select('id,collection,content,sort_order,published')
        .order('sort_order', { ascending: true });
      if (itemsResult.error) {
        console.error('Unable to load portfolio entries; using local entries.', itemsResult.error);
      } else if (window.renderPortfolioItems) {
        window.renderPortfolioItems(itemsResult.data || [], data.items_initialized);
      }
    } catch (error) {
      console.error('Unable to load portfolio entries; using local entries.', error);
    }

    window.dispatchEvent(new CustomEvent('portfolio:content-updated'));
  };

  const connect = () => {
    if (!window.supabase) {
      console.error('Supabase client library did not load; using local translations.');
      return;
    }

    const client = window.supabase.createClient(config.url, config.anonKey);
    window.portfolioSupabase = client;
    loadContent(client).catch((error) => {
      console.error('Unable to load portfolio content from Supabase; using local translations.', error);
    });
  };

  if (window.supabase) {
    connect();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = connect;
  script.onerror = () => console.error('Supabase client library did not load; using local translations.');
  document.head.appendChild(script);
})();
