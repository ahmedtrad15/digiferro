/* Digiferro · formulaire d’inscription
   Validation en français, case piège anti-robot (botcheck), pré-remplissage par ?formation=<id>.

   ENVOI : Web3Forms (https://web3forms.com). Le point d'envoi (data-endpoint) et la clé d'accès
   (champ caché access_key) viennent de site.formulaire dans data/formations.json. La clé est
   publique par conception : elle ne sert qu'à désigner l'adresse e-mail qui reçoit les demandes.
   Sans data-endpoint, l'envoi est simulé (rien ne part). */
(() => {
  const forms = document.querySelectorAll('[data-form]');
  if (!forms.length) return;

  // Messages d'erreur, indexés par identifiant de champ
  const MSG = {
    'f-nom': { valueMissing: 'Indiquez votre nom et votre prénom.' },
    'f-email': {
      valueMissing: 'Indiquez votre adresse e-mail.',
      typeMismatch: 'Cette adresse e-mail ne semble pas valide (exemple : prenom.nom@entreprise.fr).',
    },
    'f-tel': {
      valueMissing: 'Indiquez un numéro de téléphone pour vous rappeler.',
      invalid: 'Ce numéro ne semble pas valide (exemple : 06 12 34 56 78).',
    },
    'f-formation': { valueMissing: 'Choisissez une formation ou un pack dans la liste.' },
    'f-nb': {
      valueMissing: 'Indiquez le nombre de participants.',
      badInput: 'Indiquez un nombre.',
      rangeUnderflow: 'Il faut au moins 1 participant.',
      rangeOverflow: 'Au-delà de 500 participants, précisez votre besoin dans le message.',
      stepMismatch: 'Indiquez un nombre entier.',
    },
  };
  const phoneOk = (v) => /^\+?[0-9 .()-]+$/.test(v.trim()) && v.replace(/\D/g, '').length >= 9;
  const phoneLabel = (document.querySelector('a[href^="tel:"] span, a[href^="tel:"]') || {}).textContent || '';

  forms.forEach((form) => {
    form.noValidate = true;
    const status = form.querySelector('.form__status');
    const success = form.parentElement.querySelector('.form-success');

    // Pré-sélection de la formation depuis l'URL (contact.html?formation=tcs-m#inscription)
    const pre = new URLSearchParams(location.search).get('formation');
    const select = form.querySelector('#f-formation');
    const match = pre && select && [...select.options].find((o) => o.dataset.id === pre);
    if (match) match.selected = true;

    const check = (el) => {
      const field = el.closest('.field');
      const err = field && field.querySelector('.field__err');
      if (!err) return true;
      const m = MSG[el.id] || {};
      const v = el.validity;
      let msg = '';
      if (v.valueMissing || (el.required && !el.value.trim())) msg = m.valueMissing || 'Ce champ est obligatoire.';
      else if (v.badInput) msg = m.badInput || 'Valeur non valide.';
      else if (v.typeMismatch) msg = m.typeMismatch || 'Valeur non valide.';
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) msg = m.typeMismatch;
      else if (v.rangeUnderflow) msg = m.rangeUnderflow;
      else if (v.rangeOverflow) msg = m.rangeOverflow;
      else if (v.stepMismatch) msg = m.stepMismatch;
      else if (el.type === 'tel' && !phoneOk(el.value)) msg = m.invalid;
      err.textContent = msg;
      field.classList.toggle('is-invalid', Boolean(msg));
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };

    form.addEventListener(
      'blur',
      (e) => {
        const el = e.target;
        if (el.matches('.field input, .field select, .field textarea') && el.value) check(el);
      },
      true
    );
    form.addEventListener('input', (e) => {
      if (e.target.closest('.field.is-invalid')) check(e.target);
    });
    form.addEventListener('change', (e) => {
      if (e.target.matches('select')) check(e.target);
    });

    const done = () => {
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      const fields = [...form.querySelectorAll('.field input, .field select, .field textarea')];
      const invalid = fields.filter((el) => !check(el));
      if (invalid.length) {
        const label = (el) => (form.querySelector(`label[for="${el.id}"]`) || {}).textContent.replace('*', '').trim();
        status.textContent = invalid.length > 1 ? `${invalid.length} champs sont à corriger : ` : 'Un champ est à corriger : ';
        invalid.forEach((el, i) => {
          const a = document.createElement('a');
          a.href = `#${el.id}`;
          a.textContent = label(el);
          a.addEventListener('click', (ev) => {
            ev.preventDefault();
            el.focus();
          });
          status.append(i ? ', ' : '', a);
        });
        status.append('.');
        invalid[0].focus();
        return;
      }
      // Case piège cochée : probablement un robot. On affiche le succès sans rien envoyer.
      const trap = form.querySelector('[name="botcheck"]');
      if (trap && trap.checked) return done();

      // Objet de l'e-mail et page d'origine, pour que la demande soit lisible d'un coup d'œil
      const subject = form.querySelector('[data-subject]');
      const nb = form.querySelector('#f-nb');
      if (subject && select && select.value) subject.value = `Demande d’inscription : ${select.value} (${nb ? nb.value : 1} participant${nb && +nb.value > 1 ? 's' : ''})`;
      const page = form.querySelector('[data-page]');
      if (page) page.value = location.href;

      const endpoint = form.dataset.endpoint;
      const btn = form.querySelector('button[type="submit"]');
      const btnLabel = btn.firstChild.textContent;
      form.classList.add('is-sending');
      form.setAttribute('aria-busy', 'true');
      btn.firstChild.textContent = 'Envoi en cours…';
      try {
        if (endpoint) {
          const payload = Object.fromEntries(new FormData(form));
          delete payload.botcheck;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok || json.success === false) throw new Error(json.message || `HTTP ${res.status}`);
        } else {
          await new Promise((r) => setTimeout(r, 400));
          console.info('[Digiferro] Formulaire valide, mais aucun data-endpoint n’est configuré : rien n’a été envoyé.');
        }
        done();
      } catch (err) {
        status.textContent = `L’envoi a échoué. Réessayez dans un instant${phoneLabel ? `, ou appelez le ${phoneLabel.trim()}` : ''}.`;
      } finally {
        form.classList.remove('is-sending');
        form.removeAttribute('aria-busy');
        btn.firstChild.textContent = btnLabel;
      }
    });
  });
})();
