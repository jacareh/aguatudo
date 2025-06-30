
document.getElementById('contact-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById('form-status');
  const data = new FormData(form);
  const email = data.get('email');
  const whatsapp = data.get('whatsapp');

  // Verifica se pelo menos um dos dois campos está preenchido
  if (!email && !whatsapp) {
    status.textContent = "Por favor, preencha pelo menos o campo de e-mail ou WhatsApp.";
    status.style.color = "#ffc107";
    return;
  }

  try {
    const response = await fetch("https://formspree.io/f/xgvydwdb", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      form.reset();
      status.textContent = "Muito obrigado pelo contato! Retornaremos o mais rápido possível.";
      status.style.color = "#28a745";
    } else {
      status.textContent = "Houve um problema ao enviar. Tente novamente.";
      status.style.color = "#dc3545";
    }
  } catch (error) {
    status.textContent = "Erro de conexão. Verifique sua internet.";
    status.style.color = "#dc3545";
  }
});
