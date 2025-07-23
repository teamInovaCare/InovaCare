/*document.addEventListener('DOMContentLoaded', function() {
 
var btnEntrar = document.querySelector("#entrar"); // Adicione # para selecionar por ID
var btnCad = document.querySelector("#cad");
var body = document.querySelector("body");
 
btnEntrar.addEventListener("click", function(){
    body.className = "entrar-js"; // Mudei para usar hífen em vez de ponto
   
});
 
btnCad.addEventListener("click", function(){
    body.className = "cad-js"; // Mudei para usar hífen em vez de ponto
     
});

document.getElementById('entrar').addEventListener('click', function() {
    // Verifica se há erros de login antes de alternar
    if (!document.querySelector('.error') || !document.querySelector('.spanerroS')) {
        document.querySelector('.container').classList.add('entrar-js');
    }
});

document.getElementById('cad').addEventListener('click', function() {
    document.querySelector('.container').classList.remove('entrar-js');
});
 
});*/

document.addEventListener('DOMContentLoaded', function() {
    // Seletores
    const btnEntrar = document.getElementById('entrar');
    const btnCad = document.getElementById('cad');
    const container = document.querySelector('.container');
    
    // Verifica se há erros de validação quando a página carrega
    const hasLoginErrors = document.querySelector('.erroValidacao') || 
                         document.querySelector('.spanerroS');
    
    // Se houver erros de login, mostra o formulário de login
    if (hasLoginErrors) {
        container.classList.add('entrar-js');
    }
    
    // Evento para o botão Entrar
    btnEntrar.addEventListener('click', function(e) {
        e.preventDefault();
        container.classList.add('entrar-js');
    });
    
    // Evento para o botão Cadastrar
    btnCad.addEventListener('click', function(e) {
        e.preventDefault();
        container.classList.remove('entrar-js');
    });
});

