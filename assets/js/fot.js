/* Futa on Top - free posts + Vowbound helpers */
(function () {
  'use strict';

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''));
    if (isNaN(d.getTime())) return iso;
    try {
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return iso;
    }
  }

  function formatDuration(seconds) {
    var n = Number(seconds);
    if (!isFinite(n) || n <= 0) return '';
    var mins = Math.floor(n / 60);
    var secs = Math.round(n % 60);
    return mins ? mins + ':' + String(secs).padStart(2, '0') : secs + 's';
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&' + 'amp;')
      .replace(/</g, '&' + 'lt;')
      .replace(/>/g, '&' + 'gt;')
      .replace(/"/g, '&' + 'quot;')
      .replace(/'/g, '&#39;');
  }

  function renderPosts(data) {
    var grid = qs('#free-posts-grid');
    var note = qs('#free-posts-note');
    if (!grid) return;

    var posts = (data && data.posts) || [];
    if (!posts.length) {
      grid.innerHTML =
        '<p class="posts-empty">No free posts cached yet. <a href="https://www.patreon.com/futaontop" target="_blank" rel="noopener noreferrer">Open Patreon</a>.</p>';
      return;
    }

    grid.innerHTML = posts
      .map(function (p) {
        var title = escapeHtml(p.title || 'Free post');
        var url = escapeHtml(p.url || 'https://www.patreon.com/futaontop');
        var excerpt = escapeHtml(p.excerpt || '');
        var rawTag = p.tag || 'Free';
        var tag = escapeHtml(String(rawTag).toLowerCase() === 'free' ? 'Public post' : rawTag);
        var cta = escapeHtml(p.cta || 'Read free post');
        var dateText = formatDate(p.date);
        var date = escapeHtml(dateText);
        var dateIso = escapeHtml(p.date || '');
        var img = p.image ? escapeHtml(p.image) : '';
        var ariaTitle = escapeHtml('Read free post: ' + (p.title || 'Free post'));

        var media =
          '<a class="post-card__media' +
          (img ? '' : ' post-card__media--empty') +
          '" href="' +
          url +
          '" target="_blank" rel="noopener noreferrer" aria-label="' +
          ariaTitle +
          '">' +
          (img
            ? '<img src="' +
              img +
              '" alt="" loading="lazy" decoding="async" width="640" height="360" />'
            : '') +
          '<span class="post-card__shade" aria-hidden="true"></span>' +
          '<span class="post-card__tag">' +
          tag +
          '</span>' +
          (date
            ? '<time class="post-card__date" datetime="' + dateIso + '">' + date + '</time>'
            : '') +
          '</a>';

        return (
          '<article class="post-card post-card--media">' +
          media +
          '<div class="post-card__body">' +
          '<h3><a href="' +
          url +
          '" target="_blank" rel="noopener noreferrer">' +
          title +
          '</a></h3>' +
          (excerpt ? '<p class="post-card__excerpt">' + excerpt + '</p>' : '') +
          '<a class="post-card__more" href="' +
          url +
          '" target="_blank" rel="noopener noreferrer" aria-label="' +
          ariaTitle +
          '">' +
          cta +
          ' -></a>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    qsa('.post-card__media img', grid).forEach(function (imgEl) {
      imgEl.addEventListener('error', function () {
        var media = imgEl.closest('.post-card__media');
        if (media) media.classList.add('post-card__media--empty', 'post-card__media--broken');
        imgEl.remove();
      }, { once: true });
    });

    if (note) {
      var bits = [];
      if (data.updated) bits.push('Updated ' + formatDate(data.updated));
      bits.push('Public / free posts only');
      bits.push('Full posts on Patreon');
      note.textContent = bits.join(' | ');
    }
  }

  function loadFreePosts() {
    if (!qs('#free-posts-grid')) return;

    fetch('data/free-posts.json', { credentials: 'same-origin', cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(renderPosts)
      .catch(function () {
        renderPosts({
          updated: '',
          posts: [
            {
              title: 'Free posts on Patreon',
              url: 'https://www.patreon.com/futaontop',
              date: '',
              image: null,
              excerpt: 'Public drops live on Patreon. Support unlocks full chapter downloads and extras.',
              tag: 'Free',
              cta: 'Open Patreon'
            }
          ]
        });
      });
  }

  function initAgeGate() {
    var modal = qs('#age-modal');
    if (!modal) return;

    function showAgeModal() {
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('age-locked');
    }

    function hideAgeModal() {
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('age-locked');
    }

    try {
      if (localStorage.getItem('ageConfirmed') === 'yes') return;
      showAgeModal();

      var accept = qs('#age-accept');
      var decline = qs('#age-decline');

      if (accept) {
        accept.addEventListener('click', function () {
          localStorage.setItem('ageConfirmed', 'yes');
          hideAgeModal();
        });
      }

      if (decline) {
        decline.addEventListener('click', function () {
          window.location.href = 'https://x.com/Futa_on_Top';
        });
      }

      document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        if (modal.getAttribute('aria-hidden') === 'false') {
          window.location.href = 'https://x.com/Futa_on_Top';
        }
      });
    } catch (e) {
      /* Keep the page usable if storage is blocked. */
      showAgeModal();
    }
  }

  function renderRedgifs(data) {
    var grid = qs('#animations-grid');
    var note = qs('#animations-note');
    if (!grid) return;

    var items = (data && data.items) || [];
    var localPosters = [
      'images/thumbs/1_13_wedding_1_result_thumb.webp',
      'images/thumbs/1_7_wedding_1_result_thumb.webp',
      'images/thumbs/1_141_prison copy_result_thumb.webp',
      'images/thumbs/1_149_prison_result_thumb.webp',
      'images/thumbs/1_214_prison_result_thumb.webp',
      'images/thumbs/1_245_prison_result_thumb.webp'
    ];

    if (!items.length) {
      grid.innerHTML =
        '<article class="animation-card animation-card--empty">' +
        '<div class="animation-card__body">' +
        '<h3>Latest animations</h3>' +
        '<p>The animation feed could not be loaded here. Try again later or check Patreon for new previews.</p>' +
        '<a class="fot-btn fot-btn--patreon" href="https://www.patreon.com/futaontop" target="_blank" rel="noopener noreferrer">Open Patreon</a>' +
        '</div>' +
        '</article>';
      if (note) note.textContent = '';
      return;
    }

    grid.innerHTML = items
      .map(function (item, index) {
        var embed = escapeHtml(item.embed || '');
        var poster = escapeHtml(item.localPoster || localPosters[index % localPosters.length]);
        var duration = escapeHtml(formatDuration(item.duration));
        var audio = item.hasAudio ? 'Audio' : 'Silent';
        var title = 'Futaheim animation ' + (index + 1);
        var ratio =
          Number(item.width) > 0 && Number(item.height) > 0
            ? Math.max(0.55, Math.min(1.8, Number(item.width) / Number(item.height)))
            : 16 / 9;

        return (
          '<article class="animation-card" style="--animation-ratio:' +
          ratio +
          '">' +
          '<div class="animation-player">' +
          '<img class="animation-poster" src="' +
          poster +
          '" alt="" loading="lazy" decoding="async" width="640" height="360" onerror="this.remove()" />' +
          '<button class="animation-play" type="button" data-animation-embed="' +
          embed +
          '" data-animation-title="' +
          escapeHtml(title) +
          '" aria-label="Play animation preview">' +
          '<span class="animation-play__icon" aria-hidden="true"></span>' +
          '<span>Play</span>' +
          '</button>' +
          '<div class="animation-chip-row" aria-hidden="true">' +
          (duration ? '<span>' + duration + '</span>' : '') +
          '<span>' +
          escapeHtml(audio) +
          '</span>' +
          '</div>' +
          '</div>' +
          '<div class="animation-card__body">' +
          '<h3>' +
          title +
          '</h3>' +
          '<span>Tap Play to watch</span>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    if (note) {
      var bits = [];
      if (data.updated) bits.push('Updated ' + formatDate(data.updated));
      bits.push('Tap Play to watch');
      note.textContent = bits.join(' | ');
    }
  }

  function initRedgifsPlayers() {
    var grid = qs('#animations-grid');
    if (!grid || grid.getAttribute('data-animation-ready') === 'true') return;
    grid.setAttribute('data-animation-ready', 'true');

    grid.addEventListener('click', function (event) {
      var button = event.target && event.target.closest
        ? event.target.closest('[data-animation-embed]')
        : null;
      if (!button || !grid.contains(button)) return;

      var embed = button.getAttribute('data-animation-embed');
      if (!embed) return;

      var player = button.closest('.animation-player');
      var card = button.closest('.animation-card');
      if (!player || player.querySelector('iframe')) return;

      var iframe = document.createElement('iframe');
      iframe.src = embed;
      iframe.title = button.getAttribute('data-animation-title') || 'Animation preview';
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.setAttribute('frameborder', '0');

      player.appendChild(iframe);
      if (card) card.classList.add('is-playing');
      button.disabled = true;
      button.setAttribute('aria-hidden', 'true');
    });
  }

  function loadRedgifs() {
    if (!qs('#animations-grid')) return;

    fetch('data/redgifs.json', { credentials: 'same-origin', cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        renderRedgifs(data);
        initRedgifsPlayers();
      })
      .catch(function () {
        renderRedgifs({
          updated: '',
          sourceUrl: 'https://www.redgifs.com/users/veluxa',
          items: []
        });
      });
  }

  function initHeaderScroll() {
    var header = qs('#header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function markExternal() {
    qsa('a[href^="http"]').forEach(function (a) {
      try {
        if (a.hostname && a.hostname !== window.location.hostname) {
          if (!a.target) a.target = '_blank';
          var rel = (a.getAttribute('rel') || '').toLowerCase();
          if (rel.indexOf('noopener') === -1) {
            a.setAttribute('rel', (rel ? rel + ' ' : '') + 'noopener noreferrer');
          }
        }
      } catch (e) {
        /* ignore */
      }
    });
  }

  function initFastAnchors() {
    function jump(event) {
      var source = event.target || event.srcElement;
      if (!source || !source.closest) return;

      var link = source.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target;
      try {
        target = qs(hash);
      } catch (e) {
        return;
      }
      if (!target) return;

      if (hash === '#throxxa' && window.getComputedStyle(target).display === 'none') {
        target = qs('#work') || target;
        hash = '#work';
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      var header = qs('#header');
      var offset = header ? header.offsetHeight - 1 : 0;
      var y = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - offset);
      window.scrollTo({ top: y, left: 0, behavior: 'auto' });
      history.pushState(null, '', hash);
    }

    document.addEventListener('pointerdown', jump, true);
    document.addEventListener('click', jump, true);
  }

  function initVowboundScrollBridge(root) {
    qsa('.vb-main', root).forEach(function (scroller) {
      scroller.addEventListener('wheel', function (event) {
        if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

        var maxScroll = scroller.scrollHeight - scroller.clientHeight;
        if (maxScroll <= 1) return;

        var atTop = scroller.scrollTop <= 1;
        var atBottom = scroller.scrollTop >= maxScroll - 1;
        var goingUp = event.deltaY < 0;
        var goingDown = event.deltaY > 0;

        if ((goingUp && atTop) || (goingDown && atBottom)) {
          event.preventDefault();
          window.scrollBy({ top: event.deltaY, left: 0, behavior: 'auto' });
        }
      }, { passive: false });
    });
  }

  function initVowbound() {
    var root = qs('.vowbound');
    if (!root) return;

    var page1 = qs('#vb-page-1');
    var page2 = qs('#vb-page-2');
    if (!page1 || !page2) return;

    var tabs = qsa('.vb-tabs [data-vb-page]', root);
    var indexEl = qs('#vb-page-index');

    initVowboundScrollBridge(root);

    tabs.forEach(function (tab, index) {
      var panel = index === 0 ? page1 : page2;
      tab.id = 'vb-tab-' + (index + 1);
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = index === 0 ? 2 : 1;
        else if (event.key === 'Home') next = 1;
        else if (event.key === 'End') next = 2;
        else return;
        event.preventDefault();
        goTo(next);
        tabs[next - 1].focus({ preventScroll: true });
      });
    });

    function goTo(n) {
      var page = Number(n) === 2 ? 2 : 1;
      page1.classList.toggle('is-on', page === 1);
      page2.classList.toggle('is-on', page === 2);

      if (page === 1) {
        page1.removeAttribute('hidden');
        page2.setAttribute('hidden', '');
      } else {
        page2.removeAttribute('hidden');
        page1.setAttribute('hidden', '');
      }

      tabs.forEach(function (tab) {
        var on = Number(tab.getAttribute('data-vb-page')) === page;
        tab.classList.toggle('is-on', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
      });

      qsa('.vb-main', page === 1 ? page1 : page2).forEach(function (main) {
        main.scrollTop = 0;
      });

      if (indexEl) indexEl.textContent = 'PAGE 0' + page + ' / 02';

    }

    qsa('[data-vb-page]').forEach(function (el) {
      el.addEventListener('click', function () {
        var page = Number(el.getAttribute('data-vb-page'));
        goTo(page);
        if (!el.closest('.vb-tabs')) {
          root.closest('.throxxa-section').scrollIntoView({ block: 'start' });
          tabs[page - 1].focus({ preventScroll: true });
        }
      });
    });

    goTo(1);
  }

  function scheduleNonCriticalWork(callback) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 1800 });
      return;
    }
    window.setTimeout(callback, 700);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAgeGate();
    initFastAnchors();
    initVowbound();
    initHeaderScroll();
    markExternal();

    scheduleNonCriticalWork(function () {
      loadRedgifs();
      loadFreePosts();
    });
  });
})();
