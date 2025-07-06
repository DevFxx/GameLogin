function verificarSenhas() {
  const senha = document.getElementById("passwordI");
  const Csenha = document.getElementById("CpasswordI");
  const button = document.getElementById("button");
  const msg = document.getElementById("msgSenha");

  if (Csenha.value === senha.value && senha.value !== "") {
    button.disabled = false;
    msg.style.display = "none";
  } else {
    button.disabled = true;
    msg.textContent = "❌ Senhas diferentes!";
    msg.style.display = "block";
  }
}
