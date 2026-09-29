(function () {
  'use strict';

  var config = null;
  var linksById = {};
  var tiersById = {};
  var sessionState = { authenticated: false, currentlyEntitledAmountCents: 0, accessLevel: 'none' };
  var currentLang = 'en';
  var STRINGS = {
    en: {
      htmlLang: 'en',
      nav: { games: 'Games', art: 'Art', news: 'News', bonus: 'Bonus' },
      bonus: { kicker: 'Patron Bonus', availableFiles: 'Available bonus files', images: '15 images', animations: '2 animations' },
      auth: {
        checkAccess: 'Check access',
        checking: 'Checking...',
        signIn: 'Sign in with Patreon',
        signOut: 'Sign out',
        refreshLinks: 'Refresh Links',
        creatorAccess: 'Creator access',
        oracleAccess: 'Oracle access',
        initiateAccess: 'Initiate access',
        noPaidTier: 'No paid tier',
        checkoutOpened: 'Checkout opened'
      },
      cta: {
        downloadsReady: 'Downloads ready',
        download: 'Download',
        unlock4k: 'Unlock 4K',
        unlock1080p: 'Unlock 1080p',
        upgrade4k: 'Upgrade for 4K',
        upgradeAccess: 'Upgrade Access'
      },
      notice: {
        signInCancelled: 'Sign-in cancelled.',
        signInSetup: 'Patreon sign-in is not ready yet.',
        signInFailed: 'Sign-in failed. Try again.',
        higherTier: 'Higher tier needed.',
        sessionExpired: 'Session expired. Sign in again.',
        linkExpired: 'Link expired. Refresh links.',
        fileMissing: 'File not available yet.',
        unavailable: 'Downloads temporarily unavailable.',
        downloadsUnavailable: 'Downloads unavailable.',
        localWorkerDown: 'Local Worker is not responding.',
        downloadsSlow: 'Downloads are taking longer than expected.',
        downloadsUnreachable: 'Could not reach downloads.',
        verifyFailed: 'Could not verify access.',
        notResponding: 'Downloads are not responding.',
        returnRefresh: 'Return here and refresh links.',
        refreshingExpired: 'Refreshing expired link.',
        pageLoadFailed: 'Could not load this page.',
        comingSoon: 'Coming soon',
        diagnostics: 'Diagnostics',
        diagnosticsSummary: 'Download diagnostics.'
      }
    },
    zh: {
      htmlLang: 'zh-Hans',
      nav: { games: '游戏', art: '美术', news: '新闻', bonus: '奖励' },
      bonus: { kicker: '赞助者奖励', availableFiles: '可下载的奖励文件', images: '15 张图片', animations: '2 个动画' },
      auth: {
        checkAccess: '检查权限',
        checking: '检查中...',
        signIn: '使用 Patreon 登录',
        signOut: '退出登录',
        refreshLinks: '刷新链接',
        creatorAccess: '创作者权限',
        oracleAccess: 'Oracle 权限',
        initiateAccess: 'Initiate 权限',
        noPaidTier: '未找到付费等级',
        checkoutOpened: '已打开结账页面'
      },
      cta: {
        downloadsReady: '下载已就绪',
        download: '下载',
        unlock4k: '解锁 4K',
        unlock1080p: '解锁 1080p',
        upgrade4k: '升级解锁 4K',
        upgradeAccess: '升级权限'
      },
      notice: {
        signInCancelled: '登录已取消。',
        signInSetup: 'Patreon 登录尚未准备好。',
        signInFailed: '登录失败，请重试。',
        higherTier: '需要更高等级。',
        sessionExpired: '会话已过期，请重新登录。',
        linkExpired: '链接已过期，请刷新链接。',
        fileMissing: '文件暂不可用。',
        unavailable: '下载暂时不可用。',
        downloadsUnavailable: '下载不可用。',
        localWorkerDown: '本地 Worker 没有响应。',
        downloadsSlow: '下载服务响应较慢。',
        downloadsUnreachable: '无法连接下载服务。',
        verifyFailed: '无法验证权限。',
        notResponding: '下载服务没有响应。',
        returnRefresh: '返回此页面并刷新链接。',
        refreshingExpired: '正在刷新过期链接。',
        pageLoadFailed: '无法加载此页面。',
        comingSoon: '即将推出',
        diagnostics: '诊断',
        diagnosticsSummary: '下载诊断。'
      }
    },
    ru: {
      htmlLang: 'ru',
      nav: { games: 'Игры', art: 'Арт', news: 'Новости', bonus: 'Бонус' },
      bonus: { kicker: 'Бонус для патронов', availableFiles: 'Доступные бонусные файлы', images: '15 изображений', animations: '2 анимации' },
      auth: {
        checkAccess: 'Проверить доступ',
        checking: 'Проверяем...',
        signIn: 'Войти через Patreon',
        signOut: 'Выйти',
        refreshLinks: 'Обновить ссылки',
        creatorAccess: 'Доступ автора',
        oracleAccess: 'Доступ Oracle',
        initiateAccess: 'Доступ Initiate',
        noPaidTier: 'Платный уровень не найден',
        checkoutOpened: 'Оплата открыта'
      },
      cta: {
        downloadsReady: 'Ссылки готовы',
        download: 'Скачать',
        unlock4k: 'Открыть 4K',
        unlock1080p: 'Открыть 1080p',
        upgrade4k: 'Повысить для 4K',
        upgradeAccess: 'Повысить доступ'
      },
      notice: {
        signInCancelled: 'Вход отменён.',
        signInSetup: 'Вход через Patreon ещё не настроен.',
        signInFailed: 'Не удалось войти. Попробуйте снова.',
        higherTier: 'Нужен более высокий уровень.',
        sessionExpired: 'Сессия истекла. Войдите снова.',
        linkExpired: 'Ссылка истекла. Обновите ссылки.',
        fileMissing: 'Файл пока недоступен.',
        unavailable: 'Загрузки временно недоступны.',
        downloadsUnavailable: 'Загрузки недоступны.',
        localWorkerDown: 'Локальный Worker не отвечает.',
        downloadsSlow: 'Сервис загрузок отвечает дольше обычного.',
        downloadsUnreachable: 'Не удалось связаться с загрузками.',
        verifyFailed: 'Не удалось проверить доступ.',
        notResponding: 'Сервис загрузок не отвечает.',
        returnRefresh: 'Вернитесь сюда и обновите ссылки.',
        refreshingExpired: 'Обновляем истёкшую ссылку.',
        pageLoadFailed: 'Не удалось загрузить страницу.',
        comingSoon: 'Скоро',
        diagnostics: 'Диагностика',
        diagnosticsSummary: 'Диагностика загрузок.'
      }
    },
    fr: {
      htmlLang: 'fr',
      nav: { games: 'Jeux', art: 'Art', news: 'Actus', bonus: 'Bonus' },
      bonus: { kicker: 'Bonus Patreon', availableFiles: 'Fichiers bonus disponibles', images: '15 images', animations: '2 animations' },
      auth: {
        checkAccess: 'Vérifier l’accès',
        checking: 'Vérification...',
        signIn: 'Se connecter avec Patreon',
        signOut: 'Se déconnecter',
        refreshLinks: 'Actualiser les liens',
        creatorAccess: 'Accès créateur',
        oracleAccess: 'Accès Oracle',
        initiateAccess: 'Accès Initiate',
        noPaidTier: 'Aucun niveau payant',
        checkoutOpened: 'Paiement ouvert'
      },
      cta: {
        downloadsReady: 'Téléchargements prêts',
        download: 'Télécharger',
        unlock4k: 'Débloquer la 4K',
        unlock1080p: 'Débloquer le 1080p',
        upgrade4k: 'Passer à la 4K',
        upgradeAccess: 'Améliorer l’accès'
      },
      notice: {
        signInCancelled: 'Connexion annulée.',
        signInSetup: 'La connexion Patreon n’est pas encore prête.',
        signInFailed: 'Connexion échouée. Réessayez.',
        higherTier: 'Niveau supérieur requis.',
        sessionExpired: 'Session expirée. Connectez-vous à nouveau.',
        linkExpired: 'Lien expiré. Actualisez les liens.',
        fileMissing: 'Fichier pas encore disponible.',
        unavailable: 'Téléchargements temporairement indisponibles.',
        downloadsUnavailable: 'Téléchargements indisponibles.',
        localWorkerDown: 'Le Worker local ne répond pas.',
        downloadsSlow: 'Le service de téléchargement prend plus de temps que prévu.',
        downloadsUnreachable: 'Impossible de joindre les téléchargements.',
        verifyFailed: 'Impossible de vérifier l’accès.',
        notResponding: 'Les téléchargements ne répondent pas.',
        returnRefresh: 'Revenez ici et actualisez les liens.',
        refreshingExpired: 'Actualisation du lien expiré.',
        pageLoadFailed: 'Impossible de charger cette page.',
        comingSoon: 'Bientôt',
        diagnostics: 'Diagnostic',
        diagnosticsSummary: 'Diagnostic des téléchargements.'
      }
    }
  };

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&' + 'amp;')
      .replace(/</g, '&' + 'lt;')
      .replace(/>/g, '&' + 'gt;')
      .replace(/"/g, '&' + 'quot;')
      .replace(/'/g, '&#39;');
  }

  function getPath(source, path) {
    return path.split('.').reduce(function (value, part) {
      return value && value[part] != null ? value[part] : null;
    }, source);
  }

  function t(path) {
    return getPath(STRINGS[currentLang] || STRINGS.en, path) || getPath(STRINGS.en, path) || path;
  }

  function localized(object, key) {
    if (!object) return '';
    var translations = object.translations && object.translations[currentLang];
    return translations && translations[key] != null ? translations[key] : object[key];
  }

  function storedLanguage() {
    try {
      return localStorage.getItem('fotLanguage') || '';
    } catch (e) {
      return '';
    }
  }

  function detectLanguage() {
    var saved = storedLanguage();
    if (STRINGS[saved]) return saved;
    var browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
    return STRINGS[browserLang] ? browserLang : 'en';
  }

  function applyLanguage(lang) {
    currentLang = STRINGS[lang] ? lang : 'en';
    document.documentElement.lang = STRINGS[currentLang].htmlLang || currentLang;

    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t(node.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (node) {
      node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria-label')));
    });
    document.querySelectorAll('.lang-btn').forEach(function (button) {
      var active = button.getAttribute('data-lang') === currentLang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (config) {
      var title = qs('[data-download-title]');
      var subtitle = qs('[data-download-subtitle]');
      var pageTitle = localized(config, 'title') || 'Downloads';
      if (title) title.textContent = pageTitle;
      if (subtitle) subtitle.textContent = localized(config, 'subtitle') || '';
      document.title = pageTitle + ' - Futa on Top';
      updateSession(sessionState);
      renderBuilds();
    }
  }

  function apiBase() {
    var fromUrl = '';
    try {
      fromUrl = new URLSearchParams(window.location.search).get('apiBase') || '';
      if (fromUrl) localStorage.setItem('fotDownloadsApiBase', fromUrl);
    } catch (e) {
      fromUrl = '';
    }

    var fromStorage = '';
    try {
      fromStorage = localStorage.getItem('fotDownloadsApiBase') || '';
    } catch (e) {
      fromStorage = '';
    }

    var isLocalPage = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
    var localDefault = isLocalPage ? 'http://127.0.0.1:8787' : '';
    var storedIsRemote = /^https:\/\/.+\.workers\.dev/i.test(fromStorage);

    if (isLocalPage && storedIsRemote && !fromUrl) {
      try {
        localStorage.setItem('fotDownloadsApiBase', localDefault);
      } catch (e) {}
      fromStorage = '';
    }

    return String(window.FOT_DOWNLOADS_API_BASE || fromUrl || config.apiBase || localDefault || fromStorage || '').replace(/\/+$/, '');
  }

  function apiUrl(path) {
    var base = apiBase();
    return base ? base + path : path;
  }

  function configUrl() {
    var source = document.body && document.body.getAttribute('data-download-config');
    return source || 'data/downloads.json';
  }

  function isLocalApiBase() {
    return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(apiBase());
  }

  function setStatus(text) {
    var status = qs('[data-auth-status]');
    if (status) status.textContent = text;
  }

  function pageType() {
    if (document.body && document.body.classList.contains('bonus-page')) return 'bonus';
    return configUrl().indexOf('bonus') !== -1 ? 'bonus' : 'downloads';
  }

  function apiBaseType() {
    var base = apiBase();
    if (!base) return 'missing';
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(base)) return 'local';
    if (/^https:\/\/downloads\.futaontop\.com/i.test(base)) return 'production';
    if (/\.workers\.dev/i.test(base)) return 'workers_dev';
    return 'custom';
  }

  function trackEvent(action, params) {
    if (typeof window.gtag !== 'function') return;
    var type = pageType();
    var payload = Object.assign({
      page_type: type,
      page_path: window.location.pathname,
      page_title: document.title,
      api_base_type: apiBaseType(),
      auth_state: isSignedIn() ? 'signed_in' : 'signed_out',
      access_level: sessionState.accessLevel || 'none',
      transport_type: 'beacon'
    }, params || {});
    window.gtag('event', type + '_' + action, payload);
  }

  function buildById(id) {
    var builds = (config && Array.isArray(config.builds)) ? config.builds : [];
    return builds.filter(function (build) { return build.id === id; })[0] || null;
  }

  function tierForBuild(build) {
    return build ? (tiersById[build.tier] || null) : null;
  }

  function buildEventParams(build, extra) {
    var tier = tierForBuild(build);
    return Object.assign({
      build_id: build ? build.id : '',
      build_name: build ? localized(build, 'name') : '',
      build_tier: build ? build.tier : '',
      build_size: build ? buildSizeLabel(build) : '',
      build_type: build ? localized(build, 'type') : '',
      tier_title: tier ? localized(tier, 'title') : '',
      required_amount_cents: requiredAmountForTier(tier)
    }, extra || {});
  }

  function showNotice(text, kind) {
    var error = qs('[data-download-error]');
    if (!error) return;
    error.textContent = text || '';
    error.classList.toggle('is-visible', Boolean(text));
    error.setAttribute('data-notice-kind', kind || 'error');
    if (document.body) {
      document.body.classList.toggle('has-download-notice', Boolean(text));
      if (text) {
        document.body.setAttribute('data-notice-kind', kind || 'error');
      } else {
        document.body.removeAttribute('data-notice-kind');
      }
    }
  }

  function showError(text) {
    showNotice(text, 'error');
  }

  function showInfo(text) {
    showNotice(text, 'info');
  }

  function showWarning(text) {
    showNotice(text, 'warning');
  }

  function clearNotice() {
    showNotice('', 'info');
  }

  function showPatreonReturnMessage() {
    var status = '';
    var downloadStatus = '';
    var shouldCleanUrl = false;
    try {
      var params = new URLSearchParams(window.location.search);
      status = params.get('patreon') || '';
      downloadStatus = params.get('download') || '';
    } catch (e) {
      status = '';
      downloadStatus = '';
    }

    if (status === 'denied') {
      trackEvent('auth_denied');
      shouldCleanUrl = true;
    } else if (status === 'cancelled') {
      showInfo(t('notice.signInCancelled'));
      trackEvent('auth_cancelled');
      shouldCleanUrl = true;
    } else if (status === 'setup') {
      showWarning(t('notice.signInSetup'));
      trackEvent('auth_setup_missing');
      shouldCleanUrl = true;
    } else if (status === 'error') {
      showError(t('notice.signInFailed'));
      trackEvent('auth_error');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'tier') {
      showWarning(t('notice.higherTier'));
      trackEvent('download_blocked_tier');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'signed_out') {
      showInfo(t('notice.sessionExpired'));
      trackEvent('download_blocked_signed_out');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'expired') {
      showWarning(t('notice.linkExpired'));
      trackEvent('download_link_expired');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'missing') {
      showError(t('notice.fileMissing'));
      trackEvent('download_file_missing');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'unavailable') {
      showWarning(t('notice.unavailable'));
      trackEvent('download_unavailable');
      shouldCleanUrl = true;
    }

    if (shouldCleanUrl && window.history && window.history.replaceState) {
      try {
        var clean = new URL(window.location.href);
        clean.searchParams.delete('patreon');
        clean.searchParams.delete('patreonDebug');
        clean.searchParams.delete('patreonUserId');
        clean.searchParams.delete('download');
        window.history.replaceState({}, document.title, clean.toString());
      } catch (e) {}
    }
  }

  function osTags(os) {
    return String(os || '')
      .split('&')
      .map(function (part) { return part.trim(); })
      .filter(Boolean)
      .map(function (part) { return '<span>' + escapeHtml(part) + '</span>'; })
      .join('');
  }

  function buildIcon(build) {
    var haystack = String((build.os || '') + ' ' + (build.name || '')).toLowerCase();
    var icon = 'desktop';
    if (haystack.indexOf('mac') !== -1) icon = 'laptop';
    if (haystack.indexOf('android') !== -1) icon = 'phone';
    if (haystack.indexOf('r2') !== -1 || haystack.indexOf('private') !== -1) icon = 'cloud';
    if (haystack.indexOf('bonus') !== -1 || haystack.indexOf('wallpaper') !== -1) icon = 'file';
    var paths = {
      desktop: '<rect x="4" y="5" width="16" height="11" rx="1.5"></rect><path d="M9 20h6M12 16v4"></path>',
      laptop: '<path d="M5 6h14v9H5z"></path><path d="M3 18h18"></path>',
      phone: '<rect x="8" y="3" width="8" height="18" rx="2"></rect><path d="M11 17h2"></path>',
      cloud: '<path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.4 1.8A3.2 3.2 0 0 0 7 18z"></path>',
      file: '<path d="M7 3h7l4 4v14H7z"></path><path d="M14 3v5h5"></path><path d="M9.5 13h5M9.5 16h5"></path>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + paths[icon] + '</svg>';
  }

  function buildPlatform(build) {
    var os = String(localized(build, 'os') || '');
    if (/windows/i.test(os) && /linux/i.test(os)) return 'Windows + Linux';
    if (/mac/i.test(os)) return 'Mac';
    if (/android/i.test(os)) return 'Android';
    if (/private|r2/i.test(os)) return String(localized(build, 'name') || t('cta.download')).split('|')[0].trim() || t('cta.download');
    if (/bonus|wallpaper|奖励|бонус/i.test(os)) return String(localized(build, 'name') || 'Bonus file').split('|')[0].trim() || 'Bonus file';
    return os || 'Build';
  }

  function buildQuality(build) {
    var type = localized(build, 'type');
    var source = String((type || '') + ' ' + (localized(build, 'name') || '')).toLowerCase();
    if (source.indexOf('4k') !== -1) return '4K';
    if (source.indexOf('1080') !== -1) return '1080p';
    if (source.indexOf('720') !== -1) return '720p';
    return type || t('cta.download');
  }

  function patronUrl() {
    return (config && config.patreonUrl) || 'https://www.patreon.com/c/futaontop';
  }

  function requiredAmountForTier(tier) {
    return Number((tier && tier.minEntitledAmountCents) || (tier && tier.amountCents) || (tier && tier.amount_cents) || 0);
  }

  function isSignedIn() {
    return Boolean(sessionState && sessionState.authenticated);
  }

  function accessRank(accessLevel) {
    var level = String(accessLevel || 'none').toLowerCase();
    if (level === 'creator') return 3;
    if (level === 'oracle') return 2;
    if (level === 'initiate') return 1;
    return 0;
  }

  function syncPageState() {
    if (!document.body) return;
    var signedIn = isSignedIn();
    var level = String((sessionState && sessionState.accessLevel) || 'none').toLowerCase();
    var hasLinks = Object.keys(linksById || {}).length > 0;
    document.body.classList.toggle('is-signed-in', signedIn);
    document.body.classList.toggle('is-signed-out', !signedIn);
    document.body.classList.toggle('has-download-links', hasLinks);
    document.body.classList.toggle('has-no-download-links', !hasLinks);
    document.body.setAttribute('data-access-level', level);
  }

  function requiredRankForTier(tier) {
    var id = String((tier && tier.id) || '').toLowerCase();
    var title = String((tier && tier.title) || '').toLowerCase();
    if (id.indexOf('oracle') !== -1 || title.indexOf('oracle') !== -1 || title.indexOf('ascendant') !== -1) return 2;
    if (id.indexOf('initiate') !== -1 || title.indexOf('initiate') !== -1 || title.indexOf('acolyte') !== -1) return 1;
    return requiredAmountForTier(tier) >= 2450 ? 2 : (requiredAmountForTier(tier) > 0 ? 1 : 0);
  }

  function lockedCtaLabel(build, tier) {
    var quality = buildQuality(build);
    if (isSignedIn() && accessRank(sessionState.accessLevel) > 0 && requiredRankForTier(tier) > accessRank(sessionState.accessLevel)) {
      return localized(tier, 'upgradeLabel') || (quality === '4K' ? t('cta.upgrade4k') : t('cta.upgradeAccess'));
    }
    return localized(tier, 'joinLabel') || (quality === '4K' ? t('cta.unlock4k') : t('cta.unlock1080p'));
  }

  function lockedCtaUrl(tier) {
    if (!isSignedIn()) {
      return apiUrl('/auth/patreon/start?return_to=' + encodeURIComponent(window.location.href));
    }
    return tier.joinUrl || tier.upgradeUrl || patronUrl();
  }

  function isCheckoutPopupTier(tier) {
    return Boolean(isSignedIn() && tier && tier.checkoutPopup && /^https:\/\/www\.patreon\.com\/checkout\//i.test(lockedCtaUrl(tier)));
  }

  function tierActionHtml(group, tier) {
    if (!isSignedIn()) {
      return '';
    }

    var builds = group.builds || [];
    var unlockedCount = builds.filter(function (build) { return Boolean(linksById[build.id]); }).length;
    if (unlockedCount === builds.length && builds.length) {
      return '<span class="download-tier__state download-tier__state--ready">' + escapeHtml(t('cta.downloadsReady')) + '</span>';
    }

    var lockedUrl = lockedCtaUrl(tier);
    var checkoutAttrs = isCheckoutPopupTier(tier)
      ? ' data-checkout-popup="true" aria-describedby="checkout-return-note"'
      : ' target="_blank" rel="noopener noreferrer"';
    return '<a class="download-tier__action download-link--locked" href="' + escapeHtml(lockedUrl) + '" data-tier-action="true"' + checkoutAttrs + '>' + escapeHtml(lockedCtaLabel({ type: requiredRankForTier(tier) > 1 ? '4K' : '1080p' }, tier)) + '</a>';
  }

  function buildStateHtml(build, tier, link) {
    if (link) {
      return '<a class="download-link" href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener noreferrer" data-build-id="' + escapeHtml(build.id) + '">' + escapeHtml(t('cta.download')) + '</a>';
    }

    if (isSignedIn()) {
      var lockedUrl = lockedCtaUrl(tier);
      var checkoutAttrs = isCheckoutPopupTier(tier)
        ? ' data-checkout-popup="true" aria-describedby="checkout-return-note"'
        : ' target="_blank" rel="noopener noreferrer"';
      return '<a class="download-link download-link--locked" href="' + escapeHtml(lockedUrl) + '" data-build-id="' + escapeHtml(build.id) + '"' + checkoutAttrs + '>' + escapeHtml(lockedCtaLabel(build, tier)) + '</a>';
    }

    return '';
  }

  function buildSizeLabel(build) {
    var size = String((build && build.size) || '').trim();
    if (!size || /^tbd$/i.test(size)) return t('notice.comingSoon');
    return size;
  }

  function renderBuilds() {
    var table = qs('[data-download-table]');
    if (!table || !config) return;

    table.innerHTML = groupedBuilds().map(function (group) {
      return group.id === 'test-mode' ? renderDiagnosticsGroup(group) : renderTierGroup(group);
    }).join('');
    syncPageState();
  }

  function groupedBuilds() {
    var builds = Array.isArray(config.builds) ? config.builds : [];
    var tierOrder = (Array.isArray(config.tiers) ? config.tiers : []).map(function (tier) { return tier.id; });
    var known = {};

    return builds.reduce(function (groups, build) {
      var tierId = build.tier || 'other';
      var group = groups.filter(function (item) { return item.id === tierId; })[0];

      if (!group) {
        group = {
          id: tierId,
          tier: tiersById[tierId] || { id: tierId, title: build.access || 'Downloads', price: '', summary: '' },
          builds: []
        };
        groups.push(group);
      }

      group.builds.push(build);
      known[tierId] = true;
      return groups;
    }, []).sort(function (a, b) {
      var ai = tierOrder.indexOf(a.id);
      var bi = tierOrder.indexOf(b.id);
      if (ai === -1) ai = 999;
      if (bi === -1) bi = 999;
      return ai - bi;
    });
  }

  function renderTierGroup(group) {
    var tier = group.tier || {};
    var price = localized(tier, 'price') || tier.price || formatTierPrice(tier.amountCents || tier.amount_cents);
    var summary = localized(tier, 'summary') || tier.summary || '';
    var isTest = group.id === 'test-mode';
    var isPremium = group.id === 'oracle-plus';
    var classes = 'download-tier' + (isTest ? ' download-tier--test' : '') + (isPremium ? ' download-tier--premium' : '');
    var eyebrow = localized(tier, 'eyebrow') || tier.eyebrow || (isTest ? 'Local only' : (isPremium ? 'Premium upgrade' : 'Most popular'));
    var tierAction = tierActionHtml(group, tier);
    var heading = [
      '<section class="' + classes + '" aria-label="' + escapeHtml(localized(tier, 'title') || tier.title || 'Downloads') + '">',
      '<div class="download-tier__header">',
      '<div>',
      '<p class="download-tier__eyebrow">' + escapeHtml(eyebrow) + '</p>',
      '<h2>' + escapeHtml(localized(tier, 'title') || tier.title || 'Downloads') + '</h2>',
      '</div>',
      '<div class="download-tier__meta">',
      price ? '<span>' + escapeHtml(price) + '</span>' : '',
      summary ? '<strong>' + escapeHtml(summary) + '</strong>' : '',
      '</div>',
      tierAction ? '<div class="download-tier__cta">' + tierAction + '</div>' : '',
      '</div>',
      '<div class="download-builds">'
    ].join('');

    return heading + group.builds.map(function (build) {
      var link = linksById[build.id];
      var quality = buildQuality(build);
      var stateHtml = buildStateHtml(build, tier, link);

      return [
        '<article class="download-build" role="row">',
        '<div class="download-build__icon" aria-hidden="true">' + buildIcon(build) + '</div>',
        '<div class="download-build__main">',
        '<h3>' + escapeHtml(buildPlatform(build)) + '</h3>',
        '<p>' + escapeHtml(quality) + '</p>',
        '</div>',
        '<div class="download-build__specs" aria-label="Build details">',
        '<span>' + escapeHtml(buildSizeLabel(build)) + '</span>',
        '</div>',
        '<div class="download-build__tags">' + osTags(build.os) + '</div>',
        stateHtml ? '<div class="download-build__button">' + stateHtml + '</div>' : '',
        '</article>'
      ].join('');
    }).join('') + '</div></section>';
  }

  function renderDiagnosticsGroup(group) {
    var tier = group.tier || {};
    var summary = localized(tier, 'summary') || tier.summary || t('notice.diagnosticsSummary');
    return [
      '<details class="download-diagnostics">',
      '<summary><span>' + escapeHtml(t('notice.diagnostics')) + '</span><small>' + escapeHtml(summary) + '</small></summary>',
      renderTierGroup(group),
      '</details>'
    ].join('');
  }

  function formatTierPrice(cents) {
    var value = Number(cents || 0);
    if (!value) return '';
    return '$' + (value / 100).toFixed(value % 100 ? 2 : 0) + ' / month';
  }

  function updateTiers(tiers) {
    if (Array.isArray(tiers) && tiers.length && tiers !== config.tiers) {
      config.tiers = config.tiers.map(function (tier) {
        var live = tiers.filter(function (item) {
          var liveAmount = Number(item.amountCents || item.amount_cents || 0);
          return item.id === tier.id || (liveAmount > 0 && liveAmount === Number(tier.minEntitledAmountCents || 0));
        })[0];
        return live ? Object.assign({}, live, tier, {
          amountCents: live.amountCents || live.amount_cents,
          joinUrl: live.joinUrl || tier.joinUrl,
          upgradeUrl: live.upgradeUrl || tier.upgradeUrl,
          price: tier.price || formatTierPrice(live.amountCents || live.amount_cents)
        }) : tier;
      });
    }

    tiersById = {};
    (config.tiers || []).forEach(function (tier) {
      tiersById[tier.id] = tier;
    });
  }

  function updateSession(session) {
    var signIn = qs('[data-sign-in]');
    var signOut = qs('[data-sign-out]');
    var wasAuthenticated = isSignedIn();
    sessionState = session && session.authenticated ? session : { authenticated: false, currentlyEntitledAmountCents: 0, accessLevel: 'none' };

    if (session && session.authenticated) {
      if (!wasAuthenticated) {
        trackEvent('auth_session_active', {
          patreon_access_level: session.accessLevel || 'none',
          entitled_amount_cents: Number(session.currentlyEntitledAmountCents || 0)
        });
      }
      if (session.accessLevel === 'creator') {
        setStatus(t('auth.creatorAccess'));
      } else if (session.accessLevel === 'oracle') {
        setStatus(t('auth.oracleAccess'));
      } else if (session.accessLevel === 'initiate') {
        setStatus(t('auth.initiateAccess'));
      } else {
        setStatus(t('auth.noPaidTier'));
      }
      if (signIn) signIn.textContent = t('auth.refreshLinks');
      if (signOut) signOut.hidden = false;
      renderBuilds();
      syncPageState();
      return;
    }

    setStatus(t('auth.checkAccess'));
    if (signIn) signIn.textContent = t('auth.signIn');
    if (signOut) signOut.hidden = true;
    renderBuilds();
    syncPageState();
  }

  function fetchJson(url, options) {
    var controller = window.AbortController ? new AbortController() : null;
    var requestOptions = Object.assign({ credentials: 'include', cache: 'no-cache' }, options || {});
    var timeoutMs = Number(requestOptions.timeoutMs || 10000);
    delete requestOptions.timeoutMs;
    var timeout = controller ? window.setTimeout(function () { controller.abort(); }, timeoutMs) : null;
    if (controller) requestOptions.signal = controller.signal;

    return fetch(url, requestOptions)
      .then(function (res) {
        if (!res.ok) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            var error = new Error(body.error || 'Request failed: HTTP ' + res.status);
            error.status = res.status;
            error.body = body;
            throw error;
          });
        }
        return res.json();
      })
      .finally(function () {
        if (timeout) window.clearTimeout(timeout);
      });
  }

  function checkSession() {
    if (!apiBase()) {
      updateSession(null);
      showWarning(t('notice.downloadsUnavailable'));
      return Promise.resolve();
    }

    return fetchJson(apiUrl('/auth/session'))
      .then(function (session) {
        updateSession(session);
        return fetchJson(apiUrl('/downloads/metadata')).catch(function () { return null; }).then(function (metadata) {
          if (metadata && metadata.tiers) {
            updateTiers(metadata.tiers);
            renderBuilds();
          }
          return session;
        });
      })
      .then(function (session) {
        if (!session.authenticated) return null;
        return fetchJson(apiUrl('/downloads/links'));
      })
      .then(function (payload) {
        if (!payload || !payload.links) return;
        linksById = {};
        payload.links.forEach(function (link) {
          linksById[link.id] = Object.assign({}, link, {
            receivedAt: Date.now(),
            expiresAt: link.expiresInSeconds ? Date.now() + (Number(link.expiresInSeconds) * 1000) : null
          });
        });
        trackEvent('download_links_ready', {
          link_count: payload.links.length
        });
        renderBuilds();
        syncPageState();
        clearNotice();
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') {
          updateSession(null);
          showWarning(isLocalApiBase()
            ? t('notice.localWorkerDown')
            : t('notice.downloadsSlow'));
        } else if (err && err.message === 'Failed to fetch') {
          updateSession(null);
          showWarning(t('notice.downloadsUnreachable'));
        } else if (err && err.status === 401) {
          updateSession(null);
          showInfo(t('notice.sessionExpired'));
        } else if (err && err.status === 403) {
          renderBuilds();
          clearNotice();
        } else {
          updateSession(null);
          showError(t('notice.verifyFailed'));
        }
      });
  }

  function initActions() {
    var signIn = qs('[data-sign-in]');
    var signOut = qs('[data-sign-out]');

    function beginPatreonSignIn() {
      trackEvent(isSignedIn() ? 'links_refresh_click' : 'patreon_sign_in_click');
      if (!apiBase()) {
        showWarning(t('notice.downloadsUnavailable'));
        trackEvent('patreon_sign_in_unavailable', { reason: 'missing_api_base' });
        return;
      }
      if (signIn) signIn.disabled = true;
      setStatus(t('auth.checking'));
      fetchJson(apiUrl('/health'), { timeoutMs: 5000 })
        .then(function () {
          trackEvent(isSignedIn() ? 'links_refresh_health_ok' : 'patreon_sign_in_health_ok');
          window.location.href = apiUrl('/auth/patreon/start?return_to=' + encodeURIComponent(window.location.href));
        })
        .catch(function () {
          if (signIn) signIn.disabled = false;
          setStatus(t('auth.checkAccess'));
          trackEvent(isSignedIn() ? 'links_refresh_failed' : 'patreon_sign_in_failed', {
            reason: isLocalApiBase() ? 'local_worker_unreachable' : 'downloads_unreachable'
          });
          showWarning(isLocalApiBase()
            ? t('notice.localWorkerDown')
            : t('notice.notResponding'));
        });
    }

    if (signIn) signIn.addEventListener('click', beginPatreonSignIn);

    if (signOut) {
      signOut.addEventListener('click', function () {
        trackEvent('patreon_sign_out_click');
        fetchJson(apiUrl('/auth/logout'), { method: 'POST' })
          .catch(function () {})
          .then(function () {
            linksById = {};
            renderBuilds();
            updateSession(null);
          });
      });
    }

    document.addEventListener('click', function (event) {
      var link = event.target && event.target.closest ? event.target.closest('.download-link[href]') : null;
      if (!link && event.target && event.target.closest) link = event.target.closest('.download-tier__action[href]');
      if (!link) return;

      if (link.getAttribute('data-auth-start') === 'true') {
        event.preventDefault();
        beginPatreonSignIn();
        return;
      }

      if (link.classList.contains('download-link--locked') && link.getAttribute('data-checkout-popup') === 'true') {
        event.preventDefault();
        trackEvent('patreon_checkout_click', {
          link_url: link.href
        });
        var width = 760;
        var height = 900;
        var left = Math.max(0, Math.round((window.screen.width - width) / 2));
        var top = Math.max(0, Math.round((window.screen.height - height) / 2));
        var popup = window.open(
          link.href,
          'fotPatreonCheckout',
          'popup=yes,width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',menubar=no,toolbar=no,location=yes,status=no,scrollbars=yes,resizable=yes'
        );
        if (popup) {
          popup.focus();
          setStatus(t('auth.checkoutOpened'));
          showInfo(t('notice.returnRefresh'));
          trackEvent('patreon_checkout_popup_opened');
        } else {
          showInfo(t('notice.returnRefresh'));
          trackEvent('patreon_checkout_popup_blocked');
          window.location.href = link.href;
        }
      }

      if (!link.classList.contains('download-link--locked')) {
        var buildId = link.getAttribute('data-build-id') || '';
        var build = buildById(buildId);
        var signedLink = linksById[buildId];
        if (signedLink && signedLink.expiresAt && signedLink.expiresAt <= Date.now() + 5000) {
          event.preventDefault();
          showWarning(t('notice.refreshingExpired'));
          trackEvent('download_click_expired_link', buildEventParams(build));
          checkSession();
          return;
        }
        trackEvent('download_click', buildEventParams(build, {
          link_url: link.href
        }));
        return;
      }

      if (link.classList.contains('download-link--locked')) {
        trackEvent('locked_download_click', {
          link_url: link.href,
          is_checkout_popup: link.getAttribute('data-checkout-popup') === 'true'
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    currentLang = detectLanguage();
    applyLanguage(currentLang);
    document.querySelectorAll('.lang-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        var lang = button.getAttribute('data-lang') || 'en';
        if (!STRINGS[lang]) lang = 'en';
        try {
          localStorage.setItem('fotLanguage', lang);
        } catch (e) {}
        applyLanguage(lang);
      });
    });

    fetch(configUrl(), { credentials: 'same-origin', cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        config = data;
        applyLanguage(currentLang);
        qs('[data-download-title]').textContent = localized(data, 'title') || 'Downloads';
        qs('[data-download-subtitle]').textContent = localized(data, 'subtitle') || '';
        updateTiers(data.tiers || []);
        renderBuilds();
        initActions();
        trackEvent('page_loaded', {
          config_url: configUrl(),
          build_count: Array.isArray(data.builds) ? data.builds.length : 0,
          tier_count: Array.isArray(data.tiers) ? data.tiers.length : 0
        });
        showPatreonReturnMessage();
        return checkSession();
      })
      .catch(function () {
        showError(t('notice.pageLoadFailed'));
      });
  });
})();
