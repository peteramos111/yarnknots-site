/* Shared behaviour for every Yarn Knots page: stats, contact form, social links, footer year. */
(function () {
  var C = window.YK_CONFIG || {};

  // Cookie-free visitor stats (GoatCounter). Loads only once a site code is set.
  if (C.goatcounterCode) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://' + C.goatcounterCode + '.goatcounter.com/count');
    document.head.appendChild(s);
  }
  // Count a named event, e.g. ykEvent('demo-level-3'). Events wait in a queue until the stats script is ready.
  var queue = window.ykQueue = window.ykQueue || [];
  function gcReady() { return window.goatcounter && typeof window.goatcounter.count === 'function'; }
  function send(name) { try { window.goatcounter.count({ path: name, title: name, event: true }); } catch (e) {} }
  var tries = 0;
  function flush() {
    if (gcReady()) { queue.splice(0).forEach(send); return; }
    if (C.goatcounterCode && tries++ < 30) setTimeout(flush, 1000);
  }
  window.ykEvent = function (name) { queue.push(name); flush(); };
  window.addEventListener('load', function () { setTimeout(flush, 500); });

  function status(form, msg, ok) {
    var el = form.querySelector('.form-status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'form-status ' + (ok ? 'ok' : 'err');
  }

  // Contact form (Formspree).
  document.querySelectorAll('form[data-contact]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!C.formspreeUrl) { status(form, 'The form isn’t connected yet. Please email ' + C.contactEmail + ' instead.', false); return; }
      var btn = form.querySelector('button'); btn.disabled = true;
      fetch(C.formspreeUrl, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { status(form, 'Thanks! Your message is on its way. We usually reply within two business days.', true); form.reset(); window.ykEvent('contact-sent'); }
          else status(form, 'Something went wrong. Please check the fields, or email ' + C.contactEmail + '.', false);
        })
        .catch(function () { status(form, 'That didn’t go through. Please email ' + C.contactEmail + ' instead.', false); })
        .finally(function () { btn.disabled = false; });
    });
  });

  // Social links and email address from settings.
  document.querySelectorAll('[data-social]').forEach(function (a) {
    var url = (C.socials || {})[a.getAttribute('data-social')];
    if (url) a.href = url; else a.hidden = true;
  });
  document.querySelectorAll('[data-email]').forEach(function (el) {
    el.textContent = C.contactEmail;
    if (el.tagName === 'A') el.href = 'mailto:' + C.contactEmail;
  });
  // Sender.net form: if it hasn't appeared after 8 seconds (ad blocker, network), show an email fallback instead.
  setTimeout(function () {
    document.querySelectorAll('.signup-form').forEach(function (box) {
      var f = box.querySelector('.sender-form-field'), fb = box.querySelector('.signup-fallback');
      if (f && fb && !f.children.length) { f.style.minHeight = '0'; fb.hidden = false; }
    });
  }, 8000);
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
