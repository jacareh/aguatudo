document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const locale = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';

  const MSG = {
    pt: {
      needOne: 'Por favor, preencha pelo menos E-mail ou WhatsApp.',
      ok: 'Muito obrigado pelo contato! Retornaremos o mais rápido possível.',
      err: 'Houve um problema ao enviar. Tente novamente.',
      net: 'Erro de conexão. Verifique sua internet.'
    },
    en: {
      needOne: 'Please fill at least Email or WhatsApp.',
      ok: 'Thanks for your message! We’ll get back to you shortly.',
      err: 'There was a problem sending your message. Please try again.',
      net: 'Network error. Please check your connection.'
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email')?.value || '').trim();
    const whatsapp = (document.getElementById('whatsapp')?.value || '').trim();

    if (!email && !whatsapp) {
      status.textContent = MSG[locale].needOne;
      status.style.color = '#ffd166';
      return;
    }

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        status.textContent = MSG[locale].ok;
        status.style.color = '#06d6a0';
      } else {
        status.textContent = MSG[locale].err;
        status.style.color = '#ef476f';
      }
    } catch {
      status.textContent = MSG[locale].net;
      status.style.color = '#ef476f';
    }
  });
});
