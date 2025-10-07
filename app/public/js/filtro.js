const medicos = [
            {
                id: 1,
                nome: 'Cleber Jr.',
                crm: 'CRM - SP 284692',
                preco: 'R$ 180,00',
                nota: '4,9',
                modalidades: ['online', 'domiciliar'],
                localizacao: 'São Paulo'
            },
            {
                id: 2,
                nome: 'Marina Silva',
                crm: 'CRM - RJ 103456',
                preco: 'R$ 120,00',
                nota: '4,8',
                modalidades: ['online'],
                localizacao: 'Rio de Janeiro'
            },
            {
                id: 3,
                nome: 'Jorge Santos',
                crm: 'CRM - RJ 120383',
                preco: 'R$ 180,00',
                nota: '4,9',
                modalidades: ['domiciliar'],
                localizacao: 'Rio de Janeiro'
            },
            {
                id: 4,
                nome: 'Bruno Pacheco',
                crm: 'CRM - SP 612029',
                preco: 'R$ 210,00',
                nota: '5',
                modalidades: ['online', 'domiciliar'],
                localizacao: 'São Paulo'
            },
            {
                id: 5,
                nome: 'Jéssica Matos',
                crm: 'CRM - SP 389237',
                preco: 'R$ 80,00',
                nota: '4,7',
                modalidades: ['online'],
                localizacao: 'São Paulo'
            }
        ];

        function renderizarMedicos(medicosParaExibir) {
            const container = document.querySelector('.perfis');
            container.innerHTML = '';

            if (medicosParaExibir.length === 0) {
                container.innerHTML = `
                    <div class="sem-resultados">
                        <i class="bi bi-search"></i>
                        <p>Nenhum médico encontrado com os filtros aplicados.</p>
                    </div>
                `;
                return;
            }

            const imagens = ['perfil.png', 'perfil.png', 'perfil.png', 'perfil.png', 'perfil.png'];
            medicosParaExibir.forEach((medico, index) => {
                const imagemPerfil = imagens[index % imagens.length];
                const card = `
                    <section class="retangulo">
                        <section class="small-rectangle">
                            <img src="imagens/${imagemPerfil}" alt="Perfil" class="perfil1">
                            <section class="infos">
                                <section class="btn-mod">
                                    ${medico.modalidades.includes('online') ? '<button class="btn">Agendar online</button>' : ''}
                                    ${medico.modalidades.includes('domiciliar') ? '<button class="btn-domiciliar">Agendar domiciliar</button>' : ''}
                                </section>
                                <p class="nome">${medico.nome}</p>
                                <p class="idnt">${medico.crm}</p>
                                <div class="preco-nota">
                                    <span class="preco">${medico.preco}</span>
                                    <span class="nota">${medico.nota} <span style="color: #ffa500;">★</span></span>
                                </div>
                            </section>
                        </section>
                    </section>
                `;
                container.insertAdjacentHTML('beforeend', card);
            });
        }

        function aplicarFiltros() {
            const filtroModalidade = document.getElementById('filtro-modalidade').value;
            const filtroLocalizacao = document.getElementById('filtro-localizacao').value;

            const filtrados = medicos.filter(medico => {
                const matchModalidade = filtroModalidade === '' || medico.modalidades.includes(filtroModalidade);
                const matchLocalizacao = filtroLocalizacao === '' || medico.localizacao === filtroLocalizacao;
                return matchModalidade && matchLocalizacao;
            });

            renderizarMedicos(filtrados);
        }
        
        // Inicializar a página
        document.addEventListener('DOMContentLoaded', function() {
            renderizarMedicos(medicos);

            // Adicionar event listeners para os selects
            document.getElementById('filtro-modalidade').addEventListener('change', aplicarFiltros);
            document.getElementById('filtro-localizacao').addEventListener('change', aplicarFiltros);
        });
            
function limparFiltros() {
    document.getElementById('filtro-modalidade').value = '';
    document.getElementById('filtro-localizacao').value = '';
    renderizarMedicos(medicos);
}

// Adicionar event listener para o botão limpar se existir
document.addEventListener('DOMContentLoaded', function() {
    const btnLimpar = document.querySelector('.btn-limpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparFiltros);
    }
});