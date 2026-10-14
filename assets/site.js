/* Shared behaviour for every Yarn Knots page: stats, signup and contact forms, social links, footer year. */
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
  // Count a named event, e.g. ykEvent('demo-level-3'). Safe to call before stats load.
  window.ykEvent = function (name) {
    try {
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true });
      else (window.ykQueue = window.ykQueue || []).push(name);
    } catch (e) {}
  };
  window.addEventListener('load', function () {
    setTimeout(function () { (window.ykQueue || []).forEach(window.ykEvent); window.ykQueue = []; }, 1500);
  });

  function status(form, msg, ok) {
    var el = form.querySelector('.form-status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'form-status ' + (ok ? 'ok' : 'err');
  }

  // Launch email signup (MailerLite).
  document.querySelectorAll('form[data-signup]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type=email]').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status(form, 'Please enter a valid email address.', false); return; }
      if (!form.querySelector('input[name=consent]').checked) { status(form, 'Please tick the box so we can email you.', false); return; }
      if (!C.mailerliteFormUrl) { status(form, 'Signups open very soon. Please check back in a day or two!', false); return; }
      var data = new FormData();
      data.append('fields[email]', email);
      data.append('ml-submit', '1');
      data.append('anticsrf', 'true');
      var btn = form.querySelector('button'); btn.disabled = true;
      fetch(C.mailerliteFormUrl, { method: 'POST', body: data, mode: 'no-cors' })
        .then(function () {
          status(form, 'You’re on the list! Biscuit will let you know the moment Yarn Knots launches.', true);
          form.reset(); window.ykEvent('signup-' + (form.getAttribute('data-signup') || 'site'));
        })
        .catch(function () { status(form, 'That didn’t go through. Please try again, or email ' + C.contactEmail + '.', false); })
        .finally(function () { btn.disabled = false; });
    });
  });

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
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
