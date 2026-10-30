/* Digiferro · formulaire de devis
   Validation en français, champ piège anti-robot, pré-remplissage par ?formation=<id>.

   BRANCHER L'ENVOI : renseigner l'attribut data-endpoint du <form>, par exemple
     - Formspree : data-endpoint="https://formspree.io/f/VOTRE_ID"
     - Netlify Forms : ajouter data-netlify="true" et name="devis" au <form>, et data-endpoint="/"
     - Backend maison : URL qui accepte un POST multipart/form-data et répond 2xx
   Sans data-endpoint, l'envoi est simulé (rien ne part) : à remplacer avant la mise en ligne. */
(() => {
  const forms = document.querySelectorAll('[data-form]');
  if (!forms.length) return;

  const MSG = {
    nom: { valueMissing: 'Indiquez votre nom et votre prénom.' },
    email: {
      valueMissing: 'Indiquez votre adresse e-mail.',
      typeMismatch: 'Cette adresse e-mail ne semble pas valide (exemple : prenom.nom@entreprise.fr).',
    },
    telephone: {
      valueMissing: 'Indiquez un numéro de téléphone pour vous rappeler.',
      invalid: 'Ce numéro ne semble pas valide (exemple : 06 12 34 56 78).',
    },
    formation: { valueMissing: 'Choisissez une formation ou un pack dans la liste.' },
    participants: {
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

    // Pré-sélection de la formation depuis l'URL (contact.html?formation=tcs-m#devis)
    const pre = new URLSearchParams(location.search).get('formation');
    const select = form.querySelector('select[name="formation"]');
    if (pre && select && [...select.options].some((o) => o.value === pre)) select.value = pre;

    const check = (el) => {
      const field = el.closest('.field');
      const err = field && field.querySelector('.field__err');
      if (!err) return true;
      const m = MSG[el.name] || {};
      const v = el.validity;
      let msg = '';
      if (v.valueMissing || (el.required && !el.value.trim())) msg = m.valueMissing || 'Ce champ est obligatoire.';
      else if (v.badInput) msg = m.badInput || 'Valeur non valide.';
      else if (v.typeMismatch) msg = m.typeMismatch || 'Valeur non valide.';
      else if (v.rangeUnderflow) msg = m.rangeUnderflow;
      else if (v.rangeOverflow) msg = m.rangeOverflow;
      else if (v.stepMismatch) msg = m.stepMismatch;
      else if (el.name === 'telephone' && !phoneOk(el.value)) msg = m.invalid;
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
        status.textContent = invalid.length > 1 ? `${invalid.length} champs sont à corriger.` : 'Un champ est à corriger.';
        invalid[0].focus();
        return;
      }
      // Champ piège rempli : probablement un robot. On affiche le succès sans rien envoyer.
      const trap = form.querySelector('[name="site_web"]');
      if (trap && trap.value) return done();

      const endpoint = form.dataset.endpoint;
      form.classList.add('is-sending');
      try {
        if (endpoint) {
          const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } else {
          await new Promise((r) => setTimeout(r, 400));
          console.info('[Digiferro] Formulaire valide, mais aucun data-endpoint n’est configuré : rien n’a été envoyé.');
        }
        done();
      } catch (err) {
        status.textContent = `L’envoi a échoué. Réessayez dans un instant${phoneLabel ? `, ou appelez le ${phoneLabel.trim()}` : ''}.`;
      } finally {
        form.classList.remove('is-sending');
      }
    });
  });
})();
