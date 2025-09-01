const medicos = [
    { id: 1, nome: "Dr. Cleber", modalidades: ["online"], preco: "R$ 180,00", nota: 4.9, crm: "CRM - SP 284692" },
    { id: 2, nome: "Dra. Marina s.", modalidades: ["domiciliar"], preco: "R$ 200,00", nota: 4.7, crm: "CRM - SP 123456" },
    { id: 3, nome: "Dr. Jorge", modalidades: ["online", "domiciliar"], preco: "R$ 220,00", nota: 4.8, crm: "CRM - SP 654321" },
    { id: 4, nome: "Dr. Bruno", modalidades: ["online"], preco: "R$ 150,00", nota: 4.5, crm: "CRM - SP 789012" },
    { id: 5, nome: "Dra. Jéssica", modalidades: ["online", "domiciliar"], preco: "R$ 210,00", nota: 4.6, crm: "CRM - SP 345678" }
];

function filtrarMedicos(medicos, filtroSelecionado) {
    if (filtroSelecionado.length === 0) return medicos;
    return medicos.filter(medico =>
        filtroSelecionado.every(modalidade => medico.modalidades.includes(modalidade))
    );
}

function aplicarFiltro() {
    const filtros = [...document.querySelectorAll('.filtro:checked')].map(cb => cb.value);
    const medicosFiltrados = filtrarMedicos(medicos, filtros);
    renderizarMedicos(medicosFiltrados);
}

function renderizarMedicos(lista) {
    const container = document.querySelector(".perfis"); // ALTERADO AQUI
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhum médico encontrado com os filtros selecionados.</p>";
        return;
    }
    lista.forEach(medico => {
        container.innerHTML += `
        <section class="retangulo">
            <section class="small-rectangle">
                <img src="imagens/perfil.png" alt="Imagem" class="perfil1">
                <section class="infos">
                    <p class="nome">${medico.nome}</p>
                    <p class="idnt">${medico.crm}</p>
                    <p>${medico.preco}</p>
                    <p class="nota">${medico.nota} <img src="imagens/star-l.png" alt="Estrela" class="nota-img"></p>
                    <p><strong>Atendimento:</strong> ${medico.modalidades.join(", ")}</p>
                </section>
            </section>
        </section>
        `;
    });
}

// Aguarda o DOM carregar antes de executar
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona listener para atualizar ao marcar/desmarcar os checkboxes
    document.querySelectorAll('.filtro').forEach(cb => {
        cb.addEventListener('change', aplicarFiltro);
    });
    
    // Renderiza lista completa ao iniciar
    renderizarMedicos(medicos);
});