/* Shared one-time age gate for Futa on Top pages. */
(function () {
  'use strict';

  var initialized = false;
  var storageKey = 'ageConfirmed';
  var exitUrl = 'https://x.com/Futa_on_Top';

  function qs(selector) {
    return document.querySelector(selector);
  }

  function track(eventName, payload) {
    var data = Object.assign({
      send_to: window.FOT_GA_ID,
      gate_name: 'age_verification',
      transport_type: 'beacon'
    }, payload || {});

    if (typeof window.FOTAnalyticsEvent === 'function') {
      window.FOTAnalyticsEvent(eventName, data);
      return;
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, data);
    }
  }

  function confirmed() {
    try {
      return window.localStorage.getItem(storageKey) === 'yes';
    } catch (error) {
      return false;
    }
  }

  function saveConfirmation() {
    try {
      window.localStorage.setItem(storageKey, 'yes');
    } catch (error) {
      /* If storage is blocked, keep the current page usable after the click. */
    }
  }

  function initAgeGate() {
    if (initialized) return;

    var modal = qs('#age-modal');
    if (!modal) {
      document.documentElement.classList.remove('age-pending');
      return;
    }

    initialized = true;

    function show() {
      document.documentElement.classList.add('age-pending');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('age-locked');
      track('age_gate_shown');
    }

    function hide() {
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('age-pending');
      document.body.classList.remove('age-locked');
    }

    function decline(result) {
      track('age_gate_decline_click', { gate_result: result || 'declined' });
      window.location.href = exitUrl;
    }

    var accept = qs('#age-accept');
    var declineButton = qs('#age-decline');

    if (accept) {
      accept.addEventListener('click', function () {
        track('age_gate_accept_click', { gate_result: 'accepted' });
        saveConfirmation();
        hide();
      });
    }

    if (declineButton) {
      declineButton.addEventListener('click', function () {
        decline('declined');
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        decline('escape_key');
      }
    });

    if (!confirmed()) {
      show();
    } else {
      hide();
    }
  }

  window.FOTInitAgeGate = initAgeGate;

  document.addEventListener('DOMContentLoaded', initAgeGate);
})();
