/* Aguatudo — formulário de reserva (página inicial e /gs1)
   WhatsApp + primeiro nome + perfil + consentimento. Um envio só, pelo Formspree.
   Proteção contra robôs sem atrito: campo-armadilha oculto (_gotcha) e trava de tempo. */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status  = document.getElementById('form-status');
  const sucesso = document.getElementById('passo3');
  const tel     = document.getElementById('whatsapp');
  const nome    = document.getElementById('nome');
  const aceite  = document.getElementById('aceite');
  const origem  = document.getElementById('origem');
  const telE164 = document.getElementById('whatsapp_e164');

  /* origem: ?origem=gs1, ?origem=instagram… (cai para utm_source; senão, o padrão da página) */
  const qs = new URLSearchParams(location.search);
  const limpa = v => (v || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  const origemFinal = limpa(qs.get('origem')) || limpa(qs.get('utm_source')) ||
                      (origem && origem.value) || 'site';
  if (origem) origem.value = origemFinal;

  /* WhatsApp: aceita com ou sem +55 e formata como (DD) 9XXXX-XXXX */
  function digitosBR(v) {
    let d = (v || '').replace(/\D/g, '');
    if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
    if (d.length > 11 && d.startsWith('0')) d = d.replace(/^0+/, '');
    return d.slice(0, 11);
  }
  function mascara(d) {
    if (!d) return '';
    if (d.length <= 2) return '(' + d;
    const ddd = d.slice(0, 2), r = d.slice(2);
    if (r.length <= 4) return `(${ddd}) ${r}`;
    if (d.length <= 10) return `(${ddd}) ${r.slice(0, 4)}-${r.slice(4)}`;
    return `(${ddd}) ${r.slice(0, 5)}-${r.slice(5)}`;
  }
  if (tel) tel.addEventListener('input', () => { tel.value = mascara(digitosBR(tel.value)); });

  /* Trava de tempo: robôs preenchem e enviam quase instantaneamente */
  const tCarga = Date.now();
  let tPrimeiroToque = null;
  form.addEventListener('input', () => { if (tPrimeiroToque === null) tPrimeiroToque = Date.now(); });

  let enviando = false;
  function aviso(txt, campo) {
    status.textContent = txt; status.style.color = '#c25400';
    if (campo) campo.focus();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (enviando) return;

    const d = digitosBR(tel.value);
    if (d.length < 10 || Number(d.slice(0, 2)) < 11) {
      aviso('Confira o WhatsApp: DDD + número, ex. (19) 99530-9944.', tel); return;
    }
    if (!nome.value.trim()) { aviso('Como podemos te chamar?', nome); return; }
    if (!aceite.checked) { aviso('Marque o aceite para receber o aviso pelo WhatsApp.', aceite); return; }

    const agora = Date.now();
    if (agora - tCarga < 3000 || tPrimeiroToque === null || agora - tPrimeiroToque < 1500) {
      aviso('Aguarde um instante e tente novamente.'); return;
    }

    if (telE164) telE164.value = '+55' + d;
    const perfil = (form.querySelector('input[name="perfil"]:checked') || {}).value || 'não informado';

    enviando = true;
    status.textContent = 'Enviando…'; status.style.color = '#3f6270';
    try {
      const res = await fetch(form.action, {
        method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', { event_label: 'waitlist', origem: origemFinal, perfil: perfil });
        }
        form.hidden = true;
        sucesso.hidden = false;
        sucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        aviso('Houve um problema ao enviar. Tente novamente.'); enviando = false;
      }
    } catch {
      aviso('Erro de conexão. Verifique sua internet.'); enviando = false;
    }
  });
})();
