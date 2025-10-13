document.addEventListener("DOMContentLoaded", () => {
    // --- Lógica do Filtro da Tabela ---
    const filtroNome = document.getElementById("filtroNome");
    const filtroArea = document.getElementById("filtroArea");
    const filtroId = document.getElementById("filtroId");
    const tabelaBody = document.querySelector("#tabelaUsuarios tbody");

    function filtrarTabela() {
        if (!tabelaBody) return; 

        const nome = filtroNome.value.trim().toLowerCase();
        const area = filtroArea.value.trim().toLowerCase();
        const id = filtroId.value.trim().toLowerCase();

        for (let row of tabelaBody.rows) {
            const cellNome = row.cells[0].textContent.toLowerCase();
            const cellArea = row.cells[1].textContent.toLowerCase();
            const cellId = row.cells[2].textContent.toLowerCase();

            const matchNome = cellNome.includes(nome);
            const matchArea = cellArea.includes(area);
            const matchId = cellId.includes(id);

            if (matchNome && matchArea && matchId) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }

    if (filtroNome) filtroNome.addEventListener("input", filtrarTabela);
    if (filtroArea) filtroArea.addEventListener("input", filtrarTabela);
    if (filtroId) filtroId.addEventListener("input", filtrarTabela);


    // --- Lógica do Destaque Cinza do Menu Lateral ---
    const links = document.querySelectorAll("nav a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            localStorage.setItem("activeLink", link.getAttribute("href"));
        });
    });

    // Função para ativar o link na carga da página
    function activateLinkOnLoad() {
        const activeLinkHref = localStorage.getItem("activeLink");
        let foundActiveLink = false;

        if (activeLinkHref) {
            links.forEach(link => {
                if (link.getAttribute("href") === activeLinkHref) {
                    link.classList.add("active");
                    foundActiveLink = true;
                }
            });
        }
        
        // Se a página for a primeira carregada (ou nenhum link salvo), ativa a que corresponde à URL atual.
        if (!foundActiveLink && links.length > 0) {
            const currentPath = window.location.pathname.split('/').pop() || links[0].getAttribute("href");
            const currentLink = document.querySelector(`nav a[href="${currentPath}"]`);
            
            if (currentLink) {
                 currentLink.classList.add("active");
                 localStorage.setItem("activeLink", currentLink.getAttribute("href"));
            } else {
                 links[0].classList.add("active");
                 localStorage.setItem("activeLink", links[0].getAttribute("href"));
            }
        }
    }

    activateLinkOnLoad();
});



// --- Lógica do Botão Limpar ---
const btnLimpar = document.getElementById("btn-limpar-filtros");
const filtroPaciente = document.getElementById("filtro-paciente");
const filtroProfissional = document.getElementById("filtro-profissional");

if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
        // Limpa os campos de texto
        if (filtroNome) filtroNome.value = "";
        if (filtroArea) filtroArea.value = "";
        if (filtroId) filtroId.value = "";
        
        // Reseta os checkboxes para o estado padrão (Paciente desmarcado, Profissional marcado)
        if (filtroPaciente) filtroPaciente.checked = false;
        if (filtroProfissional) filtroProfissional.checked = true;
        
        // Refiltra a tabela para mostrar todos os resultados
        filtrarTabela();
    });
}


