/* Aguatudo — monte o seu pedido. Não cobra nada: só leva a escolha para o
   formulário (campo "pedido") e para a mensagem do WhatsApp. */
(function () {
  const box = document.getElementById('montar');
  if (!box) return;
  const MODELOS = {
    outdoor:      { nome: 'Aguatudo Outdoor',      preco: 450, agro: false },
    indoor:       { nome: 'Aguatudo Indoor',       preco: 329, agro: false },
    agro_outdoor: { nome: 'Aguatudo Agro Outdoor', preco: 699, agro: true },
    agro_estufa:  { nome: 'Aguatudo Agro Estufa',  preco: 499, agro: true }
  };
  /* Kit de gotejamento: 4 vasos R$ 50, 8 vasos R$ 90, depois R$ 30 a cada 4 (até 28) */
  const KIT = { 0: 0, 4: 50, 8: 90, 12: 120, 16: 150, 20: 180, 24: 210, 28: 240 };
  const $ = id => document.getElementById(id);
  const val = n => (box.querySelector(`input[name="${n}"]:checked`) || {}).value;
  const brl = v => 'R$ ' + v.toLocaleString('pt-BR');
  let qtd = 1;

  function atualizar() {
    const m = MODELOS[val('m_modelo')] || MODELOS.outdoor;
    $('m-volt').hidden = m.agro; $('m-kit').hidden = m.agro; $('m-bivolt').hidden = !m.agro;
    const vasos = m.agro ? 0 : Number(val('m_kit') || 0);
    const partes = [`${qtd}× ${m.nome}`, m.agro ? 'bivolt' : val('m_volt')];
    if (vasos) partes.push(`kit de gotejamento para ${vasos} vasos` + (qtd > 1 ? ' (cada)' : ''));
    if (m.agro) partes.push('contator a definir');
    const total = qtd * (m.preco + KIT[vasos]);
    const texto = partes.join(', ') + ` — estimado ${brl(total)}`;
    $('m-qtd').textContent = qtd;
    $('m-texto').textContent = partes.join(' · ');
    $('m-total').textContent = brl(total);
    return texto;
  }
  box.addEventListener('change', atualizar);
  $('m-menos').addEventListener('click', () => { qtd = Math.max(1, qtd - 1); atualizar(); });
  $('m-mais').addEventListener('click',  () => { qtd = Math.min(20, qtd + 1); atualizar(); });

  document.querySelectorAll('.btn-escolher').forEach(b => b.addEventListener('click', () => {
    const r = box.querySelector(`input[name="m_modelo"][value="${b.dataset.modelo}"]`);
    if (r) r.checked = true;
    atualizar();
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof gtag === 'function') gtag('event', 'select_item', { item_name: b.dataset.modelo });
  }));

  $('m-pedir').addEventListener('click', () => {
    const texto = atualizar();
    const campo = $('pedido'), resumo = $('pedido-resumo');
    if (campo) campo.value = texto;
    if (resumo) { resumo.querySelector('span').textContent = texto; resumo.hidden = false; }
    if (typeof gtag === 'function') gtag('event', 'add_to_cart', { item_name: val('m_modelo'), value: texto });
  });
  atualizar();
})();
