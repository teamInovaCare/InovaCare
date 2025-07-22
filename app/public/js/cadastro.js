document.addEventListener('DOMContentLoaded', function() {
 
var btnEntrar = document.querySelector("#entrar"); // Adicione # para selecionar por ID
var btnCad = document.querySelector("#cad");
var body = document.querySelector("body");
 
btnEntrar.addEventListener("click", function(){
    body.className = "entrar-js"; // Mudei para usar hífen em vez de ponto
   
});
 
btnCad.addEventListener("click", function(){
    body.className = "cad-js"; // Mudei para usar hífen em vez de ponto
     
});
 
});