(function () {
  'use strict';

  var config = null;
  var linksById = {};
  var tiersById = {};
  var sessionState = { authenticated: false, currentlyEntitledAmountCents: 0, accessLevel: 'none' };

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
      build_name: build ? build.name : '',
      build_tier: build ? build.tier : '',
      build_size: build ? buildSizeLabel(build) : '',
      build_type: build ? build.type : '',
      tier_title: tier ? tier.title : '',
      required_amount_cents: requiredAmountForTier(tier)
    }, extra || {});
  }

  function showNotice(text, kind) {
    var error = qs('[data-download-error]');
    if (!error) return;
    error.textContent = text || '';
    error.classList.toggle('is-visible', Boolean(text));
    error.setAttribute('data-notice-kind', kind || 'error');
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
      showInfo('Sign-in cancelled.');
      trackEvent('auth_cancelled');
      shouldCleanUrl = true;
    } else if (status === 'setup') {
      showWarning('Patreon sign-in is not ready yet.');
      trackEvent('auth_setup_missing');
      shouldCleanUrl = true;
    } else if (status === 'error') {
      showError('Sign-in failed. Try again.');
      trackEvent('auth_error');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'tier') {
      showWarning('Higher tier needed.');
      trackEvent('download_blocked_tier');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'signed_out') {
      showInfo('Session expired. Sign in again.');
      trackEvent('download_blocked_signed_out');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'expired') {
      showWarning('Link expired. Refresh links.');
      trackEvent('download_link_expired');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'missing') {
      showError('File not available yet.');
      trackEvent('download_file_missing');
      shouldCleanUrl = true;
    } else if (downloadStatus === 'unavailable') {
      showWarning('Downloads temporarily unavailable.');
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
    var os = String(build.os || '');
    if (/windows/i.test(os) && /linux/i.test(os)) return 'Windows + Linux';
    if (/mac/i.test(os)) return 'Mac';
    if (/android/i.test(os)) return 'Android';
    if (/private|r2/i.test(os)) return String(build.name || 'Download').split('|')[0].trim() || 'Download';
    if (/bonus|wallpaper/i.test(os)) return String(build.name || 'Bonus file').split('|')[0].trim() || 'Bonus file';
    return os || 'Build';
  }

  function buildQuality(build) {
    var source = String((build.type || '') + ' ' + (build.name || '')).toLowerCase();
    if (source.indexOf('4k') !== -1) return '4K';
    if (source.indexOf('1080') !== -1) return '1080p';
    if (source.indexOf('720') !== -1) return '720p';
    return build.type || 'Download';
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
      return tier.upgradeLabel || (quality === '4K' ? 'Upgrade for 4K' : 'Upgrade Access');
    }
    return tier.joinLabel || (quality === '4K' ? 'Unlock 4K' : 'Unlock 1080p');
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
      return '<span class="download-tier__state download-tier__state--ready">Downloads ready</span>';
    }

    var lockedUrl = lockedCtaUrl(tier);
    var checkoutAttrs = isCheckoutPopupTier(tier)
      ? ' data-checkout-popup="true" aria-describedby="checkout-return-note"'
      : ' target="_blank" rel="noopener noreferrer"';
    return '<a class="download-tier__action download-link--locked" href="' + escapeHtml(lockedUrl) + '" data-tier-action="true"' + checkoutAttrs + '>' + escapeHtml(lockedCtaLabel({ type: requiredRankForTier(tier) > 1 ? '4K' : '1080p' }, tier)) + '</a>';
  }

  function buildStateHtml(build, tier, link) {
    if (link) {
      return '<a class="download-link" href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener noreferrer" data-build-id="' + escapeHtml(build.id) + '">Download</a>';
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
    if (!size || /^tbd$/i.test(size)) return 'Coming soon';
    return size;
  }

  function renderBuilds() {
    var table = qs('[data-download-table]');
    if (!table || !config) return;

    table.innerHTML = groupedBuilds().map(function (group) {
      return group.id === 'test-mode' ? renderDiagnosticsGroup(group) : renderTierGroup(group);
    }).join('');
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
    var price = tier.price || formatTierPrice(tier.amountCents || tier.amount_cents);
    var summary = tier.summary || '';
    var isTest = group.id === 'test-mode';
    var isPremium = group.id === 'oracle-plus';
    var classes = 'download-tier' + (isTest ? ' download-tier--test' : '') + (isPremium ? ' download-tier--premium' : '');
    var eyebrow = tier.eyebrow || (isTest ? 'Local only' : (isPremium ? 'Premium upgrade' : 'Most popular'));
    var tierAction = tierActionHtml(group, tier);
    var heading = [
      '<section class="' + classes + '" aria-label="' + escapeHtml(tier.title || 'Downloads') + '">',
      '<div class="download-tier__header">',
      '<div>',
      '<p class="download-tier__eyebrow">' + escapeHtml(eyebrow) + '</p>',
      '<h2>' + escapeHtml(tier.title || 'Downloads') + '</h2>',
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
    var summary = tier.summary || 'Download diagnostics.';
    return [
      '<details class="download-diagnostics">',
      '<summary><span>Diagnostics</span><small>' + escapeHtml(summary) + '</small></summary>',
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
        setStatus('Creator access');
      } else if (session.accessLevel === 'oracle') {
        setStatus('Oracle access');
      } else if (session.accessLevel === 'initiate') {
        setStatus('Initiate access');
      } else {
        setStatus('No paid tier');
      }
      if (signIn) signIn.textContent = 'Refresh Links';
      if (signOut) signOut.hidden = false;
      renderBuilds();
      return;
    }

    setStatus('Check access');
    if (signIn) signIn.textContent = 'Sign in with Patreon';
    if (signOut) signOut.hidden = true;
    renderBuilds();
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
      showWarning('Downloads unavailable.');
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
        clearNotice();
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') {
          updateSession(null);
          showWarning(isLocalApiBase()
            ? 'Local Worker is not responding.'
            : 'Downloads are taking longer than expected.');
        } else if (err && err.message === 'Failed to fetch') {
          updateSession(null);
          showWarning('Could not reach downloads.');
        } else if (err && err.status === 401) {
          updateSession(null);
          showInfo('Session expired. Sign in again.');
        } else if (err && err.status === 403) {
          renderBuilds();
          clearNotice();
        } else {
          updateSession(null);
          showError('Could not verify access.');
        }
      });
  }

  function initActions() {
    var signIn = qs('[data-sign-in]');
    var signOut = qs('[data-sign-out]');

    function beginPatreonSignIn() {
      trackEvent(isSignedIn() ? 'links_refresh_click' : 'patreon_sign_in_click');
      if (!apiBase()) {
        showWarning('Downloads unavailable.');
        trackEvent('patreon_sign_in_unavailable', { reason: 'missing_api_base' });
        return;
      }
      if (signIn) signIn.disabled = true;
      setStatus('Checking...');
      fetchJson(apiUrl('/health'), { timeoutMs: 5000 })
        .then(function () {
          trackEvent(isSignedIn() ? 'links_refresh_health_ok' : 'patreon_sign_in_health_ok');
          window.location.href = apiUrl('/auth/patreon/start?return_to=' + encodeURIComponent(window.location.href));
        })
        .catch(function () {
          if (signIn) signIn.disabled = false;
          setStatus('Check access');
          trackEvent(isSignedIn() ? 'links_refresh_failed' : 'patreon_sign_in_failed', {
            reason: isLocalApiBase() ? 'local_worker_unreachable' : 'downloads_unreachable'
          });
          showWarning(isLocalApiBase()
            ? 'Local Worker is not responding.'
            : 'Downloads are not responding.');
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
          setStatus('Checkout opened');
          showInfo('Return here and refresh links.');
          trackEvent('patreon_checkout_popup_opened');
        } else {
          showInfo('Return here and refresh links.');
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
          showWarning('Refreshing expired link.');
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
    fetch(configUrl(), { credentials: 'same-origin', cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        config = data;
        qs('[data-download-title]').textContent = data.title || 'Downloads';
        qs('[data-download-subtitle]').textContent = data.subtitle || '';
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
        showError('Could not load this page.');
      });
  });
})();
