
document.getElementById('contact-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById('form-status');
  const data = new FormData(form);

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
