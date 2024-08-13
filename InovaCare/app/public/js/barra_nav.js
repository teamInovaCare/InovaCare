/*Configuração da rolagem do hambúrguer*/

function showSidebar(){
    const sidebar= document.querySelector(".sidebar");
    sidebar.style.display = "flex";
}

function hideSidebar(){
    const sidebar= document.querySelector(".sidebar");
    sidebar.style.display = "none";
}

// Configuração do indicador e dos links de navegação
const links = document.querySelectorAll("nav ul li");

function ativarLink() {
    links.forEach(link => link.classList.remove("ativo"));
    this.classList.add("ativo");
    updateIndicator();
}

function updateIndicator() {
    const ativo = document.querySelector("nav ul li.ativo");
    const indicador = document.querySelector(".indicador");
    if (ativo && indicador) {
        const offset = Array.from(links).indexOf(ativo);
        indicador.style.transform = `translateX(${offset * 100}%)`;
    }
}

links.forEach(link => link.addEventListener("click", ativarLink));

