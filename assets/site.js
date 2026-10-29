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
  // Launch-news age check (14+): ask for birth year before showing the Sender form.
  // The year is only checked here, never saved or sent. Under 14: the form stays closed on this device.
  (function () {
    var MIN_AGE = 14, KEY = 'yk-signup-blocked-v1', NO = 'Sorry, launch news is for people 14 and older.';
    var boxes = document.querySelectorAll('.signup-form');
    if (!boxes.length) return;
    var css = document.createElement('style');
    css.textContent = '.age-gate[hidden],.age-gate [hidden]{display:none!important}.age-gate{margin:10px auto;max-width:320px;text-align:left}.age-gate label{display:block;font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;opacity:.75}' +
      '.age-gate select{display:block;width:100%;box-sizing:border-box;margin-top:4px;height:44px;padding:0 12px;border:1px solid #D6CCBE;border-radius:12px;background:#fff;color:#2E2A26;font-size:16px;font-weight:500;font-family:inherit}' +
      '.age-gate button{display:block;width:100%;margin-top:10px;height:44px;border:0;border-radius:999px;background:#2E2A26;color:#FBF8F3;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer}' +
      '.age-gate .age-msg{margin-top:8px;font-size:14px;font-weight:600;line-height:1.4;color:#A9482B}.age-gate .age-note{margin-top:8px;font-size:12px;opacity:.7}';
    document.head.appendChild(css);
    function blocked() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
    var y = new Date().getFullYear();
    boxes.forEach(function (box, n) {
      var field = box.querySelector('.sender-form-field'); if (!field) return;
      field.hidden = true;
      var g = document.createElement('div'); g.className = 'age-gate';
      var id = 'ykYear' + n, opts = '<option value="">Select year</option>';
      for (var k = y; k >= y - 100; k--) opts += '<option value="' + k + '">' + k + '</option>';
      g.innerHTML = '<label for="' + id + '">Birth year</label><select id="' + id + '">' + opts + '</select>' +
        '<button type="button">Continue</button><div class="age-msg" aria-live="polite"></div>' +
        '<div class="age-note">We only check your birth year. It is never saved.</div>';
      field.parentNode.insertBefore(g, field);
      var sel = g.querySelector('select'), btn = g.querySelector('button'), msg = g.querySelector('.age-msg');
      function shut() { sel.hidden = true; btn.hidden = true; g.querySelector('label').hidden = true; g.querySelector('.age-note').hidden = true; msg.textContent = NO; }
      if (blocked()) { shut(); return; }
      btn.addEventListener('click', function () {
        var yr = +sel.value;
        if (!yr) { msg.textContent = 'Please choose your birth year.'; return; }
        sel.value = '';
        // With only a year we can't tell if this year's birthday has passed, so the borderline year counts as under 14.
        if (y - yr <= MIN_AGE) {
          try { localStorage.setItem(KEY, '1'); } catch (e) {}
          shut(); if (window.ykEvent) window.ykEvent('signup-age-refused'); return;
        }
        g.hidden = true; field.hidden = false;
        if (window.ykEvent) window.ykEvent('signup-age-ok');
      });
    });
  })();
  // Sender.net form: if it hasn't appeared after 8 seconds (ad blocker, network), show an email fallback instead.
  setTimeout(function () {
    document.querySelectorAll('.signup-form').forEach(function (box) {
      var f = box.querySelector('.sender-form-field'), fb = box.querySelector('.signup-fallback');
      if (f && fb && !f.children.length) { f.style.minHeight = '0'; fb.hidden = false; }
    });
  }, 8000);
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
