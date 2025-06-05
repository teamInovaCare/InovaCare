document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const senha = document.getElementById("senhad");
    const confirmarSenha = document.getElementById("repsenhad");
    const mensagem = document.getElementById("mensagem");

    // Impede colar no campo de confirmação
    confirmarSenha.addEventListener("paste", function(e){
        e.preventDefault();
    });

    form.addEventListener("submit", function (e) {
        if (senha.value !== confirmarSenha.value) {
            e.preventDefault(); // Impede envio do formulário
            mensagem.innerHTML = "Erro ao confirmar a senha";
            mensagem.style.color = "red";
            confirmarSenha.focus();
        } else {
            mensagem.innerHTML = ""; // limpa mensagem se estiver correto
        }
    });
});